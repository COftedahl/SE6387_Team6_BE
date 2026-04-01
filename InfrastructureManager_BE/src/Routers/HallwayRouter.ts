import express from 'express';
import IHallway from '../Types/IHallway';
import ALL_HALLWAYS from '../AllHallways';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import IDAndLevelArrSchema from '../Express-Validator Schemas/IDAndLevelArr';
import IDAndLevelSchema from '../Express-Validator Schemas/IDAndLevel';
import ILeg from '../Types/ILeg';
import HallwayWaypointConverter from '../TSObjects/HallwayWaypointConverter';
import SpeedConverter from '../TSObjects/SpeedConverter';

const hallwayRouter = express.Router();

let hallways: IHallway[] = ALL_HALLWAYS;

/*
 * function to get all hallways
 * @return: IHallway[]
 */
hallwayRouter.get("/hallways", async (req, res) => {
  res.status(200).json(hallways);
})

/*
 * function to update a hallway's speed
 * @param id: string indicating id of hallway being updated
 * @param crowdLevel: CROWD_LEVEL (string) indicating the new hallway crowd levels
 * SIDE EFFECTS: modifies speeds stored & used in the navigation BE
 */
hallwayRouter.post("/update", async (req, res) => {
  /* #swagger.parameters['id'] = { in: 'body', name: 'id', description: 'id of the hallway to update', required: true, schema: {$ref: "#/components/schemas/id"} } */
  /* #swagger.parameters['crowdLevel'] = { in: 'body', name: 'crowdLevel', description: 'new crowd level of hallway', required: true, schema: {$ref: "#/components/schemas/crowdLevel"} } */
  await checkSchema(IDAndLevelSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in id and level argument" });
    return;
  }

  //store the data parsed
  const data: any = matchedData(req); 
  const id: string = data.id;
  const newLevel: CROWD_LEVEL = data.crowdLevel;

  if (hallways.find((hallway: IHallway) => hallway.id === id) === undefined) {
    res.status(422).json({ message: "Invalid id received: the id " + id + " does not correspond to a saved hallway" })
    return
  }

  const newSpeed: number = SpeedConverter.crowdLevelToSpeed(newLevel);
  let updateString: string = "";
  const updateGroups: ILeg[] = HallwayWaypointConverter.getHallwayWaypoints(id);
  updateString = updateGroups.map((leg: ILeg) => leg.start + "," + leg.end + "," + newSpeed).join("\n")

  if (updateString.length < 1) {
    res.status(200).json({ message: "No update needed" })
    return;
  }

  const result = await fetch(process.env.NAVIGATION_SYSTEM_UPDATE_ENDPOINT ?? "", {
    method: process.env.NAVIGATION_SYSTEM_UPDATE_ENDPOINT_METHOD ?? "POST", 
    headers: {
      "Content-Type": "application/json"
    }, 
    body: JSON.stringify({fileContents: updateString}), 
  });

  if (result.status === 200) {
    res.status(200).json({ message: (await result.json()).message })
    return
  }
  res.status(502).json({ message: "Error updating navigation BE" })
})

/*
 * function to update many hallways' speed
 * @param updates: {id: string, crowdLevel: CROWD_LEVEL}[] indicating the new hallway crowd levels
 * SIDE EFFECTS: modifies speeds stored & used in the navigation BE
 */
hallwayRouter.post("/updateall", async (req, res) => {
  /* #swagger.parameters['updates'] = { in: 'body', name: 'updates', description: 'array of hallways to update with their new crowd levels', required: true, schema: {$ref: "#/components/schemas/updatesArr"} } */
  await checkSchema(IDAndLevelArrSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in id and level argument" });
    return;
  }

  //store the data parsed
  const updates: {id: string, crowdLevel: CROWD_LEVEL}[] = matchedData(req).updates; 

  for (let update of updates) {
    if (hallways.find((hallway: IHallway) => hallway.id === update.id) === undefined) {
      res.status(422).json({ message: "Invalid id received: the id " + update.id + " does not correspond to a saved hallway" })
      return
    }
  }

  const allNodes: Set<{start: string, end: string, speed: number}> = new Set();
  for (let update of updates) {
    const newSpeed: number = SpeedConverter.crowdLevelToSpeed(update.crowdLevel);
    const updateGroups: ILeg[] = HallwayWaypointConverter.getHallwayWaypoints(update.id);
    for (let leg of updateGroups) {
      allNodes.add({start: leg.start, end: leg.end, speed: newSpeed});
    }
  }
  
  const allNodesArr: {start: string, end: string, speed: number}[] = Array.from(allNodes);
  let updateString: string = allNodesArr.map(({start, end, speed}: {start: string, end: string, speed: number}) => start + "," + end + "," + speed).join("\n")

  if (updateString.length < 1) {
    res.status(200).json({ message: "No update needed" })
    return;
  }

  const result = await fetch(process.env.NAVIGATION_SYSTEM_UPDATE_ENDPOINT ?? "", {
    method: process.env.NAVIGATION_SYSTEM_UPDATE_ENDPOINT_METHOD ?? "POST", 
    headers: {
      "Content-Type": "application/json"
    }, 
    body: JSON.stringify({fileContents: updateString}), 
  });

  if (result.status === 200) {
    res.status(200).json({ message: (await result.json()).message })
    return
  }
  res.status(502).json({ message: "Error updating navigation BE" })
})

/*
 * function to synchronize this system's settings with the router's settings
   * propagating all hallway speed data from this system to overwrite the router's current settings
 * SIDE EFFECTS: modifies speeds stored & used in the navigation BE
 */
hallwayRouter.get("/synchronize", async (req, res) => {
  const allNodes: Set<{start: string, end: string, speed: number}> = new Set();
  for (let hallway of hallways) {
    const newSpeed: number = SpeedConverter.crowdLevelToSpeed(hallway.crowdLevel);
    const updateGroups: ILeg[] = HallwayWaypointConverter.getHallwayWaypoints(hallway.id);
    for (let leg of updateGroups) {
      allNodes.add({start: leg.start, end: leg.end, speed: newSpeed});
    }
  }
  
  const allNodesArr: {start: string, end: string, speed: number}[] = Array.from(allNodes);
  let updateString: string = allNodesArr.map(({start, end, speed}: {start: string, end: string, speed: number}) => start + "," + end + "," + speed).join("\n")

  if (updateString.length < 1) {
    res.status(200).json({ message: "No update needed" })
    return;
  }
  
  const result = await fetch(process.env.NAVIGATION_SYSTEM_UPDATE_ENDPOINT ?? "", {
    method: process.env.NAVIGATION_SYSTEM_UPDATE_ENDPOINT_METHOD ?? "POST", 
    headers: {
      "Content-Type": "application/json"
    }, 
    body: JSON.stringify({fileContents: updateString}), 
  });

  if (result.status === 200) {
    res.status(200).json({ message: (await result.json()).message })
    return
  }
  res.status(502).json({ message: "Error updating navigation BE" })
})

export default hallwayRouter;