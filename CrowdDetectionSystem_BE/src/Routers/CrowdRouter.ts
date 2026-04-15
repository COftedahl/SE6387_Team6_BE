import express from 'express';
import { checkSchema, validationResult, matchedData } from 'express-validator';
import IDAndLevel from '../Express-Validator Schemas/IDAndLevel';
import CROWD_LEVEL from '../Types/CrowdLevel';

const crowdRouter = express.Router();

/*
 * function to retrieve all the crowd levels
 * @return: IComponentCrowd[] including all the crowd data
 */
crowdRouter.get("/", async (req, res) => {
  try {
    const result = await fetch(process.env.INFRASTRUCTURE_MANAGER_HALLWAYS_ENDPOINT ?? "", {
      method: process.env.INFRASTRUCTURE_MANAGER_HALLWAYS_ENDPOINT_METHOD ?? "GET",
    })
    if (result.status === 200) {
      res.status(200).json(await result.json());
      return
    }
    throw new Error("Failed to fetch data - received status " + result.status)
  }
  catch (e) {
    res.status(502).json({ message: (e as Error).message });
  }
})

/*
 * function to update the crowd level of an infrastructural component
 * @param id: string representing the ID of the infrastructural component being updated
 * @param crowdLevel: CROWD_LEVEL (string) with the new crowd level
 */
crowdRouter.post("/update", async (req, res) => {
  /* #swagger.parameters['id'] = { in: 'body', name: 'id', description: 'id of the infrastructural component to update', required: true, schema: {$ref: "#/components/schemas/id"} } */
  /* #swagger.parameters['crowdLevel'] = { in: 'body', name: 'crowdLevel', description: 'new crowd level', required: true, schema: {$ref: "#/components/schemas/crowdLevel"} } */
  await checkSchema(IDAndLevel).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in id and crowd level argument" });
    return;
  }

  //store the data parsed
  const data: any = matchedData(req); 
  const id: string = data.id;
  const crowdLevel: CROWD_LEVEL = data.crowdLevel;

  const result = await fetch(process.env.SYSTEM_BE_UPDATE_CROWD_ENDPOINT ?? "", {
    method: process.env.SYSTEM_BE_UPDATE_CROWD_ENDPOINT_METHOD ?? "POST", 
    headers: {
      "Content-Type": "application/json", 
    }, 
    body: JSON.stringify({id: id, crowdLevel: crowdLevel})
  })

  if (result.status === 200) {
    res.status(200).json({ message: "Updated data" })
    return
  }
  else {
    res.status(502).json({ message: "Error saving data - received status " + result.status + "\n\n" + result.body })
  }
})

export default crowdRouter;