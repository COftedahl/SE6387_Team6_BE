import request from 'supertest';
import appRouter from '../src/index';
import { TESTING_AMENITIES_ROUTE_PATH, TESTING_NAV_ROUTE_PATH, TESTING_ORIGINAL_LOG } from './constants';

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
  appRouter.close();
  appRouter.closeAllConnections();
});

describe("Amenities Router Tests", () => {
  test("/all incorrect post body", async () => {
    const result = await request(appRouter).post(TESTING_AMENITIES_ROUTE_PATH + "/all");
    expect(result.status).toBe(422);
  });
  test("/all correct post body", async () => {
    const result = await request(appRouter).post(TESTING_AMENITIES_ROUTE_PATH + "/all").send({locationX: "1",locationY: "2"});
    expect(result.status).toBe(200);
  });
  test("/oftype incorrect post body", async () => {
    const result = await request(appRouter).post(TESTING_AMENITIES_ROUTE_PATH + "/oftype");
    expect(result.status).toBe(422);
  });
  test("/oftype correct post body", async () => {
    const result = await request(appRouter).post(TESTING_AMENITIES_ROUTE_PATH + "/oftype").send({locationX: "1",locationY: "2", amenityType: "RESTROOM"});
    expect(result.status).toBe(200);
  });
  test("/suggested incorrect post body", async () => {
    const result = await request(appRouter).post(TESTING_AMENITIES_ROUTE_PATH + "/suggested");
    expect(result.status).toBe(422);
  });
  test("/suggested correct post body", async () => {
    const result = await request(appRouter).post(TESTING_AMENITIES_ROUTE_PATH + "/suggested").send({locationX: "1",locationY: "2", filters: []});
    expect(result.status).toBe(200);
  });
  test("/details incorrect post body", async () => {
    const result = await request(appRouter).post(TESTING_AMENITIES_ROUTE_PATH + "/details");
    expect(result.status).toBe(422);
  });
  test("/details correct post body", async () => {
    const result = await request(appRouter).post(TESTING_AMENITIES_ROUTE_PATH + "/details").send({id: "AM1"});
    expect(result.status).toBe(200);
  });
  test("/filter incorrect post body", async () => {
    const result = await request(appRouter).post(TESTING_AMENITIES_ROUTE_PATH + "/filter");
    expect(result.status).toBe(422);
  });
  test("/filter correct post body", async () => {
    const result = await request(appRouter).post(TESTING_AMENITIES_ROUTE_PATH + "/filter").send({filters: [{filterKey: "type", value: "RESTROOM"}]});
    expect(result.status).toBe(200);
  });
});

describe("Nav Router Tests", () => {
  test("/map incorrect post body", async () => {
    const result = await request(appRouter).post(TESTING_NAV_ROUTE_PATH + "/map");
    expect(result.status).toBe(422);
  });
  test("/map correct post body", async () => {
    const result = await request(appRouter).post(TESTING_NAV_ROUTE_PATH + "/map").send({locationX: "1",locationY: "2"});
    expect(result.status).toBe(200);
  });
});