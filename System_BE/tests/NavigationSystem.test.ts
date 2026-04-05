import dotenv from 'dotenv';
import { TESTING_NAVIGATION_SYSTEM, TESTING_ORIGINAL_LOG } from "./constants";
import { beforeAll, afterAll, describe, test, expect } from '@jest/globals';
import NavigationSystem from '../src/TSObjects/NavigationSystem';
import ILocation from '../src/Types/ILocation';

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
afterAll(async () => {
  console.log = TESTING_ORIGINAL_LOG;
});

//NOTE: the navigation external system must be running for these tests
describe("Navigation System unit tests", () => {
  test("get map returns an empty string", async () => {
    expect((await TESTING_NAVIGATION_SYSTEM.getMap({x: "0", y: "0"}, 15)).length).toBe(0);
  });
  test("get map returns non-empty string", async () => {
    expect((await TESTING_NAVIGATION_SYSTEM.getMap({x: "-97.0419", y: "32.897257"}, 18)).length).toBeGreaterThanOrEqual(1);
  });
  test("get path returns non-empty string", async () => {
    expect((await TESTING_NAVIGATION_SYSTEM.getPath({x: "-97.0419", y: "32.897257"},{x: "-97.0419", y: "32.897257"}, false)).route.length).toBeGreaterThanOrEqual(1);
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
    testConnection.send = (data: any) => {carryData = JSON.parse(data).body;};
    // testConnection.on = (eventName: string, callback: ((data: any) => void)) => {};
    const navID: string = TESTING_NAVIGATION_SYSTEM.initializeConnection(testConnection);
    await TESTING_NAVIGATION_SYSTEM.reroute(navID, {source: sampleLocation, target: sampleLocation, route: [], instructions: []});
    let route: any = carryData.route;
    expect(route.length).toBe(0);
    TESTING_NAVIGATION_SYSTEM.endNavigation(navID);
  });
});