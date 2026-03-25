import testRouter from "./Routers/TestRouter";
import amenityRouter from "./Routers/AmenityRouter";
import express from 'express';
import cors from 'cors';

const appRouter = express(); 
const PORT = 5001;

appRouter.use(express.json());
appRouter.use(cors({origin: "*"}))
appRouter.use("/", testRouter);
appRouter.use("/amenities/", amenityRouter);
appRouter.listen(PORT, () => {console.log("App listening at port " + PORT)});

export default appRouter;
