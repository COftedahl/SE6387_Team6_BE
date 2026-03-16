import express from 'express';

const testRouter = express.Router();

//function to retrieve all units from an army
testRouter.get("", async (req, res) => {
  res.json("You found the test router!");
})

export default testRouter;