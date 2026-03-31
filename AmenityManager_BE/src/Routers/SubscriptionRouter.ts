import express from 'express';
import SubscriptionManager from '../TSObjects/SubscriptionManager';
import { checkSchema, validationResult, matchedData } from 'express-validator';
import EndpointSchema from '../Express-Validation Schemas/Endpoint';
import AmenityIDSchema from '../Express-Validation Schemas/AmenityID';

const subscriptionRouter = express.Router();

/*
 * function to subscribe to update notifications
 * @param endpoint: endpoint to call, using a GET request, when an update occurs
 * @return: string containing the id assigned to the subscriber
 */
subscriptionRouter.post("/subscribe", async (req, res) => {
  /* #swagger.parameters['endpoint'] = { in: 'body', name: 'endpoint', description: 'endpoint to call when an update occurs', required: true, schema: {$ref: "#/components/schemas/endpoint"} } */
  await checkSchema(EndpointSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in endpoint argument" });
    return;
  }

  //store the data parsed
  const endpoint: any = matchedData(req).endpoint; 
  const newID: string = SubscriptionManager.addSubscriber(endpoint);
  res.json({ message: "Subscribed", id: newID });
})

/*
 * function to unsubscribe from update notifications
 * @param id: string containing the id of the subscriber to unsubscribe
 */
subscriptionRouter.post("/unsubscribe", async (req, res) => {
  /* #swagger.parameters['id'] = { in: 'body', name: 'id', description: 'id of the subscriber to unsubscribe', required: true, schema: {$ref: "#/components/schemas/amenityID"} } */
  await checkSchema(AmenityIDSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in id argument" });
    return;
  }

  //store the data parsed
  const id: any = matchedData(req).id; 

  const unsubscribeResult: boolean = SubscriptionManager.removeSubscriber(id);

  if (unsubscribeResult === false) {
    res.status(409).send({ response: "Invalid ID \"" + id + "\" - unsubscibe request must include a subscribed ID" });
    return;
  }

  res.json({ message: "Unsubscribed" });
})

export default subscriptionRouter;