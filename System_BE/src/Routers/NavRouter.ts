import { Router } from 'websocket-express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import ILocation from '../Types/ILocation';
import NavigationSystem from '../TSObjects/NavigationSystem';
import LocationPlusZoomSchema from '../Express-Validation Schemas/LocationPlusZoom';
import IWSMessage from '../Types/_for_websockets/IWSMessage';
import WS_MESSAGE_TYPE from '../Types/_for_websockets/WSMessageType';
import IWSNavigateMessageBody from '../Types/_for_websockets/IWSNavigateMessageBody';

const navRouter = new Router();
//initialize all objects needed by the router once to be used for the duration of the server
const navigationSystem: NavigationSystem = new NavigationSystem();

/*
 * function to get the map
 * @param location: the location of the user
 * @param zoom: number indicating the zoom level of the map
 * @return: map with amenities
 */
navRouter.post("/map", async (req, res) => {
  /* #swagger.parameters['location'] = { in: 'body', name: 'location', description: 'send the location of the user with zoom level to center the map', required: true, schema: {$ref: "#/components/schemas/locationWithZoom"} } */
  //https://docs.mapbox.com/api/navigation/http-post/
  await checkSchema(LocationPlusZoomSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in location argument" });
    return;
  }

  //store the data corresponding to the item to delete
  const data: any = matchedData(req); 
  const location: ILocation = {x: data.x, y: data.y};
  const zoom: number = data.zoom;
  const map: any = await navigationSystem.getMap(location, zoom);
  res.json({map: map});
})

/*
 * function called when the client requests a websocket connection
 * @param ws: the websocket created
 */
navRouter.ws('/', async (req, res) => {
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
  const ws = await res.accept();
  // console.log("NEXT: ", next);
  // console.log("REQ: ", req);
  // console.log("WS: ", ws);
  // ws.on("open", () => console.log("Connected"));
  const navID: string = navigationSystem.initializeConnection(ws);

  ws.on("message", async (data) => {
    try {
      const messageString: string = data.toString('utf-8');
      console.log("received message ", messageString);
      const message: IWSMessage = JSON.parse(messageString);
      switch(message.messageType) {
        case WS_MESSAGE_TYPE.ACCEPT_REROUTE: 
          
          break;
        case WS_MESSAGE_TYPE.CANCEL_NAVIGATION: 
          navigationSystem.endNavigation(navID);
          break;
        case WS_MESSAGE_TYPE.REQUEST_NAVIGATE: 
          //expect body of message to follow type IWSNavigateMessageBody
          const messageBody: IWSNavigateMessageBody = message.body;
          await navigationSystem.navigate(messageBody.source, messageBody.target, navID);
          break;
        case WS_MESSAGE_TYPE.UPDATE_POSITION: 

          break;
      }
    }
    catch (e) {
      console.log("Error parsing Websocket message from connection " + navID + "; ", e);
    }
  });

  ws.on("close", () => {
    navigationSystem.endNavigation(navID);
  })

  req.on("open", () => console.log("Connected"));

  req.on("message", async (data) => {
    const message: IWSMessage = data;
    console.log("received message ", message);
    switch(message.messageType) {
      case WS_MESSAGE_TYPE.ACCEPT_REROUTE: 
        
        break;
      case WS_MESSAGE_TYPE.CANCEL_NAVIGATION: 
        navigationSystem.endNavigation(navID);
        break;
      case WS_MESSAGE_TYPE.REQUEST_NAVIGATE: 
        //expect body of message to follow type IWSNavigateMessageBody
        const messageBody: IWSNavigateMessageBody = message.body;
        await navigationSystem.navigate(messageBody.source, messageBody.target, navID);
        break;
      case WS_MESSAGE_TYPE.UPDATE_POSITION: 

        break;
    }
  });

  req.on("close", () => {
    navigationSystem.endNavigation(navID);
  })
});

export default navRouter;