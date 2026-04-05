import { Router } from 'websocket-express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import ILocation from '../Types/ILocation';
import NavigationSystem from '../TSObjects/NavigationSystem';
import IWSMessage from '../Types/_for_websockets/IWSMessage';
import WS_MESSAGE_TYPE from '../Types/_for_websockets/WSMessageType';
import IWSNavigateMessageBody from '../Types/_for_websockets/IWSNavigateMessageBody';
import XYZMapTileSchema from '../Express-Validation Schemas/XYZMapTile';
import ITileNumber from '../Types/ITileNumber';
import { Readable } from 'stream';

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
  console.log(req);
  console.log("HEADERS: ", req.headers);
  console.log("URL: ", req.originalUrl);
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
  const zoom: number = Math.min(Math.max(15, data.z), 19);
  // console.log("Data received: ", "x: ", data.x, ", y: ", data.y, ", zoom: ", zoom);
  // const tileNum: ITileNumber = NavigationSystem.latLonToTileNum(Number.parseFloat(location.x), Number.parseFloat(location.y), zoom);
  // const fullEndpoint: string = ENDPOINT + tileNum.z + "/" + tileNum.x + "/" + tileNum.y + ".png"
  const fullEndpoint: string = ENDPOINT + zoom + "/" + location.x + "/" + location.y + ".png"
  // console.log("FETCHING FROM: ", fullEndpoint);
  try {
    const result = await fetch(fullEndpoint, {
      headers: {
        "User-Agent": "DFWAirportApp/1.0 (student project; cxo220001@utdallas.edu)"
      }
    });
    // console.log(result);
    // console.log(result.body);


    res.status(result.status);
    // Forward important headers if present
    const ct = result.headers.get("content-type");
    if (ct) res.setHeader("Content-Type", ct);
    // const cache = result.headers.get("cache-control") || result.headers.get("expires");
    // if (cache) res.setHeader("Cache-Control", cache);
    // If body is null or not ok, end early
    if (!result.body) {
      // fallback: read as buffer and send
      const buf = Buffer.from(await result.arrayBuffer());
      return res.send(buf);
    }// Convert WHATWG ReadableStream to Node Readable and pipe
    const nodeStream = Readable.fromWeb(result.body as any);
      nodeStream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) res.sendStatus(500);
        else res.end();
      });
      nodeStream.pipe(res);
    } catch (err) {
      console.error("Fetch error:", err);
      res.sendStatus(502);
    }

    // console.log(result.text());
    // res.send(result.body);
    // res.json(result);
  //   // res.send(result.text);
  // }
  // catch (e) {
  //   console.log(e);
  // }
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