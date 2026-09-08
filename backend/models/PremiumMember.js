import mongoose from "mongoose";

// Denormalized snapshot of a biodata once its owner is approved as premium.
const premiumMemberSchema = new mongoose.Schema(
  {
    bioId: { type: Number },
    email: { type: String },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("PremiumMember", premiumMemberSchema);
