import { Router } from 'websocket-express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import CROWD_LEVEL from '../Types/CrowdLevel';
import IDWithCrowdLevelSchema from '../Express-Validation Schemas/IDWithCrowdLevel';

const infrastructureRouter = new Router();

/*
 * function called when infrastructure crowd level changes (from the crowd level BE)
 * @param id: string containing the id of the amenity for which new occupancy data is being sent
 * @param crowdLevel: string containing the new crowd level
 */
infrastructureRouter.post("/updatecrowd", async (req, res) => {
  /* #swagger.parameters['id'] = { in: 'body', name: 'id', description: 'id of the infrastructural component whose crowd level is being updated', required: true, schema: {$ref: "#/components/schemas/amenityID"} } */
  /* #swagger.parameters['crowdLevel'] = { in: 'body', name: 'crowdLevel', description: 'new crowd level', required: true, schema: {$ref: "#/components/schemas/crowdLevel"} } */
  await checkSchema(IDWithCrowdLevelSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in filters argument" });
    return;
  }

  //store the data parsed
  const data: any = matchedData(req);
  const id: string = data.id;
  const newCrowdLevel: CROWD_LEVEL = data.crowdLevel;

  const result = await fetch(process.env.INFRASTRUCTURE_MANAGER_UPDATE_CROWD_LEVEL_ENDPOINT ?? "", {
    method: process.env.INFRASTRUCTURE_MANAGER_UPDATE_CROWD_LEVEL_ENDPOINT_METHOD ?? "POST", 
    headers: {
      "Content-Type": "application/json",
    }, 
    body: JSON.stringify({ 
      id: id, 
      crowdLevel: newCrowdLevel, 
    })
  })

  if (result.status === 200) {
    res.status(200).json({ message: "Updated " + id })
  }
  else {
    res.status(502).json(await result.json())
  }
})

export default infrastructureRouter;