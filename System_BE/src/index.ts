import amenitiesRouter from "./Routers/AmenitiesRouter";
import navRouter from "./Routers/NavRouter";
import testRouter from "./Routers/TestRouter";

let express = require ('express');

const appRouter = express(); 
var expressWs = require('express-ws')(appRouter);
const PORT = 5000;

appRouter.use(express.json());
appRouter.use("/", testRouter);
appRouter.use("/nav/", navRouter);
appRouter.use("/amenities/", amenitiesRouter);
appRouter.listen(PORT, () => {
  console.log("App listening at port " + PORT)
});

export default appRouter;
