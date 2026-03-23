import express from 'express';
import fs from 'fs';
import { ChildProcess, spawn } from 'child_process';
import { checkSchema, validationResult, matchedData } from 'express-validator';
import WeightsUpdateSchema from '../Express-Validation Schemas/WeightsUpdateSchema';

const navRouter = express.Router();
let backendProcess: null | ChildProcess = null;

const toDockerPath = (p: string) => {
  if (process.platform !== 'win32') return p;
  const drive = p[0].toLowerCase();
  const rest = p.slice(2).replace(/\\/g, '/');
  return `/${drive}${rest}`;
}

const dataDir = "Backend/data/terminal-d-wider-15/";
const OSRMFileName = "terminal-d-wider_15.osrm";
const hostDir = process.cwd();
const dockerHostDir = toDockerPath(hostDir);
const volume = `${dockerHostDir}/${dataDir}:/data`;
const args = [
  'run',
  '-t',
  '-i',
  '-p', '5003:5000',
  '-v', volume,
  'ghcr.io/project-osrm/osrm-backend',
  'osrm-routed',
  '--algorithm', 'mld',
  '/data/' + OSRMFileName, 
];
const updateCommandArgs = [
  'run',
  '-t',
  '-i',
  '-p', '5003:5000',
  '-v', volume,
  'ghcr.io/project-osrm/osrm-backend',
  'osrm-customize',
  '/data/' + OSRMFileName, 
  '--segment-speed-file', 
];

/*
 * function to start the navigation system
 */
navRouter.get("/start", async (req, res) => {
  if (backendProcess === null) {
    backendProcess = spawn('docker', args, { stdio: 'inherit' });
    res.json({ message: "Routing backend started" })
    return;
  }
  res.json({ message: "Routing backend was already running" })
  return;
})

/*
 * function to update the edge weights of the nav system
 */
navRouter.post("/update", async (req, res) => {
  //For more info on the update flow, see https://github.com/Project-OSRM/osrm-backend/wiki/Traffic
  await checkSchema(WeightsUpdateSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in location argument" });
    return;
  }

  //store the data parsed
  const updateWeightsFileString: string = matchedData(req).fileContents; 

  try {
    const weightUpdatesFileName = "weightUpdates.csv";
    //write the weight updates to a CSV file
    fs.writeFileSync(dataDir + weightUpdatesFileName, updateWeightsFileString);
    if (backendProcess !== null) {
      //add listener for when routing server terminates
      backendProcess.once("exit", (code) => {
        if (backendProcess !== null) {
          //add listener for updating the weights finishes
          backendProcess.once("exit", (code) => {
            //restart the routing service once the weights are updated
            backendProcess = spawn('docker', args, { stdio: 'inherit' });
            res.json({ message: "Routing backend restarted" })
          });
        }
        //update the weights using the written file
        backendProcess = spawn("docker", [...updateCommandArgs, '/data/' + weightUpdatesFileName, ], { stdio: 'inherit' });
      });
      backendProcess.kill('SIGTERM');
    }
  }
  catch (e) {
    console.log("Error updating weights - ", e);
    res.status(500).json({ message: "Error updating weights" });
  }
})

export default navRouter;