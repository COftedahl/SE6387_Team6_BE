import express from 'express';
import { checkSchema, validationResult, matchedData } from 'express-validator';
import IDWithOccupancyDetailsSchema from '../Express-Validator Schemas/IDWithOccupancyDetails';
import IOccupancyDetails from '../Types/IOccupancyDetails';

const amenityRouter = express.Router();

/*
 * function to retrieve all the amenity occupancies
 * @return: IOccupancyDetails[] including all the amenity occupancy data
 */
amenityRouter.get("/", async (req, res) => {
  try {
    const result = await fetch(process.env.AMENITY_MANAGER_AMENITIES_ENDPOINT ?? "", {
      method: process.env.AMENITY_MANAGER_AMENITIES_ENDPOINT_METHOD ?? "GET",
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
 * function to update the occupancy of an amenity
 * @param id: string representing the ID of the amenity being updated
 * @param newOccupancy: IOccupancyDetails with the updated occupancy information
 */
amenityRouter.post("/update", async (req, res) => {
  /* #swagger.parameters['id'] = { in: 'body', name: 'id', description: 'id of the amenity to update', required: true, schema: {$ref: "#/components/schemas/id"} } */
  /* #swagger.parameters['details'] = { in: 'body', name: 'details', description: 'new occupancy details', required: true, schema: {$ref: "#/components/schemas/occupancyDetails"} } */
  await checkSchema(IDWithOccupancyDetailsSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in id and occupancy details argument" });
    return;
  }

  //store the data parsed
  const data: any = matchedData(req); 
  const id: string = data.id;
  const occupancyDetails: IOccupancyDetails = data.details;

  const result = await fetch(process.env.SYSTEM_BE_UPDATE_OCCUPANCY_ENDPOINT ?? "", {
    method: process.env.SYSTEM_BE_UPDATE_OCCUPANCY_ENDPOINT_METHOD ?? "POST", 
    headers: {
      "Content-Type": "application/json", 
    }, 
    body: JSON.stringify({id: id, details: occupancyDetails})
  })

  if (result.status === 200) {
    res.status(200).json({ message: "Updated data" })
    return
  }
  else {
    res.status(502).json({ message: "Error saving data - received status " + result.status + "\n\n" + result.body })
  }
})

export default amenityRouter;