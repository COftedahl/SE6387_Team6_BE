import express from 'express';
import IHallway from '../Types/IHallway';
import ALL_HALLWAYS from '../AllHallways';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import IDAndLevelArrSchema from '../Express-Validator Schemas/IDAndLevelArr';
import IDAndLevelSchema from '../Express-Validator Schemas/IDAndLevel';
import ILeg from '../Types/ILeg';
import HallwayWaypointConverter from '../TSObjects/HallwayWaypointConverter';
import SpeedConverter from '../TSObjects/SpeedConverter';
import INFRASTRUCTURE_STATUS from '../Types/InfrastructureStatus';
import UpdateHandler from '../TSObjects/UpdateHandler';
import IDAndStatusSchema from '../Express-Validator Schemas/IDAndStatus';
import IDAndStatusArrSchema from '../Express-Validator Schemas/IDAndStatusArr';
import CROWD_LEVEL from '../Types/CrowdLevel';
import formatter from '../Formatter';

const hallwayRouter = express.Router();

let hallways: IHallway[] = ALL_HALLWAYS.map((hallway) => {
  return {
    id: hallway.id, 
    name: hallway.name, 
    crowdLevel: CROWD_LEVEL.EMPTY, 
    start: { x: hallway.start.lon, y: hallway.start.lat }, 
    end: { x: hallway.end.lon, y: hallway.end.lat }, 
    status: INFRASTRUCTURE_STATUS.OPEN, 
    lastUpdated: formatter.format(Date.now()), 
  }
});

/*
 * function to get all hallways
 * @return: IHallway[]
 */
hallwayRouter.get("/", async (req, res) => {
  res.status(200).json(hallways);
})

/*
 * function to update a hallway's speed
 * @param id: string indicating id of hallway being updated
 * @param crowdLevel: CROWD_LEVEL (string) indicating the new hallway crowd levels
 * SIDE EFFECTS: modifies speeds stored & used in the navigation BE
 */
hallwayRouter.post("/updatecrowd", async (req, res) => {
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

  const hallwayIndex: number = hallways.findIndex((hallway: IHallway) => hallway.id === id);
  if (hallwayIndex < 0) {
    res.status(422).json({ message: "Invalid id received: the id " + id + " does not correspond to a saved hallway" })
    return
  }

  const newSpeed: number = SpeedConverter.crowdLevelToSpeed(newLevel);
  const updateGroups: ILeg[] = await HallwayWaypointConverter.getHallwayWaypoints(id);

  hallways[hallwayIndex].crowdLevel = newLevel;
  hallways[hallwayIndex].lastUpdated = formatter.format(Date.now());
  await UpdateHandler.saveUpdates(updateGroups.map((leg: ILeg) => { return { start: leg.start, end: leg.end, speed: newSpeed } }), res);
})

/*
 * function to update many hallways' speed
 * @param updates: {id: string, crowdLevel: CROWD_LEVEL}[] indicating the new hallway crowd levels
 * SIDE EFFECTS: modifies speeds stored & used in the navigation BE
 */
hallwayRouter.post("/updateallcrowd", async (req, res) => {
  /* #swagger.parameters['updates'] = { in: 'body', name: 'updates', description: 'array of hallways to update with their new crowd levels', required: true, schema: {$ref: "#/components/schemas/crowdUpdatesArr"} } */
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
    const hallwayUpdating: IHallway = (hallways.find((hallway: IHallway) => hallway.id === update.id) as IHallway);
    hallwayUpdating.crowdLevel = update.crowdLevel;
    hallwayUpdating.lastUpdated = formatter.format(Date.now());
    const newSpeed: number = SpeedConverter.crowdLevelToSpeed(update.crowdLevel);
    const updateGroups: ILeg[] = await HallwayWaypointConverter.getHallwayWaypoints(update.id);
    for (let leg of updateGroups) {
      allNodes.add({start: leg.start, end: leg.end, speed: newSpeed});
    }
  }
  
  const allNodesArr: {start: string, end: string, speed: number}[] = Array.from(allNodes);
  await UpdateHandler.saveUpdates(allNodesArr, res);
})

/*
 * function to update a hallway's status
 * @param id: string indicating id of hallway being updated
 * @param status: INFRASTRUCTURE_STATUS (string) indicating the new hallway status
 * SIDE EFFECTS: modifies speeds stored & used in the navigation BE
 */
hallwayRouter.post("/updatestatus", async (req, res) => {
  /* #swagger.parameters['id'] = { in: 'body', name: 'id', description: 'id of the hallway to update', required: true, schema: {$ref: "#/components/schemas/id"} } */
  /* #swagger.parameters['status'] = { in: 'body', name: 'status', description: 'new status of hallway', required: true, schema: {$ref: "#/components/schemas/status"} } */
  await checkSchema(IDAndStatusSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in id and status argument" });
    return;
  }

  //store the data parsed
  const data: any = matchedData(req); 
  const id: string = data.id;
  const newStatus: INFRASTRUCTURE_STATUS = data.status;

  const hallwayIndex: number = hallways.findIndex((hallway: IHallway) => hallway.id === id);
  if (hallwayIndex < 0) {
    res.status(422).json({ message: "Invalid id received: the id " + id + " does not correspond to a saved hallway" })
    return
  }

  const newSpeed: number = SpeedConverter.statusToSpeed(hallways[hallwayIndex].crowdLevel, newStatus);
  const updateGroups: ILeg[] = await HallwayWaypointConverter.getHallwayWaypoints(id);

  hallways[hallwayIndex].status = newStatus;
  hallways[hallwayIndex].lastUpdated = formatter.format(Date.now());
  await UpdateHandler.saveUpdates(updateGroups.map((leg: ILeg) => { return { start: leg.start, end: leg.end, speed: newSpeed } }), res);
})

/*
 * function to update many hallways' status
 * @param updates: {id: string, status: INFRASTRUCTURE_STATUS}[] indicating the new hallway statuses
 * SIDE EFFECTS: modifies speeds stored & used in the navigation BE
 */
hallwayRouter.post("/updateallstatus", async (req, res) => {
  /* #swagger.parameters['updates'] = { in: 'body', name: 'updates', description: 'array of hallways to update with their new statuses', required: true, schema: {$ref: "#/components/schemas/statusUpdatesArr"} } */
  await checkSchema(IDAndStatusArrSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in id and status argument" });
    return;
  }

  //store the data parsed
  const updates: {id: string, status: INFRASTRUCTURE_STATUS}[] = matchedData(req).updates; 

  for (let update of updates) {
    if (hallways.find((hallway: IHallway) => hallway.id === update.id) === undefined) {
      res.status(422).json({ message: "Invalid id received: the id " + update.id + " does not correspond to a saved hallway" })
      return
    }
  }

  const allNodes: Set<{start: string, end: string, speed: number}> = new Set();
  for (let update of updates) {
    const hallwayUpdating: IHallway = (hallways.find((hallway: IHallway) => hallway.id === update.id) as IHallway);
    hallwayUpdating.status = update.status;
    hallwayUpdating.lastUpdated = formatter.format(Date.now());
    const newSpeed: number = SpeedConverter.statusToSpeed(hallways.find((hall: IHallway) => hall.crowdLevel)?.crowdLevel ?? CROWD_LEVEL.EMPTY, update.status);
    const updateGroups: ILeg[] = await HallwayWaypointConverter.getHallwayWaypoints(update.id);
    for (let leg of updateGroups) {
      allNodes.add({start: leg.start, end: leg.end, speed: newSpeed});
    }
  }
  
  const allNodesArr: {start: string, end: string, speed: number}[] = Array.from(allNodes);
  await UpdateHandler.saveUpdates(allNodesArr, res);
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
    const updateGroups: ILeg[] = await HallwayWaypointConverter.getHallwayWaypoints(hallway.id);
    for (let leg of updateGroups) {
      allNodes.add({start: leg.start, end: leg.end, speed: newSpeed});
    }
  }
  
  const allNodesArr: {start: string, end: string, speed: number}[] = Array.from(allNodes);
  await UpdateHandler.saveUpdates(allNodesArr, res);
})

export default hallwayRouter;