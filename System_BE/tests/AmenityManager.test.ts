import dotenv from 'dotenv';
import { testAmenity1, testAmenity2, testAmenity3, testAmenityDetails1, testAmenityDetails2, testAmenityDetails3, TESTING_AMENITY_MANAGER, TESTING_ORIGINAL_LOG } from "./constants";
import { BLANK_AMENITY_DETAILS } from '../src/constants';

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
  });
});

/* 
 * restores the console.log function to regular operation
 */
afterAll(async () => {
  console.log = TESTING_ORIGINAL_LOG;
});

describe("Amenity Manager unit tests", () => {
  test("get amenities succeeds", async () => {
    expect(await TESTING_AMENITY_MANAGER.getAmenities()).toEqual(expect.arrayContaining([testAmenity1, testAmenity2, testAmenity3]));
  });
  test("get amenities fails", async () => {
    const temp: string | undefined = process.env.AMENITY_MANAGER_AMENITIES_ENDPOINT_METHOD;
    delete process.env.AMENITY_MANAGER_AMENITIES_ENDPOINT_METHOD;
    expect(await TESTING_AMENITY_MANAGER.getAmenities()).toEqual([]);
    process.env.AMENITY_MANAGER_AMENITIES_ENDPOINT_METHOD = temp;
  });
  test("get amenity details succeeds", async () => {
    expect(await TESTING_AMENITY_MANAGER.getAmenityDetails("1")).toEqual(testAmenityDetails1);
  });
  test("get amenity details fails", async () => {
    const temp: string | undefined = process.env.AMENITY_MANAGER_AMENITY_DETAILS_ENDPOINT_METHOD;
    delete process.env.AMENITY_MANAGER_AMENITY_DETAILS_ENDPOINT_METHOD;
    expect(await TESTING_AMENITY_MANAGER.getAmenityDetails("1")).toEqual(BLANK_AMENITY_DETAILS);
    process.env.AMENITY_MANAGER_AMENITY_DETAILS_ENDPOINT_METHOD = temp;
  });
  test("get all amenity details succeeds", async () => {
    expect(await TESTING_AMENITY_MANAGER.getAllAmenityDetails()).toEqual(expect.arrayContaining([testAmenityDetails1, testAmenityDetails2, testAmenityDetails3]));
  });
  test("get all amenity details fails", async () => {
    const temp: string | undefined = process.env.AMENITY_MANAGER_ALL_AMENITY_DETAILS_ENDPOINT_METHOD;
    delete process.env.AMENITY_MANAGER_ALL_AMENITY_DETAILS_ENDPOINT_METHOD;
    expect(await TESTING_AMENITY_MANAGER.getAllAmenityDetails()).toEqual([]);
    process.env.AMENITY_MANAGER_ALL_AMENITY_DETAILS_ENDPOINT_METHOD = temp;
  });
})