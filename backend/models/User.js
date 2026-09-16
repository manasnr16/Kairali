import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isPremium: { type: Boolean, default: false },
    premiumRequest: { type: Boolean, default: false },
    premiumPlan: { type: String, enum: ["Basic", "Gold", "Platinum", null], default: null },
    bioId: { type: Number, default: null },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("User", userSchema);
