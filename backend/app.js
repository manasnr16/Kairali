import "dotenv/config";
import express from "express";
import cors from "cors";
import "express-async-errors"; // lets async route handlers forward thrown errors to the error middleware below

import { connectDB } from "./db.js";
import usersRoutes from "./routes/users.js";
import otpRoutes from "./routes/otp.js";
import biodatasRoutes from "./routes/biodatas.js";
import premiumMembersRoutes from "./routes/premiumMembers.js";
import favouritesRoutes from "./routes/favourites.js";
import contactRequestsRoutes from "./routes/contactRequests.js";
import successStoriesRoutes from "./routes/successStories.js";
import adminRoutes from "./routes/admin.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

// Serverless-safe: connects once and reuses the cached connection on
// subsequent invocations instead of connecting per request.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "kairali-backend" });
});

app.get("/api", (req, res) => {
  res.send("Kairali Match Makers API is running");
});

app.use("/api", usersRoutes);
app.use("/api", otpRoutes);
app.use("/api", biodatasRoutes);
app.use("/api", premiumMembersRoutes);
app.use("/api", favouritesRoutes);
app.use("/api", contactRequestsRoutes);
app.use("/api", successStoriesRoutes);
app.use("/api", adminRoutes);

// Basic error handler so a thrown/rejected error becomes a JSON 500
// instead of crashing the process or hanging the request.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: err.message || "Internal server error" });
});

export default app;
