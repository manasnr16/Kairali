import express from "express";
import ContactRequest from "../models/ContactRequest.js";

const router = express.Router();

// GET /all-contact-request -> every request (admin "Approve Contacts" page)
router.get("/all-contact-request", async (req, res) => {
  const requests = await ContactRequest.find().sort({ createdAt: -1 });
  res.send(requests);
});

// GET /all-contact-request/:bioId -> requests made BY this biodata owner ("My Contact Requests")
router.get("/all-contact-request/:bioId", async (req, res) => {
  const requestBioId = Number(req.params.bioId);
  const requests = await ContactRequest.find({ requestBioId }).sort({ createdAt: -1 });
  res.send(requests);
});

// POST /contact-requests -> create a new request (payment currently skipped in dev)
router.post("/contact-requests", async (req, res) => {
  const { biodataId, requestBioId } = req.body;

  const existing = await ContactRequest.findOne({ biodataId, requestBioId });
  if (existing) return res.status(409).send({ message: "Contact already requested" });

  const request = await ContactRequest.create({ ...req.body, status: "pending" });
  res.status(201).send(request);
});

// PATCH /approve-contact/:id
router.patch("/approve-contact/:id", async (req, res) => {
  const result = await ContactRequest.updateOne(
    { _id: req.params.id },
    { $set: { status: "approved" } }
  );
  res.send(result);
});

// PATCH /update-contact-request-name/:email -> keep requester name in sync with their profile
router.patch("/update-contact-request-name/:email", async (req, res) => {
  const { name } = req.body;
  const result = await ContactRequest.updateMany(
    { requestEmail: req.params.email },
    { $set: { requestName: name } }
  );
  res.send(result);
});

// DELETE /all-contact-request/:id
router.delete("/all-contact-request/:id", async (req, res) => {
  const result = await ContactRequest.deleteOne({ _id: req.params.id });
  res.send(result);
});

export default router;
