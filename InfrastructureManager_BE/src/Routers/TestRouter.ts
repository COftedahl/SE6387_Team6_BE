import express from 'express';

const testRouter = express.Router();

//function to indicate the app is running
testRouter.get("/", async (req, res) => {
  res.json("You found the infrastructure manager backend!");
})

export default testRouter;