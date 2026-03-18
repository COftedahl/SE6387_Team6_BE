import { Router } from 'websocket-express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import ILocation from '../Types/ILocation';
import LocationSchema from '../Express-Validation Schemas/Location';

const navRouter = new Router();

/*
 * function to get the map
 * @param location: the location of the user
 * @return: map with amenities
 */
navRouter.post("/map", async (req, res) => {
  /* #swagger.parameters['location'] = { in: 'body', name: 'location', description: 'send the location of the user', required: true, schema: {$ref: "#/components/schemas/location"} } */
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

/*
 * function called when the client requests a websocket connection
 * @param ws: the websocket created
 */
navRouter.ws('/', function(ws, req) {
  // #swagger.start
    /*
      #swagger.path = '/nav'
      #swagger.method = 'get'
      #swagger.description = 'This endpoint IS NOT an HTTP GET request endpoint - it is used with websockets protocol. Use this endpoint to create a websocket conection. '
    */
    /* 
      #swagger.responses[200] = { description: 'Creating websocket connection' }  
    */
  // #swagger.end
  ws.on('message', function(msg) {
    
  });
});

export default navRouter;