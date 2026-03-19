import express from 'express';
import swaggerUI from "swagger-ui-express";
const swaggerjsonFilePath = import("../Swagger/swagger-output.json");
import { WebSocketExpress } from 'websocket-express';
import amenitiesRouter from "./Routers/AmenitiesRouter";
import navRouter from "./Routers/NavRouter";
import testRouter from "./Routers/TestRouter";
import { Server } from 'http';
import cors from 'cors';

const appRouter = new WebSocketExpress(); 
let server: Server = appRouter.createServer();

const setupApp = async () => {
  const PORT = 5000;
  appRouter.use(express.json());
  appRouter.use(cors({origin: "*"}))
  appRouter.use("/apidocs", swaggerUI.serve, swaggerUI.setup(await swaggerjsonFilePath));
  appRouter.use("/", testRouter);
  appRouter.use("/nav/", navRouter);
  appRouter.use("/amenities/", amenitiesRouter);

  server.listen(PORT, () => {
    console.log("App listening at port " + PORT)
  });
}

setupApp();

export default server;