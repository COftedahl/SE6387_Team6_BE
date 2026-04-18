import request from 'superwstest';
import dotenv from 'dotenv';
import { testAmenityDetails1, testAmenityDetails2, testAmenityDetails3, TESTING_AMENITIES_ROUTE_PATH, TESTING_INFRASTRUCTURE_ROUTE_PATH, TESTING_NAV_ROUTE_PATH, TESTING_ORIGINAL_LOG } from './constants';
import { beforeAll, afterAll, describe, test, expect } from '@jest/globals';
import server from '../src/index';
import WS_MESSAGE_TYPE from '../src/Types/_for_websockets/WSMessageType';

const logs: string[] = [];

/* 
 * eliminates console logging output during tests to unclutter the test report;
 * if need to see console logs during tests, then comment out the beforeAll function 
 * or just run the pertient code in the afterAll function when you need to see the log
 */
beforeAll(async () => {
  logs.splice(0,logs.length);
  console.log = (...args) => {
    logs.push(args.join(' '));
  };
  dotenv.config();
  await fetch(process.env.AMENITY_MANAGER_SET_AMENITY_DETAILS_ENDPOINT ?? "", {
    method: process.env.AMENITY_MANAGER_SET_AMENITY_DETAILS_ENDPOINT_METHOD ?? "", 
    headers: {
      "Content-Type": "application/json",
    }, 
    body: JSON.stringify({data: [testAmenityDetails1, testAmenityDetails2, testAmenityDetails3]})
  }).catch(() => {
    throw new Error("Failed to set the data in the amenity manager external system - make sure the system is running before executing API tests.")
  });
  await fetch(process.env.INFRASTRUCTURE_MANAGER_UPDATE_CROWD_LEVEL_ENDPOINT ?? "", {
    method: process.env.INFRASTRUCTURE_MANAGER_UPDATE_CROWD_LEVEL_ENDPOINT_METHOD ?? "", 
    headers: {
      "Content-Type": "application/json",
    }, 
    body: JSON.stringify({id: "00000001", crowdLevel: "HIGH"})
  }).catch(() => {
    throw new Error("Failed to set the data in the infrastructure manager external system - make sure the system is running before executing API tests.")
  });
});

/* 
 * restores the console.log function to regular operation
 */
afterAll(() => {
  console.log = TESTING_ORIGINAL_LOG;
  server.close();
  server.closeAllConnections();
});

describe("Amenities Router Tests", () => {
  test("/all incorrect post body", async () => {
    const result = await request(server).post(TESTING_AMENITIES_ROUTE_PATH + "/all");
    expect(result.status).toBe(422);
  });
  test("/all correct post body", async () => {
    const result = await request(server).post(TESTING_AMENITIES_ROUTE_PATH + "/all").send({x: "1",y: "2"});
    expect(result.status).toBe(200);
  });
  test("/oftype incorrect post body", async () => {
    const result = await request(server).post(TESTING_AMENITIES_ROUTE_PATH + "/oftype");
    expect(result.status).toBe(422);
  });
  test("/oftype correct post body", async () => {
    const result = await request(server).post(TESTING_AMENITIES_ROUTE_PATH + "/oftype").send({x: "1",y: "2", amenityType: "RESTROOM"});
    expect(result.status).toBe(200);
  });
  test("/suggested incorrect post body", async () => {
    const result = await request(server).post(TESTING_AMENITIES_ROUTE_PATH + "/suggested");
    expect(result.status).toBe(422);
  });
  test("/suggested correct post body", async () => {
    const result = await request(server).post(TESTING_AMENITIES_ROUTE_PATH + "/suggested").send({x: "1",y: "2", filters: [], sortMethod: "BEST_ROUTE"});
    expect(result.status).toBe(200);
  });
  test("/details incorrect post body", async () => {
    const result = await request(server).post(TESTING_AMENITIES_ROUTE_PATH + "/details");
    expect(result.status).toBe(422);
  });
  test("/details correct post body", async () => {
    const result = await request(server).post(TESTING_AMENITIES_ROUTE_PATH + "/details").send({id: "AM1"});
    expect(result.status).toBe(200);
  });
  test("/filter incorrect post body", async () => {
    const result = await request(server).post(TESTING_AMENITIES_ROUTE_PATH + "/filter");
    expect(result.status).toBe(422);
  });
  test("/filter correct post body", async () => {
    const result = await request(server).post(TESTING_AMENITIES_ROUTE_PATH + "/filter").send({filters: [{filterKey: "type", value: "RESTROOM"}]});
    expect(result.status).toBe(200);
  });
  test("/updateoccupancy incorrect post body", async () => {
    const result = await request(server).post(TESTING_AMENITIES_ROUTE_PATH + "/updateoccupancy");
    expect(result.status).toBe(422);
  });
  test("/updateoccupancy failed request", async () => {
    const result = await request(server).post(TESTING_AMENITIES_ROUTE_PATH + "/updateoccupancy").send({
      id: "99999", 
      details: {
        currentOccupancy: 2, 
        currentAvailableSlots: 4, 
        capacity: 6, 
        status: 'OPEN', 
        lastUpdated: '03/29/26, 10:10:31'
      }
    });
    expect(result.status).toBe(502);
  });test("/updateoccupancy correct post body", async () => {
    const result = await request(server).post(TESTING_AMENITIES_ROUTE_PATH + "/updateoccupancy").send({
      id: "1", 
      details: {
        currentOccupancy: 2, 
        currentAvailableSlots: 4, 
        capacity: 6, 
        status: 'OPEN', 
        lastUpdated: '03/29/26, 10:10:31'
      }
    });
    expect(result.status).toBe(200);
  });
});

describe("Nav Router Tests", () => {
  test("/map incorrect get request", async () => {
    const result = await request(server).get(TESTING_NAV_ROUTE_PATH + "/map/A/B/C");
    expect(result.status).toBe(422);
  });
  test("/map correct get request", async () => {
    const result = await request(server).get(TESTING_NAV_ROUTE_PATH + "/map/15/15/15");
    expect(result.status).toBe(200);
  });
  test("websocket receives id", async () => {
    request(server).ws(TESTING_NAV_ROUTE_PATH).expectJson((response: any) => {
      return response.body.includes("NAVID");
    }).close().expectClosed();
  });
  test("websocket parses request navigation", async () => {
    request(server).ws(TESTING_NAV_ROUTE_PATH).waitForJson().sendJson({
      messageType: WS_MESSAGE_TYPE.REQUEST_NAVIGATE, 
      body: {
        source: {x: "-97.0419", y: "32.897257"},
        target: {x: "-97.0419", y: "32.897257"},
        useAccessibleRouting: false, 
      }
    }).expectJson((navResponse: any) => {
      return navResponse.body.route.length > 0
    }).close().expectClosed();
  });
  test("websocket parses cancel navigation", async () => {
    request(server).ws(TESTING_NAV_ROUTE_PATH).waitForJson().sendJson({
      messageType: WS_MESSAGE_TYPE.REQUEST_NAVIGATE, 
      body: {
        source: {x: "-97.0419", y: "32.897257"},
        target: {x: "-97.0419", y: "32.897257"},
        useAccessibleRouting: false, 
      }
    }).waitForJson().sendJson({
      messageType: WS_MESSAGE_TYPE.CANCEL_NAVIGATION, 
      body: {}
    }).expectClosed();
  });
  test("websocket operates correctly after invalid message body", async () => {
    request(server).ws(TESTING_NAV_ROUTE_PATH).sendText("5\"").sendJson({
      messageType: WS_MESSAGE_TYPE.CANCEL_NAVIGATION, 
      body: {}
    }).expectClosed();
  });
});

describe("Infrastructure Router Tests", () => {
  test("/updatecrowd incorrect post body", async () => {
    const result = await request(server).post(TESTING_INFRASTRUCTURE_ROUTE_PATH + "/updatecrowd");
    expect(result.status).toBe(422);
  });
  test("/updatecrowd failed request", async () => {
    const result = await request(server).post(TESTING_INFRASTRUCTURE_ROUTE_PATH + "/updatecrowd").send({id: "99999999", crowdLevel: "HIGH"});
    expect(result.status).toBe(502);
  });
  test("/updatecrowd correct post body", async () => {
    const result = await request(server).post(TESTING_INFRASTRUCTURE_ROUTE_PATH + "/updatecrowd").send({id: "1", crowdLevel: "HIGH"});
    expect(result.status).toBe(200);
  });
});