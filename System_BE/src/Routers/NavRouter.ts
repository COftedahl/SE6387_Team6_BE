import express from 'express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import ILocation from '../Types/ILocation';
import LocationSchema from '../Express-Validation Schemas/Location';

const navRouter = express.Router();

/*
 * function to get the map
 * @param location: the location of the user
 * @return: map with amenities
 */
navRouter.post("map", async (req, res) => {
  //https://docs.mapbox.com/api/navigation/http-post/
  await checkSchema(LocationSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in location argument"});
    return;
  }

  //store the data corresponding to the item to delete
  const data: any = matchedData(req); 
  const location: ILocation = {x: data.locationX, y: data.locationY};
})

export default navRouter;