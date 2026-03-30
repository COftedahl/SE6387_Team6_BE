import express from 'express';
import fs from 'fs';
import { ChildProcess, spawn } from 'child_process';
import { checkSchema, validationResult, matchedData } from 'express-validator';
import WeightsUpdateSchema from '../Express-Validation Schemas/WeightsUpdateSchema';
import { isContainerRunning, removeContainer, runCmd, stopContainer, waitForExit } from '../Functions/DockerFunctions';

const navRouter = express.Router();
let backendProcess: null | ChildProcess = null;
const OSRMDockerContainerName: string = "OSRMContainer";
const weightUpdatesFileName = "weightUpdates.csv";

const toDockerPath = (p: string) => {
  if (process.platform !== 'win32') return p;
  const drive = p[0].toLowerCase();
  const rest = p.slice(2).replace(/\\/g, '/');
  return `/${drive}${rest}`;
}

// const dataDir = "Backend/data/terminal-d-wider-15/";
const dataDir = "Backend/data/terminal-d-wider-15-accessible/";
// const OSRMFileName = "terminal-d-wider_15.osrm";
const OSRMFileName = "terminal-d-wider-15-accessible.osrm";
const hostDir = process.cwd();
const dockerHostDir = toDockerPath(hostDir);
const volume = `${dockerHostDir}/${dataDir}:/data`;
const args = [
  'run',
  '--name', OSRMDockerContainerName,  
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
  '--name', OSRMDockerContainerName,  
  '-t',
  '-i',
  '-p', '5003:5000',
  '-v', volume,
  'ghcr.io/project-osrm/osrm-backend',
  'osrm-customize',
  '/data/' + OSRMFileName, 
  '--segment-speed-file', '/data/' + weightUpdatesFileName, 
];

/* 
 * function to be run on startup, should start the backend nav server
 */
const handleStartup = async () => {
  const containerIsRunning: any = await isContainerRunning(OSRMDockerContainerName);
  if (backendProcess === null || !containerIsRunning) {
    if (containerIsRunning) {
      await stopContainer(OSRMDockerContainerName);
      await waitForExit(OSRMDockerContainerName);
      await removeContainer(OSRMDockerContainerName);
    }
    backendProcess = spawn('docker', args, { stdio: 'inherit' });
  }
}

//here, call the startup function when the router is started
handleStartup();

/*
 * function to start the navigation system
 */
navRouter.get("/start", async (req, res) => {
  // #swagger.start
    /*
        #swagger.path = '/nav/start'
        #swagger.method = 'get'
        #swagger.description = Start the navigation backend if not already running. '
        #swagger.produces = ['application/json']
    */
    // #swagger.responses[200]
  // #swagger.end
  const containerIsRunning: any = await isContainerRunning(OSRMDockerContainerName);
  if (backendProcess === null || !containerIsRunning) {
    if (containerIsRunning) {
      await stopContainer(OSRMDockerContainerName);
      await waitForExit(OSRMDockerContainerName);
      await removeContainer(OSRMDockerContainerName);
    }
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
  // #swagger.start
    /*
        #swagger.path = '/nav/update'
        #swagger.method = 'post'
        #swagger.description = 'Update the weights used to calculate routes'
        #swagger.produces = ['application/json']
    */
    // #swagger.parameters['fileContents'] = { in: 'body', name: 'fileContents', description: 'String representing contents of a CSV file used to update the weights. For more info on the update flow, see https://github.com/Project-OSRM/osrm-backend/wiki/Traffic. ', required: true, schema: {$ref: "#/components/schemas/weightsUpdate"} } */
    // #swagger.responses[200]
    // #swagger.responses[422]
    // #swagger.responses[500]
  // #swagger.end
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
    //write the weight updates to a CSV file
    fs.writeFileSync(dataDir + weightUpdatesFileName, updateWeightsFileString);
    if (backendProcess !== null) {
      
      await stopContainer(OSRMDockerContainerName);
      await waitForExit(OSRMDockerContainerName);
      await removeContainer(OSRMDockerContainerName);
      console.log("Server container stopped");
      await runCmd('docker', updateCommandArgs);
      await waitForExit(OSRMDockerContainerName);
      await removeContainer(OSRMDockerContainerName);
      console.log("Update data container stopped");
    }
    backendProcess = spawn('docker', args, { stdio: 'inherit' });
    res.json({ message: "Routing backend updated and restarted" })
  }
  catch (e) {
    console.log("Error updating weights - ", e);
    res.status(500).json({ message: "Error updating weights" });
  }
})

export default navRouter;