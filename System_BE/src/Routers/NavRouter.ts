import { Router } from 'websocket-express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import ILocation from '../Types/ILocation';
import NavigationSystem from '../TSObjects/NavigationSystem';
import IWSMessage from '../Types/_for_websockets/IWSMessage';
import WS_MESSAGE_TYPE from '../Types/_for_websockets/WSMessageType';
import IWSNavigateMessageBody from '../Types/_for_websockets/IWSNavigateMessageBody';
import XYZMapTileSchema from '../Express-Validation Schemas/XYZMapTile';
import ITileNumber from '../Types/ITileNumber';

const navRouter = new Router();
//initialize all objects needed by the router once to be used for the duration of the server
const navigationSystem: NavigationSystem = new NavigationSystem();

// /*
//  * function to get the map
//  * @param x, y: the location of the user
//  * @param z: number indicating the zoom level of the map
//  * @return: mapbox-style map tiles
//  */
// navRouter.get("/map/:z/:x/:y", async (req, res) => {
//   //https://docs.mapbox.com/api/navigation/http-post/
//   await checkSchema(XYZMapTileSchema).run(req);
//   const error = validationResult(req);

//   if (!error.isEmpty()) {
//     console.log(error.mapped());
//     res.status(422).send({ response: "Error in location argument" });
//     return;
//   }

//   //store the data corresponding to the item to delete
//   const data: {x: number, y: number, z: number} = matchedData(req); 
//   const location: ILocation = {x: "" + data.x, y: "" + data.y};
//   const zoom: number = data.z;
//   const map: any = await navigationSystem.getMap(location, zoom);
//   res.json({map: map});
// })
/*
 * function to get the map
 * @param x, y: the location of the user
 * @param z: number indicating the zoom level of the map
 * @return: mapbox-style map tiles
 */
navRouter.get("/map/:z/:x/:y", async (req, res) => {
  //https://docs.mapbox.com/api/navigation/http-post/
  await checkSchema(XYZMapTileSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.status(422).send({ response: "Error in location argument" });
    return;
  }


  const ENDPOINT: string = "https://tile.openstreetmap.org/";
  //store the data corresponding to the item to delete
  const data: {x: number, y: number, z: number} = matchedData(req); 
  const location: ILocation = {x: "" + data.x, y: "" + data.y};
  const zoom: number = data.z;
  console.log("Data received: ", "x: ", data.x, ", y: ", data.y, ", zoom: ", zoom);
  // const tileNum: ITileNumber = NavigationSystem.latLonToTileNum(Number.parseFloat(location.x), Number.parseFloat(location.y), zoom);
  // const fullEndpoint: string = ENDPOINT + tileNum.z + "/" + tileNum.x + "/" + tileNum.y + ".png"
  const fullEndpoint: string = ENDPOINT + zoom + "/" + location.x + "/" + location.y + ".png"
  console.log("FETCHING FROM: ", fullEndpoint);
  try {
    const result = await fetch(fullEndpoint, {
      headers: {
        "User-Agent": "DFWAirportApp/1.0 (student project; cxo220001@utdallas.edu)"
      }
    });
    console.log(result);
    console.log(result.body);
    // console.log(result.text());
    // res.send(result.body);
    res.json(result);
  }
  catch (e) {
    console.log(e);
  }
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
          await navigationSystem.navigate(messageBody.source, messageBody.target, messageBody.useAccessibleRouting, navID);
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
    try {
      navigationSystem.endNavigation(navID);
    }
    catch (e) {
      
    }
  })
});

export default navRouter;