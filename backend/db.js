import mongoose from "mongoose";

// Reuses a single connection across invocations (required in serverless:
// a fresh module load per cold start would otherwise open a new connection
// on every request and exhaust MongoDB Atlas connection limits).
let connectPromise = null;

export function connectDB() {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!connectPromise) {
    connectPromise = mongoose.connect(process.env.MONGODB_URI).catch((err) => {
      connectPromise = null;
      throw err;
    });
  }
  return connectPromise;
}
