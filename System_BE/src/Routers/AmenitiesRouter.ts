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
import AmenityManager from '../TSObjects/AmenityManager';
import FilteringSystem from '../TSObjects/FilteringSystem';
import InfrastructuralResourcesManager from '../TSObjects/InfrastructuralResourcesManager';
import RecommendationSystem from '../TSObjects/RecommendationSystem';
import IAmenityDetails from '../Types/IAmenityDetails';
import IAmenity from '../Types/IAmenity';
import AMENITY_SORTING_TYPE from '../Types/AmenitySortingType';

const amenitiesRouter = new Router();
//initialize all objects needed by the router once to be used for the duration of the server
const amenityManager: AmenityManager = new AmenityManager();
const infrastructureManager: InfrastructuralResourcesManager = new InfrastructuralResourcesManager();
const filteringSystem: FilteringSystem = new FilteringSystem(amenityManager);
const recommendationSystem: RecommendationSystem = new RecommendationSystem(filteringSystem);

/*
 * function to retrieve all amenities
 * @param location: the location of the user
 * @return: IAmenity[]
 */
amenitiesRouter.post("/all", async (req, res) => {
  /* #swagger.parameters['location'] = { in: 'body', name: 'location', description: 'send the location of the user', required: true, schema: {$ref: "#/components/schemas/location"} } */
  await checkSchema(LocationSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in location argument" });
    return;
  }

  //store the data parsed
  const data: any = matchedData(req); 
  const location: ILocation = {x: data.locationX, y: data.locationY};
  const amenities: IAmenity[] = await amenityManager.getAmenities();
  res.json(amenities);
})

/*
 * function to retrieve all amenities of a particular type
 * @param location: the location of the user
 * @param amenityType: desired amenity type
 * @return: IAmenity[]
 */
amenitiesRouter.post("/oftype", async (req, res) => {
  /* #swagger.parameters['location'] = { in: 'body', name: 'location', description: 'send the location of the user', required: true, schema: {$ref: "#/components/schemas/location"} } */
  /* #swagger.parameters['amenityType'] = { in: 'body', name: 'amenityType', description: 'send the type of amnenity desired', required: true, schema: {$ref: "#/components/schemas/amenityType"} } */
  await checkSchema(LocationPlusTypeSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in location and type argument" });
    return;
  }

  //store the data parsed
  const data: any = matchedData(req); 
  const location: ILocation = {x: data.locationX, y: data.locationY};
  const amenityType: AMENITY_TYPE = data.amenityType;
  const amenities: IAmenity[] = await filteringSystem.getAvailableAmenitiesOfType(amenityType, []);
  res.json(amenities);
})

/*
 * function to retrieve amenity suggestions
 * @param location: the location of the user
 * @param filters: filters given by the user
 * @return: IAmenity[]
 */
amenitiesRouter.post("/suggested", async (req, res) => {
  /* #swagger.parameters['location'] = { in: 'body', name: 'location', description: 'send the location of the user', required: true, schema: {$ref: "#/components/schemas/location"} } */
  /* #swagger.parameters['filters'] = { in: 'body', name: 'filters', description: 'send the filters to apply', required: true, schema: {$ref: "#/components/schemas/filters"} } */
  await checkSchema(LocationPlusFiltersSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in location and filters argument" });
    return;
  }

  //store the data parsed
  const data: any = matchedData(req); 
  const location: ILocation = {x: data.locationX, y: data.locationY};
  const filters: IFilter[] = data.filters;

  const recommendations: IAmenity[] = await recommendationSystem.getMapSuggestions(filters, location, AMENITY_SORTING_TYPE.LEAST_WAIT_TIME);
  res.json(recommendations);
})

/*
 * function to retrieve the details of a particular amenity
 * @param id: the ID of the amenity for which to retrieve details
 * @return: IAmenityDetails
 */
amenitiesRouter.post("/details", async (req, res) => {
  /* #swagger.parameters['amenityID'] = { in: 'body', name: 'amenityID', description: 'send the id of the desired amenity', required: true, schema: {$ref: "#/components/schemas/amenityID"} } */
  await checkSchema(AmenityIDSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in amenity id argument" });
    return;
  }

  //store the data parsed
  const amenityID: string = matchedData(req).id; 
  const details: IAmenityDetails = await amenityManager.getAmenityDetails(amenityID);
  res.json(details);
})

/*
 * function to get a filtered list of amenities
 * @param filters: the filters to apply
 * @return: IAmenity[]
 */
amenitiesRouter.post("/filter", async (req, res) => {
  /* #swagger.parameters['filters'] = { in: 'body', name: 'filters', description: 'send the filters to apply', required: true, schema: {$ref: "#/components/schemas/filters"} } */
  await checkSchema(FiltersSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in filters argument" });
    return;
  }

  //store the data parsed
  const filters: IFilter[] = matchedData(req).filters;
  const filteredAmenities: IAmenity[] = await filteringSystem.getAvailableAmenities(filters);
  res.json(filteredAmenities);
})

//date-time formatter
const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-US", {
  hour12: false, 
  year: "2-digit", 
  month: "2-digit", 
  day: "2-digit", 
  hour: "2-digit", 
  minute: "2-digit", 
  second: "2-digit", 
});

/*
 * function called when the amenities are updated
 */
amenitiesRouter.get("/notification", async (req, res) => {
  // #swagger.description = 'This endpoint is called when the amenities are updated'
  console.log("[" + formatter.format(Date.now()) + "] " + "Amenities update notification received");
})

export default amenitiesRouter;