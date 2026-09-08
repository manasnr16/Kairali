import express from "express";
import Biodata from "../models/Biodata.js";

const router = express.Router();

// GET /biodatas -> everyone's biodata (public listing + admin stats)
router.get("/biodatas", async (req, res) => {
  const biodatas = await Biodata.find();
  res.send(biodatas);
});

// GET /biodata?email= -> the logged-in user's own biodata
router.get("/biodata", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ success: false, message: "email query param is required" });

  const biodata = await Biodata.findOne({ email });
  if (!biodata) return res.send({ success: false, data: null });
  res.send({ success: true, data: biodata });
});

// GET /biodatabyid/:biodataId -> single biodata by its public bioId number
router.get("/biodatabyid/:biodataId", async (req, res) => {
  const bioId = Number(req.params.biodataId);
  const biodata = await Biodata.findOne({ bioId });
  if (!biodata) return res.status(404).send({ message: "Biodata not found" });
  res.send(biodata);
});

// POST /add-biodata -> create a new biodata, auto-assigning the next bioId
router.post("/add-biodata", async (req, res) => {
  const count = await Biodata.countDocuments();
  const bioId = count + 1;

  const biodata = await Biodata.create({ ...req.body, bioId });
  res.status(201).send({ success: true, data: biodata });
});

// PATCH /update-biodata/:email -> edit an existing biodata
router.patch("/update-biodata/:email", async (req, res) => {
  const result = await Biodata.updateOne(
    { email: req.params.email },
    { $set: req.body }
  );
  res.send(result);
});

export default router;
