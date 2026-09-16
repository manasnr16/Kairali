import mongoose from "mongoose";

const biodataSchema = new mongoose.Schema(
  {
    bioId: { type: Number, required: true, unique: true },
    email: { type: String, required: true },
    biodataType: { type: String },
    name: { type: String },
    profileImage: { type: String },
    mobile: { type: String },
    dob: { type: String },
    age: { type: Number },
    height: { type: String },
    weight: { type: String },
    occupation: { type: String },
    race: { type: String },
    fatherName: { type: String },
    motherName: { type: String },
    permanentDivision: { type: String },
    presentDivision: { type: String },
    expectedPartnerAge: { type: Number },
    expectedPartnerHeight: { type: String },
    expectedPartnerWeight: { type: String },

    // Moderation — controlled exclusively via /admin routes.
    // "active": visible everywhere (default). "archived": hidden from public
    // search/detail but the owner keeps their account. "blacklisted": hidden
    // everywhere and flagged for policy violations.
    status: {
      type: String,
      enum: ["active", "archived", "blacklisted"],
      default: "active",
      index: true,
    },
    statusReason: { type: String, default: "" },
    statusUpdatedAt: { type: Date },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("Biodata", biodataSchema);
