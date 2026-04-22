import express from 'express';
import swaggerUI from "swagger-ui-express";
const swaggerjsonFilePath = import("../Swagger/swagger-output.json");
import amenitiesRouter from "./Routers/AmenitiesRouter";
import infrastructureRouter from "./Routers/InfrastructureRouter";
import navRouter, { attemptToSubscribe, stopTimers } from "./Routers/NavRouter";
import testRouter from "./Routers/TestRouter";
import { Server } from 'http';
import { WebSocketExpress } from 'websocket-express';
import cors from 'cors';
import dotenv from 'dotenv';

const setupApp = async (port: number): Promise<Server> => {
  console.log("PORT parameter: ", port);
  const appRouter = new WebSocketExpress(); 
  let server: Server = appRouter.createServer();
  
  dotenv.config();
  const PORT = (port !== undefined ? port : (process.env.PORT ? Number.parseInt(process.env.PORT) : 5000));
  appRouter.use(express.json());
  appRouter.use(cors({origin: "*"}))
  appRouter.use("/apidocs", swaggerUI.serve, swaggerUI.setup(await swaggerjsonFilePath));
  appRouter.use("/", testRouter);
  appRouter.use("/nav/", navRouter);
  appRouter.use("/amenities/", amenitiesRouter);
  appRouter.use("/infrastructure/", infrastructureRouter);

  const promise: Promise<void> = new Promise((resolve, reject) => {
    server.listen(PORT, "127.0.0.1", undefined, () => {
      console.log("App listening at port " + PORT);
      resolve();
    });
  });

  await promise;

  if (process.env.BUILD_VERSION && process.env.BUILD_VERSION === "production") {
    try {
      await attemptToSubscribe();
    }
    catch (e) {}
  }

  server.on("close", stopTimers);

  return server;
}

export default setupApp;