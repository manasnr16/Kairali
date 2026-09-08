import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET /authusers?email=  -> single user record (used by AuthProvider to know role/premium status)
router.get("/authusers", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "email query param is required" });
  const user = await User.findOne({ email });
  res.send(user || null);
});

// GET /users?name=&role=&page=&limit=  -> paginated list (admin "Manage Users" page)
router.get("/users", async (req, res) => {
  const { name = "", role = "", page = 1, limit = 10 } = req.query;
  const query = {};
  if (name) query.name = { $regex: name, $options: "i" };
  if (role) query.role = role;

  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.max(parseInt(limit) || 10, 1);

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .sort({ createdAt: -1 });

  res.send({ users, totalPages: Math.max(Math.ceil(total / limitNum), 1) });
});

// GET /requestedpremiumuser -> users who have asked to go premium (admin "Approve Premium" page)
router.get("/requestedpremiumuser", async (req, res) => {
  const users = await User.find({ premiumRequest: true });
  res.send(users);
});

// POST /users -> create a user record on signup (idempotent by email)
router.post("/users", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "email is required" });

  const existing = await User.findOne({ email });
  if (existing) return res.send(existing);

  const user = await User.create(req.body);
  res.status(201).send(user);
});

// PATCH /make-admin/:email
router.patch("/make-admin/:email", async (req, res) => {
  const result = await User.updateOne(
    { email: req.params.email },
    { $set: { role: "admin" } }
  );
  res.send(result);
});

// PATCH /make-premium/:email  -> approve a premium request
router.patch("/make-premium/:email", async (req, res) => {
  const result = await User.updateOne(
    { email: req.params.email },
    { $set: { isPremium: true, premiumRequest: false } }
  );
  res.send(result);
});

// PATCH /update-user-name/:email
router.patch("/update-user-name/:email", async (req, res) => {
  const { name } = req.body;
  const result = await User.updateOne(
    { email: req.params.email },
    { $set: { name } }
  );
  res.send(result);
});

// PATCH /biodata/request-premium/:email -> user asks admin to make their biodata premium
router.patch("/biodata/request-premium/:email", async (req, res) => {
  const { bioId } = req.body;
  const result = await User.updateOne(
    { email: req.params.email },
    { $set: { premiumRequest: true, bioId } }
  );
  res.send(result);
});

export default router;
