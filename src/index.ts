import testRouter from "./Routers/TestRouter";

let express = require ('express');

const appRouter = express(); 
const PORT = 5000;

appRouter.use(express.json());
appRouter.use("/", testRouter);
appRouter.listen(PORT, () => {
  console.log("App listening at port " + PORT)
});

export default appRouter;
