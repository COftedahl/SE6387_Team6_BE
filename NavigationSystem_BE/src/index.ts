import testRouter from "./Routers/TestRouter";
import navRouter from "./Routers/NavRouter";
import express from 'express';
import cors from 'cors';

const appRouter = express(); 
const PORT = 5002;

appRouter.use(express.json());
appRouter.use(cors({origin: "*"}))
appRouter.use("/", testRouter);
appRouter.use("/nav/", navRouter);
appRouter.listen(PORT, () => {console.log("App listening at port " + PORT)});

export default appRouter;
