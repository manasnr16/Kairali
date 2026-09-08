import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "express-async-errors"; // lets async route handlers forward thrown errors to the error middleware below

import usersRoutes from "./routes/users.js";
import biodatasRoutes from "./routes/biodatas.js";
import premiumMembersRoutes from "./routes/premiumMembers.js";
import favouritesRoutes from "./routes/favourites.js";
import contactRequestsRoutes from "./routes/contactRequests.js";
import successStoriesRoutes from "./routes/successStories.js";

const app = express();
const port = process.env.PORT || 3000;

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

app.get("/", (req, res) => {
  res.send("Rishta Matrimony API is running");
});

app.use(usersRoutes);
app.use(biodatasRoutes);
app.use(premiumMembersRoutes);
app.use(favouritesRoutes);
app.use(contactRequestsRoutes);
app.use(successStoriesRoutes);

// Basic error handler so a thrown/rejected error becomes a JSON 500
// instead of crashing the process or hanging the request.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: err.message || "Internal server error" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(port, () => {
      console.log(`🚀 Server listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
