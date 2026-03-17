import express from 'express';

const testRouter = express.Router();

//function to show the back end is running
testRouter.get("/", async (req, res) => {
  res.json("You found the test router!");
})

export default testRouter;