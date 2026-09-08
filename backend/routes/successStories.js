import express from "express";
import SuccessStory from "../models/SuccessStory.js";

const router = express.Router();

// GET /success-story -> all stories
router.get("/success-story", async (req, res) => {
  const stories = await SuccessStory.find().sort({ createdAt: -1 });
  res.send(stories);
});

// GET /success-story/:storyId -> single story
router.get("/success-story/:storyId", async (req, res) => {
  const story = await SuccessStory.findById(req.params.storyId);
  if (!story) return res.status(404).send({ message: "Story not found" });
  res.send(story);
});

// POST /success-story -> submit a new success story
router.post("/success-story", async (req, res) => {
  const story = await SuccessStory.create(req.body);
  res.status(201).send(story);
});

export default router;
