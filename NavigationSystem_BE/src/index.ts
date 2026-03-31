import testRouter from "./Routers/TestRouter";
import navRouter from "./Routers/NavRouter";
import swaggerUI from "swagger-ui-express";
const swaggerjsonFilePath = import("../Swagger/swagger-output.json");
import express from 'express';
import cors from 'cors';

const appRouter = express(); 

const setupApp = async () => {
  const PORT = 5002;

  appRouter.use(express.json());
  appRouter.use(cors({origin: "*"}))
  appRouter.use("/apidocs", swaggerUI.serve, swaggerUI.setup(await swaggerjsonFilePath));
  appRouter.use("/", testRouter);
  appRouter.use("/nav/", navRouter);
  appRouter.listen(PORT, () => {console.log("App listening at port " + PORT)});
}

setupApp();

export default appRouter;
