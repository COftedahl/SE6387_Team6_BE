import { Router } from 'websocket-express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import ILocation from '../Types/ILocation';
import NavigationSystem from '../TSObjects/NavigationSystem';
import IWSMessage from '../Types/_for_websockets/IWSMessage';
import WS_MESSAGE_TYPE from '../Types/_for_websockets/WSMessageType';
import IWSNavigateMessageBody from '../Types/_for_websockets/IWSNavigateMessageBody';
import XYZMapTileSchema from '../Express-Validation Schemas/XYZMapTile';
import { Readable } from 'stream';
import REROUTE_REASON from '../Types/RerouteReason';
import dotenv from 'dotenv';
import RecommendationSystem from '../TSObjects/RecommendationSystem';
import FilteringSystem from '../TSObjects/FilteringSystem';
import AmenityManager from '../TSObjects/AmenityManager';

dotenv.config();
const navRouter = new Router();
//initialize all objects needed by the router once to be used for the duration of the server
const amenityManager: AmenityManager = new AmenityManager();
const filteringSystem: FilteringSystem = new FilteringSystem(amenityManager);
const recommendationSystem: RecommendationSystem = new RecommendationSystem(filteringSystem);
const navigationSystem: NavigationSystem = new NavigationSystem(recommendationSystem);
const subscriptionEndpoints: {method: string, endpoint: string, reasonPath: string}[] = [
  {
    method: process.env.AMENITY_MANAGER_SUBSCRIBE_ENDPOINT_METHOD ?? "", 
    endpoint: process.env.AMENITY_MANAGER_SUBSCRIBE_ENDPOINT ?? "",
    reasonPath: "amenities",
  }, 
  {
    method: process.env.INFRASTRUCTURE_MANAGER_SUBSCRIBE_ENDPOINT_METHOD ?? "", 
    endpoint: process.env.INFRASTRUCTURE_MANAGER_SUBSCRIBE_ENDPOINT ?? "",
    reasonPath: "infrastructure",
  }, 
];
let subscribed: boolean[] = subscriptionEndpoints.map((_) => false);
const subscriptionBackoffIntervalsInSeconds: number[] = [ 5, 5, 20, 60, ];
let currBackoffIntervalIndex: number = 0;

/* 
 * function to handle subscribing to alerts from external systems
 */
const attemptToSubscribe = async () => {
  for (let i = 0; i < subscriptionEndpoints.length; i += 1) {
    const subscription = subscriptionEndpoints[i];
    if (subscription.endpoint.length > 0 && subscription.method.length > 0) {
      if (!subscribed[i]) {
        try {
          const result = await fetch(subscription.endpoint, {
            method: subscription.method, 
            headers: {
              "Content-Type": "application/json",
            }, 
            body: JSON.stringify({ endpoint: ("http://localhost:5000/nav/notify/" + subscription.reasonPath) })
          })
          if (result.status === 200) {
            subscribed[i] = true;
            console.log("Subscribed to \"" + subscription.endpoint + "\"");
          }
          else {
            console.log("Error subscribing to \"" + subscription.endpoint + "\"");
          }
        }
        catch (e) {
          console.log("Error subscribing to \"" + subscription.endpoint + "\" ", e);
        }
      }
    }
  }
  currBackoffIntervalIndex = Math.min(currBackoffIntervalIndex + 1, subscriptionBackoffIntervalsInSeconds.length - 1);
  setTimeout(async () => {
    await attemptToSubscribe();
  }, subscriptionBackoffIntervalsInSeconds[currBackoffIntervalIndex] * 1000);
}

setTimeout(async () => {
  await attemptToSubscribe();
}, subscriptionBackoffIntervalsInSeconds[currBackoffIntervalIndex] * 1000);

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
  // console.log(req);
  // console.log("HEADERS: ", req.headers);
  // console.log("URL: ", req.originalUrl);
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
  // const zoom: number = Math.min(Math.max(15, data.z), 19);
  const zoom: number = data.z;
  console.log("Data received: ", "x: ", data.x, ", y: ", data.y, ", zoom: ", zoom);
  // const tileNum: ITileNumber = NavigationSystem.latLonToTileNum(Number.parseFloat(location.x), Number.parseFloat(location.y), zoom);
  // const fullEndpoint: string = ENDPOINT + tileNum.z + "/" + tileNum.x + "/" + tileNum.y + ".png"
  const fullEndpoint: string = ENDPOINT + zoom + "/" + location.x + "/" + location.y + ".png"
  console.log("FETCHING FROM: ", fullEndpoint);
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
          navigationSystem.reroute(navID);
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
          //expect body of message to be an ILocation
          const newLocation: ILocation = message.body;
          navigationSystem.updateLocation(navID, newLocation);
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

/*
 * function to notify the navigation system about an update from the amenities system
 */
navRouter.get("/notify/amenities", async (req, res) => {
  try {
    navigationSystem.checkAllForReroute(REROUTE_REASON.AMENITIES_CHANGED);
    res.json({ message: "Checked all for reroutes from amenities change" });
  }
  catch (e) {
    console.log("Error checking for reroutes ", e);
  }
})

/*
 * function to notify the navigation system about an update from the amenities system
 */
navRouter.get("/notify/infrastructure", async (req, res) => {
  try {
    navigationSystem.checkAllForReroute(REROUTE_REASON.INFRASTRUCTURE_CHANGED);
    res.json({ message: "Checked all for reroutes from infrastructure change" });
  }
  catch (e) {
    console.log("Error checking for reroutes ", e);
  }
})

/*
 * function to attempt to resubscribe to notification endpoints without restarting the server
 */
navRouter.get("/resetsubscriptions", async (req, res) => {
  subscribed = subscriptionEndpoints.map((_) => false);
  currBackoffIntervalIndex = 0;
  setTimeout(async () => {
    await attemptToSubscribe();
  }, subscriptionBackoffIntervalsInSeconds[currBackoffIntervalIndex] * 1000);
  res.json({ message: "Subscriptions reset" });
})

export default navRouter;