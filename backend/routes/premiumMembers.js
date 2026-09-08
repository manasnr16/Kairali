import express from "express";
import PremiumMember from "../models/PremiumMember.js";

const router = express.Router();

// GET /all-premium-members
router.get("/all-premium-members", async (req, res) => {
  const members = await PremiumMember.find();
  res.send(members);
});

// POST /all-premium-members -> snapshot a biodata into the premium list (dedup by bioId)
router.post("/all-premium-members", async (req, res) => {
  const { bioId } = req.body;
  if (bioId) {
    const existing = await PremiumMember.findOne({ bioId });
    if (existing) return res.status(409).send({ message: "Already a premium member" });
  }
  const member = await PremiumMember.create(req.body);
  res.status(201).send(member);
});

export default router;
