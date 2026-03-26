import express from 'express';
import IAmenity from '../Types/IAmenity';
import IAmenityDetails from '../Types/IAmenityDetails';
import AmenityIDSchema from '../Express-Validation Schemas/AmenityID';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import AmenityDataArraySchema from '../Express-Validation Schemas/AmenityDataArray';
import convertDetailsToAmenityData from '../Functions/ConvertDetailsToAmenityData';
import AmenityDataWithIDSchema from '../Express-Validation Schemas/AmenityDataWithID';
import AmenityDetailsDataWithIDSchema from '../Express-Validation Schemas/AmenityDetailsDataWithID';
import SubscriptionManager from '../TSObjects/SubscriptionManager';
import ALL_AMENITIES from '../AllAmenitiesAsIAmenities';
import convertToDefaultAmenityDetails from '../Functions/ConvertToDefaultAmenityDetails';

const amenityRouter = express.Router();

let amenityData: IAmenity[] = ALL_AMENITIES;
let amenityDetailsData: IAmenityDetails[] = amenityData.map((amenity) => convertToDefaultAmenityDetails(amenity));

/*
 * function to retrieve all amenities
 * @param location: the location of the user
 * @return: IAmenity[]
 */
amenityRouter.get("/", async (req, res) => {
  res.status(200).json(amenityData);
})

/*
 * function to retrieve a single amenity
 * @param id: id of the amenity
 * @return: IAmenity
 */
amenityRouter.post("/", async (req, res) => {
  await checkSchema(AmenityIDSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in id argument" });
    return;
  }

  //store the data parsed
  const id: string = matchedData(req).id; 

  const result: IAmenity | undefined = amenityData.find((currAmenity: IAmenity) => currAmenity.id === id);

  if (result === undefined) {
    res.status(422).send({ response: "Error in id argument" })
    return;
  }

  res.status(200).json(result);
})

/*
 * function to retrieve all the amenity details
 * @return: IAmenityDetails[]
 */
amenityRouter.get("/details", async (req, res) => {
  res.status(200).json(amenityDetailsData);
})

/*
 * function to retrieve a single amenity's details
 * @param id: id of the amenity
 * @return: IAmenityDetails
 */
amenityRouter.post("/details", async (req, res) => {
  await checkSchema(AmenityIDSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in id argument" });
    return;
  }

  //store the data parsed
  const id: string = matchedData(req).id; 

  const result: IAmenityDetails | undefined = amenityDetailsData.find((currAmenity: IAmenity) => currAmenity.id === id);

  if (result === undefined) {
    res.status(422).send({ response: "Error in id argument" })
    return;
  }

  res.status(200).json(result);
})

/*
 * function to set the stored amenity data
 * @param data: IAmenity[] of the data to store
 */
amenityRouter.post("/set", async (req, res) => {
  await checkSchema(AmenityDataArraySchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in data argument" });
    return;
  }

  //store the data parsed
  const data: IAmenity[] = matchedData(req).data; 
  amenityData = data;

  SubscriptionManager.notifySubscribers();

  res.status(200).send({ response: "Success" });
})

/*
 * function to set the stored amenity details data - also updates the stored amenity data
 * @param data: IAmenityDetails[] of the data to store
 */
amenityRouter.post("/setdetails", async (req, res) => {
  await checkSchema(AmenityDataArraySchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in data argument" });
    return;
  }

  //store the data parsed
  const data: IAmenityDetails[] = matchedData(req).data; 
  amenityDetailsData = data;
  amenityData = data.map((details: IAmenityDetails) => convertDetailsToAmenityData(details));

  SubscriptionManager.notifySubscribers();

  res.status(200).send({ response: "Success" });
})

/*
 * function to update the stored data for one amenity
 * @param oldID: string representing the ID of the amenity being updated
 * @param data: IAmenity[] of the data to store
 */
amenityRouter.post("/update", async (req, res) => {
  await checkSchema(AmenityDataWithIDSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in data argument" });
    return;
  }

  //store the data parsed
  const data: any = matchedData(req); 
  const idUpdating: string = data.oldID;
  const newAmenity: IAmenity = { ...data, oldID: undefined };

  const indexOfExistingElement: number = amenityData.findIndex((currAmenity: IAmenity) => currAmenity.id === idUpdating);
  if (indexOfExistingElement < 0) {
    res.status(422).send({ response: "Provided id \"" + idUpdating + "\" does not match any existing amenities" });
    return;
  }

  amenityData.splice(indexOfExistingElement, 1, newAmenity);
  
  SubscriptionManager.notifySubscribers();

  res.status(200).send({ response: "Success" });
})

/*
 * function to update the stored details data for one amenity - also updates the stored amenity data
 * @param oldID: string representing the ID of the amenity being updated
 * @param data: IAmenityDetails[] of the data to store
 */
amenityRouter.post("/update", async (req, res) => {
  await checkSchema(AmenityDetailsDataWithIDSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in data argument" });
    return;
  }

  //store the data parsed
  const data: any = matchedData(req); 
  const idUpdating: string = data.oldID;
  const newAmenityDetails: IAmenityDetails = { ...data, oldID: undefined };

  const indexOfExistingElement: number = amenityDetailsData.findIndex((currAmenity: IAmenity) => currAmenity.id === idUpdating);
  if (indexOfExistingElement < 0) {
    res.status(422).send({ response: "Provided id \"" + idUpdating + "\" does not match any existing amenities" });
    return;
  }

  amenityDetailsData.splice(indexOfExistingElement, 1, newAmenityDetails);
  amenityData = data.map((details: IAmenityDetails) => convertDetailsToAmenityData(details));
  
  SubscriptionManager.notifySubscribers();

  res.status(200).send({ response: "Success" });
})

export default amenityRouter;