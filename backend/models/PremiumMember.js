import mongoose from "mongoose";

// Denormalized snapshot of a biodata once its owner is approved as premium.
const premiumMemberSchema = new mongoose.Schema(
  {
    bioId: { type: Number },
    email: { type: String },
    // No payment gateway is wired up yet (see CheckoutPage), so plan tiers are
    // assigned by the admin at approval time rather than chosen at checkout.
    planType: {
      type: String,
      enum: ["Basic", "Gold", "Platinum"],
      default: "Basic",
    },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("PremiumMember", premiumMemberSchema);
