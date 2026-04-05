import dotenv from 'dotenv';
import { testAmenityDetails1, testAmenityDetails2, testAmenityDetails3, TESTING_ORIGINAL_LOG, TESTING_RECOMMENDATION_SYSTEM } from "./constants";
import { beforeAll, afterAll, describe, test, expect } from '@jest/globals';
import AMENITY_SORTING_TYPE from '../src/Types/AmenitySortingType';

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
    throw new Error("Failed to set the data in the amenity manager external system - make sure the system is running before executing amenity manager tests.")
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
afterAll(async () => {
  console.log = TESTING_ORIGINAL_LOG;
});

//NOTE: the amenity manager and navigation external systems must be running for these tests
describe("Recommendation System unit tests", () => {
  
  test("get map suggestions returns empty list", async () => {
    expect((await TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions([{filterKey: "amenityType", value: "BAR"}], {x: "0", y: "0"}, AMENITY_SORTING_TYPE.LEAST_WAIT_TIME)).length).toEqual(0);
  });
  test("get map suggestions least wait time succeeds", async () => {
    expect((await TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions([], {x: "0", y: "0"}, AMENITY_SORTING_TYPE.LEAST_WAIT_TIME)).length).toBeGreaterThanOrEqual(1);
  });
  test("get map suggestions best route succeeds", async () => {
    expect((await TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions([], {x: "0", y: "0"}, AMENITY_SORTING_TYPE.BEST_ROUTE)).length).toBeGreaterThanOrEqual(1);
  });
  test("get map suggestions least distance succeeds", async () => {
    expect((await TESTING_RECOMMENDATION_SYSTEM.getMapSuggestions([], {x: "0", y: "0"}, AMENITY_SORTING_TYPE.LEAST_WALKING)).length).toBeGreaterThanOrEqual(1);
  });
});