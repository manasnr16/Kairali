import express from "express";
import Favourite from "../models/Favourite.js";

const router = express.Router();

// GET /myfevorites?email= -> a user's saved favourite biodatas
router.get("/myfevorites", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "email query param is required" });
  const favourites = await Favourite.find({ Authemail: email });
  res.send(favourites);
});

// POST /addfevorites -> dedup on (bioId, Authemail)
router.post("/addfevorites", async (req, res) => {
  const { bioId, Authemail } = req.body;
  const existing = await Favourite.findOne({ bioId, Authemail });
  if (existing) return res.status(409).send({ message: "Already added to favourites" });

  const favourite = await Favourite.create(req.body);
  res.status(201).send(favourite);
});

// DELETE /deletefevorite/:id
router.delete("/deletefevorite/:id", async (req, res) => {
  const result = await Favourite.deleteOne({ _id: req.params.id });
  res.send(result);
});

export default router;
