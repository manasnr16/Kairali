import mongoose from "mongoose";

// Staff/moderator accounts for the /admin control panel. Deliberately separate
// from the `User` collection (which backs the Firebase-authenticated site
// accounts) — admin credentials are username/password only and are never
// created through a public route, only via the `scripts/createAdmin.js` CLI.
const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
