import testRouter from "./Routers/TestRouter";
import amenityRouter from "./Routers/AmenityRouter";
import swaggerUI from "swagger-ui-express";
const swaggerjsonFilePath = import("../Swagger/swagger-output.json");
import express from 'express';
import cors from 'cors';
import subscriptionRouter from "./Routers/SubscriptionRouter";

const appRouter = express(); 

const setupApp = async () => {
  const PORT = 5001;

  appRouter.use(express.json());
  appRouter.use(cors({origin: "*"}))
  appRouter.use("/apidocs", swaggerUI.serve, swaggerUI.setup(await swaggerjsonFilePath));
  appRouter.use("/", testRouter);
  appRouter.use("/amenities/", amenityRouter);
  appRouter.use("/subscription/", subscriptionRouter);
  appRouter.listen(PORT, () => {console.log("App listening at port " + PORT)});
}

setupApp();

export default appRouter;
