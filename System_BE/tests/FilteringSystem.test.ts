import AMENITY_TYPE from '../src/Types/AmenityType';
import { testAmenity1, testAmenity2, testAmenity3, testAmenityDetails1, testAmenityDetails2, testAmenityDetails3, TESTING_FILTERING_SYSTEM, TESTING_ORIGINAL_LOG } from './constants';
import { beforeAll, afterAll, describe, test, expect } from '@jest/globals';

const logs: string[] = [];

/* 
 * eliminates console logging output during tests to unclutter the test report;
 * if need to see console logs during tests, then comment out the beforeAll function 
 * or just run the pertient code in the afterAll function when you need to see the log
 */
beforeAll(() => {
  logs.splice(0,logs.length);
  console.log = (...args) => {
    logs.push(args.join(' '));
  };
});

/* 
 * restores the console.log function to regular operation
 */
afterAll(() => {
  console.log = TESTING_ORIGINAL_LOG;
});

describe("Filtering System unit tests", () => {
  test("get available amenities succeeds with no filters", async () => {
    expect(await TESTING_FILTERING_SYSTEM.getAvailableAmenities([])).toEqual(expect.arrayContaining([testAmenity1, testAmenity2, testAmenity3]));
  });
  test("get available amenities succeeds with simple filters", async () => {
    expect(await TESTING_FILTERING_SYSTEM.getAvailableAmenities([{filterKey: "type", value: "RESTROOM"}])).toEqual(expect.arrayContaining([testAmenity2]));
  });
  test("get available amenities succeeds with complex filters", async () => {
    expect(await TESTING_FILTERING_SYSTEM.getAvailableAmenities([{filterKey: "currentAvailableSlots", value: {le: 2}}])).toEqual(expect.arrayContaining([]));
  });
  test("get available amenities returns empty", async () => {
    expect(await TESTING_FILTERING_SYSTEM.getAvailableAmenities([{filterKey: "amenityType", value: "RESTROOM"}, {filterKey: "accessibilityClass", value: "ACCESSIBLE"}])).toEqual(expect.arrayContaining([]));
  });
  test("get amenity details succeeds with no filters", async () => {
    expect(await TESTING_FILTERING_SYSTEM.getAmenityDetails([])).toEqual(expect.arrayContaining([testAmenityDetails1, testAmenityDetails2, testAmenityDetails3]));
  });
  test("get amenity details succeeds with simple filters", async () => {
    expect(await TESTING_FILTERING_SYSTEM.getAmenityDetails([{filterKey: "accessibilityClass", value: "ACCESSIBLE"}])).toEqual(expect.arrayContaining([testAmenityDetails1, testAmenityDetails3]));
  });
  test("get amenity details succeeds with complex filters gt", async () => {
    expect(await TESTING_FILTERING_SYSTEM.getAmenityDetails([{filterKey: "currentAvailableSlots", value: {gt: 3}}])).toEqual(expect.arrayContaining([testAmenityDetails1]));
  });
  test("get amenity details succeeds with complex filters ge", async () => {
    expect(await TESTING_FILTERING_SYSTEM.getAmenityDetails([{filterKey: "currentAvailableSlots", value: {ge: 3}}])).toEqual(expect.arrayContaining([testAmenityDetails1, testAmenityDetails3]));
  });
  test("get amenity details succeeds with complex filters le", async () => {
    expect(await TESTING_FILTERING_SYSTEM.getAmenityDetails([{filterKey: "currentAvailableSlots", value: {le: 3}}])).toEqual(expect.arrayContaining([testAmenityDetails2, testAmenityDetails3]));
  });
  test("get amenity details succeeds with complex filters lt", async () => {
    expect(await TESTING_FILTERING_SYSTEM.getAmenityDetails([{filterKey: "currentAvailableSlots", value: {lt: 3}}])).toEqual(expect.arrayContaining([testAmenityDetails2]));
  });
  test("get amenity details succeeds with complex filters lt 2", async () => {
    expect(await TESTING_FILTERING_SYSTEM.getAmenityDetails([{filterKey: "currentAvailableSlots", value: {lt: 2}}])).toEqual(expect.arrayContaining([]));
  });
  test("get amenity details returns empty", async () => {
    expect(await TESTING_FILTERING_SYSTEM.getAmenityDetails([{filterKey: "amenityType", value: "RESTROOM"}, {filterKey: "accessibilityClass", value: "ACCESSIBLE"}])).toEqual(expect.arrayContaining([]));
  });
  test("get available amenities of type succeeds with no filters", async () => {
    expect(await TESTING_FILTERING_SYSTEM.getAvailableAmenitiesOfType(AMENITY_TYPE.BAR,[])).toEqual(expect.arrayContaining([testAmenity1]));
  });
  test("get available amenities of type succeeds with simple filters", async () => {
    expect(await TESTING_FILTERING_SYSTEM.getAvailableAmenitiesOfType(AMENITY_TYPE.COFFEE,[{filterKey: "type", value: "COFFEE"}, {filterKey: "accessibilityClass", value: "ACCESSIBLE"}])).toEqual(expect.arrayContaining([testAmenity3]));
  });
  test("get available amenities of type succeeds with complex filters", async () => {
    expect(await TESTING_FILTERING_SYSTEM.getAvailableAmenitiesOfType(AMENITY_TYPE.COFFEE,[{filterKey: "currentAvailableSlots", value: {gt: 3}}])).toEqual(expect.arrayContaining([]));
  });
  test("get available amenities of type returns empty", async () => {
    expect(await TESTING_FILTERING_SYSTEM.getAvailableAmenitiesOfType(AMENITY_TYPE.RESTROOM,[{filterKey: "amenityType", value: "RESTROOM"}, {filterKey: "accessibilityClass", value: "ACCESSIBLE"}])).toEqual(expect.arrayContaining([]));
  });
});