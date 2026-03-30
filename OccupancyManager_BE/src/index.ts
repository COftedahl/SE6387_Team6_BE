import testRouter from "./Routers/TestRouter";
import amenityRouter from "./Routers/AmenityRouter";
import swaggerUI from "swagger-ui-express";
const swaggerjsonFilePath = import("../Swagger/swagger-output.json");
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const appRouter = express(); 

const setupApp = async () => {
  const PORT = 5004;
  dotenv.config();

  appRouter.use(express.json());
  appRouter.use(cors({origin: "*"}))
  appRouter.use("/apidocs", swaggerUI.serve, swaggerUI.setup(await swaggerjsonFilePath));
  appRouter.use("/", testRouter);
  appRouter.use("/amenities/", amenityRouter);
  appRouter.listen(PORT, () => {console.log("App listening at port " + PORT)});
}

setupApp();

export default appRouter;
