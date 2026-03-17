import express from 'express';
import swaggerUI from "swagger-ui-express";
const swaggerjsonFilePath = import("../Swagger/swagger-output.json");
import { WebSocketExpress } from 'websocket-express';
import amenitiesRouter from "./Routers/AmenitiesRouter";
import navRouter from "./Routers/NavRouter";
import testRouter from "./Routers/TestRouter";

const appRouter = new WebSocketExpress(); 

const setupApp = async () => {
  const PORT = 5000;
  appRouter.use(express.json());
  appRouter.use("/apidocs", swaggerUI.serve, swaggerUI.setup(await swaggerjsonFilePath));
  appRouter.use("/", testRouter);
  appRouter.use("/nav/", navRouter);
  appRouter.use("/amenities/", amenitiesRouter);

  appRouter.listen(PORT, () => {
    console.log("App listening at port " + PORT)
  });
}

setupApp();

export default appRouter;