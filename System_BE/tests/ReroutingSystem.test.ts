import { beforeAll, afterAll, describe, test, expect } from "@jest/globals";
import { afterAllTimeoutMS, beforeAllTimeoutMS, closeServerForTesting, TESTING_ORIGINAL_LOG, TESTING_REROUTING_SYSTEM, testingBeforeAllFn  } from "./constants";
import { Server } from 'http';
import IPath from "../src/Types/IPath";

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
}, beforeAllTimeoutMS);

/* 
 * restores the console.log function to regular operation
 */
afterAll(async () => {
  console.log = TESTING_ORIGINAL_LOG;
  await closeServerForTesting(server as Server, "Filtering system");
}, afterAllTimeoutMS);

describe("Rerouting System unit tests", () => {
  test("Check Should Reroute fails with empty route", async () => {
    const path: IPath = {
      source: {x: "1.2", y: "3.4"},
      target: {x: "1.2", y: "3.4"},
      route: [],
      instructions: []
    };
    expect(TESTING_REROUTING_SYSTEM.checkShouldReroute(path, path)).toBe(false);
  });
  test("Check Should Reroute fails with identical route", async () => {
    const path: IPath = {
      source: {x: "1.2", y: "3.4"},
      target: {x: "1.2", y: "3.4"},
      route: [{x: "1.2", y: "3.4"}, {x: "1.2", y: "3.4"}],
      instructions: []
    };
    expect(TESTING_REROUTING_SYSTEM.checkShouldReroute(path, path)).toBe(false);
  });
  test("Check Should Reroute succeeds with no common leg", async () => {
    const path1: IPath = {
      source: {x: "1.2", y: "3.4"},
      target: {x: "1.2", y: "3.4"},
      route: [{
        x: "1",
        y: "1"
      }],
      instructions: []
    };
    const path2: IPath = {
      source: {x: "1.2", y: "3.4"},
      target: {x: "1.2", y: "3.4"},
      route: [{
        x: "2",
        y: "2"
      }],
      instructions: []
    };
    expect(TESTING_REROUTING_SYSTEM.checkShouldReroute(path1, path2)).toBe(true);
  });
  test("Check Should Reroute fails with common leg as only leg", async () => {
    const path1: IPath = {
      source: {x: "1.2", y: "3.4"},
      target: {x: "1.2", y: "3.4"},
      route: [{
        x: "1",
        y: "1"
      }],
      instructions: []
    };
    const path2: IPath = {
      source: {x: "1.2", y: "3.4"},
      target: {x: "1.2", y: "3.4"},
      route: [
        {
          x: "1",
          y: "1"
        }, 
        {
          x: "2",
          y: "2"
        }, 
      ],
      instructions: []
    };
    expect(TESTING_REROUTING_SYSTEM.checkShouldReroute(path1, path2)).toBe(false);
  });
  test("Check Should Reroute succeeds with different legs after common leg", async () => {
    const path1: IPath = {
      source: {x: "1.2", y: "3.4"},
      target: {x: "1.2", y: "3.4"},
      route: [
        {
          x: "1",
          y: "1"
        }, 
        {
          x: "2",
          y: "2"
        }, 
        {
          x: "3",
          y: "3"
        }, 
      ],
      instructions: []
    };
    const path2: IPath = {
      source: {x: "1.2", y: "3.4"},
      target: {x: "1.2", y: "3.4"},
      route: [
        {
          x: "1",
          y: "1"
        }, 
        {
          x: "2",
          y: "2"
        }, 
        {
          x: "4",
          y: "4"
        }, 
      ],
      instructions: []
    };
    expect(TESTING_REROUTING_SYSTEM.checkShouldReroute(path1, path2)).toBe(true);
  });
})