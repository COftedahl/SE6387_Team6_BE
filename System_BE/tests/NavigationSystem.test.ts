import { afterAllTimeoutMS, beforeAllTimeoutMS, closeServerForTesting, testAmenity1, testAmenity2, testAmenity3, TESTING_NAV_ROUTE_PATH, TESTING_NAVIGATION_SYSTEM, TESTING_ORIGINAL_LOG, TESTING_RECOMMENDATION_SYSTEM, testingBeforeAllFn, WS_REQUEST_OPTIONS } from "./constants";
import { beforeAll, afterAll, describe, test, expect } from '@jest/globals';
import NavigationSystem from '../src/TSObjects/NavigationSystem';
import ILocation from '../src/Types/ILocation';
import { Server } from 'http';
import REROUTE_REASON from "../src/Types/RerouteReason";
import AMENITY_SORTING_TYPE from "../src/Types/AmenitySortingType";
import IFilter from "../src/Types/IFilter";
import IAmenity from "../src/Types/IAmenity";
import IPath from "../src/Types/IPath";
import WS_MESSAGE_TYPE from "../src/Types/_for_websockets/WSMessageType";

const logs: string[] = [];
let server: Server;

/* 
 * eliminates console logging output during tests to unclutter the test report;
 * if need to see console logs during tests, then comment out the beforeAll function 
 * or just run the pertient code in the afterAll function when you need to see the log
 */
beforeAll(async () => {
  const res = await testingBeforeAllFn(logs, server, "Filtering System");
  server = res.server;
  await fetch(process.env.INFRASTRUCTURE_MANAGER_UPDATE_CROWD_LEVEL_ENDPOINT ?? "", {
    method: process.env.INFRASTRUCTURE_MANAGER_UPDATE_CROWD_LEVEL_ENDPOINT_METHOD ?? "", 
    headers: {
      "Content-Type": "application/json",
    }, 
    body: JSON.stringify({id: "00000001", crowdLevel: "HIGH"})
  }).catch(() => {
    throw new Error("Failed to set the data in the infrastructure manager external system - make sure the system is running before executing API tests.")
  });
}, beforeAllTimeoutMS);

/* 
 * restores the console.log function to regular operation
 */
afterAll(async () => {
  console.log = TESTING_ORIGINAL_LOG;
  await closeServerForTesting(server as Server, "Filtering system");
}, afterAllTimeoutMS);

//NOTE: the navigation external system must be running for these tests
describe("Navigation System unit tests", () => {
  test("get map returns an empty string", async () => {
    expect((await TESTING_NAVIGATION_SYSTEM.getMap({x: "0", y: "0"}, 15)).length).toBe(0);
  });
  test("get map returns non-empty string", async () => {
    expect((await TESTING_NAVIGATION_SYSTEM.getMap({x: "-97.0419", y: "32.897257"}, 18)).length).toBeGreaterThanOrEqual(1);
  });
  test("get path returns non-empty string", async () => {
    const result: IPath | null = (await TESTING_NAVIGATION_SYSTEM.getPath({x: "-97.0419", y: "32.897257"},{x: "-97.0419", y: "32.897257"}, false));
    expect((result as IPath).route.length).toBeGreaterThanOrEqual(1);
  });
  test("tileNumToLatLon returns correct values", async () => {
    const testLat: number = 32.897257;
    const testLon: number = -97.0419;
    const testZoom: number = 15;
    const result = NavigationSystem.tileNumToLatLon(NavigationSystem.latLonToTileNum(testLat, testLon, testZoom));
    expect(Number.parseFloat(result.x)).toBeCloseTo(testLon);
    expect(Number.parseFloat(result.y)).toBeCloseTo(testLat);
  });
  test("reroute returns new path", async () => {
    const sampleLocation: ILocation = {x: "-97.0419", y: "32.897257"};
    const testConnection: any = {};
    let carryData: any = "";
    testConnection.close = (..._data: any) => {};
    testConnection.send = (data: any) => {carryData = carryData + JSON.stringify(JSON.parse(data).body);};
    // testConnection.on = (eventName: string, callback: ((data: any) => void)) => {};
    const navID: string = TESTING_NAVIGATION_SYSTEM.initializeConnection(testConnection);
    carryData = "";
    await TESTING_NAVIGATION_SYSTEM.reroute(navID, {source: sampleLocation, target: sampleLocation, route: [], instructions: []});
    let route: any = JSON.parse(carryData).route;
    expect(route.length).toBe(0);
    TESTING_NAVIGATION_SYSTEM.endNavigation(navID);
  });
  test("navigate fails on invalid navID", async () => {
    expect(async () => {
      await TESTING_NAVIGATION_SYSTEM.navigate({x: "-97.0419", y: "32.897257"},{x: "-97.0419", y: "32.897257"},false,"ABC999");
    }).rejects.toThrow();
  });
  test("reroute fails on invalid navID", async () => {
    expect(async () => {
      await TESTING_NAVIGATION_SYSTEM.reroute("ABC999", {
        source: {x: "-97.0419", y: "32.897257"},
        target: {x: "-97.0419", y: "32.897257"},
        route: [{x: "-97.0419", y: "32.897257"}],
        instructions: []
      });
    }).rejects.toThrow();
  });
  test("update location with invalid navID fails", async () => {
    expect(async () => {await TESTING_NAVIGATION_SYSTEM.updateLocation("ABC999", {x: "1", y: "2"})}).rejects.toThrow();
  });
  test("check for reroute operates correctly if no reroute is needed", async () => {
    const testConnection: any = {};
    let carryData: any = "";
    testConnection.close = (..._data: any) => {};
    testConnection.send = (data: any) => {carryData = carryData + JSON.stringify(JSON.parse(data).body);};
    const OLD_MAP_SUGGESTIONS_FN = TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions;
    TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions = async (_a: IFilter[], _b: ILocation, _c: AMENITY_SORTING_TYPE): Promise<IAmenity[]> => {
      return [testAmenity1, testAmenity2, testAmenity3]
    }
    // testConnection.on = (eventName: string, callback: ((data: any) => void)) => {};
    const navID: string = TESTING_NAVIGATION_SYSTEM.initializeConnection(testConnection);
    console.log("received NAVID = " + navID);
    await TESTING_NAVIGATION_SYSTEM.navigate({x: "2", y: "2"}, {x: "2", y: "2"}, false, navID);
    carryData = "";
    await TESTING_NAVIGATION_SYSTEM.checkForReroute(navID, REROUTE_REASON.LOCATION_CHANGED);
    TESTING_ORIGINAL_LOG("Carry Data: ", carryData);
    expect(carryData.length).toBe(0);
    TESTING_NAVIGATION_SYSTEM.endNavigation(navID);
    TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions = OLD_MAP_SUGGESTIONS_FN;
  });
  test("check for reroute offers new route if one is needed", async () => {
    const testConnection: any = {};
    let carryData: any = "";
    testConnection.close = (..._data: any) => {};
    testConnection.send = (data: any) => {carryData = carryData + JSON.stringify(JSON.parse(data).body);};
    const OLD_MAP_SUGGESTIONS_FN = TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions;
    TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions = async (_a: IFilter[], _b: ILocation, _c: AMENITY_SORTING_TYPE): Promise<IAmenity[]> => {
      return [testAmenity1, testAmenity2, testAmenity3]
    }
    // testConnection.on = (eventName: string, callback: ((data: any) => void)) => {};
    const navID: string = TESTING_NAVIGATION_SYSTEM.initializeConnection(testConnection);
    await TESTING_NAVIGATION_SYSTEM.navigate({x: "1.7", y: "1.7"}, {x: "1", y: "1"}, false, navID);
    await TESTING_NAVIGATION_SYSTEM.reroute(navID, {source: {x: "1.7", y: "1.7"}, target: {x: "1", y: "1"}, route: [{x: "1.7", y: "1.7"},{x: "2", y: "2"}], instructions: []});
    carryData = "";
    await TESTING_NAVIGATION_SYSTEM.checkForReroute(navID, REROUTE_REASON.LOCATION_CHANGED);
    expect(carryData.length).toBeGreaterThan(0);
    TESTING_NAVIGATION_SYSTEM.endNavigation(navID);
    TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions = OLD_MAP_SUGGESTIONS_FN;
  });
  test("check for reroute with invalid navID fails", async () => {
    expect(async () => {
      await (TESTING_NAVIGATION_SYSTEM.checkForReroute("ABC999", REROUTE_REASON.LOCATION_CHANGED));
    }).rejects.toThrow();
  });
  test("check for reroute operates correctly with no recommended amenities and no matching amenity", async () => {
    const testConnection: any = {};
    let carryData: any = "";
    let messageType: WS_MESSAGE_TYPE | null = null;
    testConnection.close = (..._data: any) => {};
    testConnection.send = (data: any) => {carryData = carryData + JSON.stringify(JSON.parse(data).body); messageType = JSON.parse(data).messageType};
    const OLD_MAP_SUGGESTIONS_FN = TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions;
    TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions = async (_a: IFilter[], _b: ILocation, _c: AMENITY_SORTING_TYPE): Promise<IAmenity[]> => {
      return []
    }
    // testConnection.on = (eventName: string, callback: ((data: any) => void)) => {};
    const navID: string = TESTING_NAVIGATION_SYSTEM.initializeConnection(testConnection);
    await TESTING_NAVIGATION_SYSTEM.navigate({x: "0", y: "0"}, {x: "100", y: "89"}, false, navID);
    carryData = "";
    await TESTING_NAVIGATION_SYSTEM.checkForReroute(navID, REROUTE_REASON.LOCATION_CHANGED);
    expect(carryData.length).toBe(0);
    TESTING_NAVIGATION_SYSTEM.endNavigation(navID);
    TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions = OLD_MAP_SUGGESTIONS_FN;
  });
  test("check for reroute operates correctly with no recommended amenities", async () => {
    const testConnection: any = {};
    let carryData: any = "";
    let messageType: WS_MESSAGE_TYPE | null = null;
    testConnection.close = (..._data: any) => {};
    testConnection.send = (data: any) => {carryData = carryData + JSON.stringify(JSON.parse(data).body); messageType = JSON.parse(data).messageType};
    const OLD_MAP_SUGGESTIONS_FN = TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions;
    TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions = async (_a: IFilter[], _b: ILocation, _c: AMENITY_SORTING_TYPE): Promise<IAmenity[]> => {
      return []
    }
    // testConnection.on = (eventName: string, callback: ((data: any) => void)) => {};
    const navID: string = TESTING_NAVIGATION_SYSTEM.initializeConnection(testConnection);
    await TESTING_NAVIGATION_SYSTEM.navigate({x: "2", y: "2"}, {x: "2", y: "2"}, false, navID);
    const OLD_NAVIGATE_FN = TESTING_NAVIGATION_SYSTEM.getPath;
    TESTING_NAVIGATION_SYSTEM.getPath = async (_source: ILocation, _target: ILocation, _useAccessibleRouting?: boolean): Promise<IPath | null> => {
      return null
    }
    carryData = "";
    await TESTING_NAVIGATION_SYSTEM.checkForReroute(navID, REROUTE_REASON.LOCATION_CHANGED);
    expect(carryData.length).toBe(0);
    TESTING_NAVIGATION_SYSTEM.endNavigation(navID);
    TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions = OLD_MAP_SUGGESTIONS_FN;
    TESTING_NAVIGATION_SYSTEM.getPath = OLD_NAVIGATE_FN;
  });
  test("check for reroute operates correctly with recommended amenities and null path", async () => {
    const testConnection: any = {};
    let carryData: any = "";
    let messageType: WS_MESSAGE_TYPE | null = null;
    testConnection.close = (..._data: any) => {};
    testConnection.send = (data: any) => {carryData = carryData + JSON.stringify(JSON.parse(data).body); messageType = JSON.parse(data).messageType};
    const OLD_MAP_SUGGESTIONS_FN = TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions;
    TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions = async (_a: IFilter[], _b: ILocation, _c: AMENITY_SORTING_TYPE): Promise<IAmenity[]> => {
      return [testAmenity1, testAmenity2, testAmenity3]
    }
    // testConnection.on = (eventName: string, callback: ((data: any) => void)) => {};
    const navID: string = TESTING_NAVIGATION_SYSTEM.initializeConnection(testConnection);
    await TESTING_NAVIGATION_SYSTEM.navigate({x: "2", y: "2"}, {x: "2", y: "2"}, false, navID);
    const OLD_NAVIGATE_FN = TESTING_NAVIGATION_SYSTEM.getPath;
    TESTING_NAVIGATION_SYSTEM.getPath = async (_source: ILocation, _target: ILocation, _useAccessibleRouting?: boolean): Promise<IPath | null> => {
      return null
    }
    carryData = "";
    await TESTING_NAVIGATION_SYSTEM.checkForReroute(navID, REROUTE_REASON.LOCATION_CHANGED);
    expect(carryData.length).toBe(0);
    TESTING_NAVIGATION_SYSTEM.endNavigation(navID);
    TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions = OLD_MAP_SUGGESTIONS_FN;
    TESTING_NAVIGATION_SYSTEM.getPath = OLD_NAVIGATE_FN;
  });
  test("check for reroute operates correctly with matching amenity and valid route", async () => {
    const testConnection: any = {};
    let carryData: any = "";
    let messageType: WS_MESSAGE_TYPE | null = null;
    testConnection.close = (..._data: any) => {};
    testConnection.send = (data: any) => {carryData = carryData + JSON.stringify(JSON.parse(data).body); messageType = JSON.parse(data).messageType};
    const OLD_MAP_SUGGESTIONS_FN = TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions;
    TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions = async (_a: IFilter[], _b: ILocation, _c: AMENITY_SORTING_TYPE): Promise<IAmenity[]> => {
      return [testAmenity1, testAmenity2, testAmenity3]
    }
    // testConnection.on = (eventName: string, callback: ((data: any) => void)) => {};
    const navID: string = TESTING_NAVIGATION_SYSTEM.initializeConnection(testConnection);
    await TESTING_NAVIGATION_SYSTEM.navigate({x: "2", y: "2"}, {x: "2", y: "2"}, false, navID);
    carryData = "";
    await TESTING_NAVIGATION_SYSTEM.updateLocation(navID, {x: "-94", y: "35"});//this line already calls checkForReroute
    // await TESTING_NAVIGATION_SYSTEM.checkForReroute(navID, REROUTE_REASON.LOCATION_CHANGED);
    console.log(carryData);
    expect(messageType).toBe(WS_MESSAGE_TYPE.OFFER_REROUTE);
    TESTING_NAVIGATION_SYSTEM.endNavigation(navID);
    TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions = OLD_MAP_SUGGESTIONS_FN;
  });
  test("navigate sends correct message on no route available", async () => {
    const testConnection: any = {};
    let carryData: any = "";
    let messageType: WS_MESSAGE_TYPE | null = null;
    testConnection.close = (..._data: any) => {};
    testConnection.send = (data: any) => {carryData = carryData + JSON.stringify(JSON.parse(data).body); messageType = JSON.parse(data).messageType};
    const OLD_NAVIGATE_FN = TESTING_NAVIGATION_SYSTEM.getPath;
    TESTING_NAVIGATION_SYSTEM.getPath = async (_source: ILocation, _target: ILocation, _useAccessibleRouting?: boolean): Promise<IPath | null> => {
      return null
    }
    // testConnection.on = (eventName: string, callback: ((data: any) => void)) => {};
    const navID: string = TESTING_NAVIGATION_SYSTEM.initializeConnection(testConnection);
    await TESTING_NAVIGATION_SYSTEM.navigate({x: "0", y: "0"}, {x: "100", y: "89"}, false, navID);
    console.log("Carry data: ", carryData);
    expect(messageType).toBe(WS_MESSAGE_TYPE.ROUTING_FAILED);
    TESTING_NAVIGATION_SYSTEM.endNavigation(navID);
    TESTING_NAVIGATION_SYSTEM.getPath = OLD_NAVIGATE_FN;
  });
});