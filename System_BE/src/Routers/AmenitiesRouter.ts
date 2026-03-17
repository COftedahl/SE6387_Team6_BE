import { Router } from 'websocket-express';
import { checkSchema, validationResult, matchedData } from 'express-validator';
import LocationSchema from '../Express-Validation Schemas/Location';
import LocationPlusTypeSchema from '../Express-Validation Schemas/LocationPlusType';
import LocationPlusFiltersSchema from '../Express-Validation Schemas/LocationPlusFilters';
import AmenityIDSchema from '../Express-Validation Schemas/AmenityID';
import FiltersSchema from '../Express-Validation Schemas/Filters';
import IFilter from '../Types/IFilter';
import ILocation from '../Types/ILocation';
import AMENITY_TYPE from '../Types/AmenityType';

const amenitiesRouter = new Router();

/*
 * function to retrieve all amenities
 * @param location: the location of the user
 * @return: IAmenity[]
 */
amenitiesRouter.post("/all", async (req, res) => {
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

/*
 * function to retrieve all amenities of a particular type
 * @param location: the location of the user
 * @param type: desired amenity type
 * @return: IAmenity[]
 */
amenitiesRouter.post("/oftype", async (req, res) => {
  await checkSchema(LocationPlusTypeSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in location and type argument"});
    return;
  }

  //store the data corresponding to the item to delete
  const data: any = matchedData(req); 
  const location: ILocation = {x: data.locationX, y: data.locationY};
  const amenityType: AMENITY_TYPE = data.amenityType;
})

/*
 * function to retrieve amenity suggestions
 * @param location: the location of the user
 * @param filters: filters given by the user
 * @return: IAmenity[]
 */
amenitiesRouter.post("/suggested", async (req, res) => {
  await checkSchema(LocationPlusFiltersSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in location and filters argument"});
    return;
  }

  //store the data corresponding to the item to delete
  const data: any = matchedData(req); 
  const location: ILocation = {x: data.locationX, y: data.locationY};
  const filters: IFilter[] = data.filters;
})

/*
 * function to retrieve the details of a particular amenity
 * @param id: the ID of the amenity for which to retrieve details
 * @return: IAmenityDetails
 */
amenitiesRouter.post("/details", async (req, res) => {
  await checkSchema(AmenityIDSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in amenity id argument"});
    return;
  }

  //store the data corresponding to the item to delete
  const amenityID: string = matchedData(req).id; 
})

/*
 * function to get a filtered list of amenities
 * @param filters: the filters to apply
 * @return: IAmenity[]
 */
amenitiesRouter.post("/filter", async (req, res) => {
  await checkSchema(FiltersSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in filters argument"});
    return;
  }

  //store the data corresponding to the item to delete
  const filters: IFilter[] = matchedData(req).filters;
})

export default amenitiesRouter;