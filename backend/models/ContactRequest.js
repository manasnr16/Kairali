import mongoose from "mongoose";

const contactRequestSchema = new mongoose.Schema(
  {
    biodataId: { type: Number },
    requestBioId: { type: Number },
    requestEmail: { type: String },
    requestName: { type: String },
    requestMobile: { type: String },
    transactionId: { type: String },
    status: { type: String, enum: ["pending", "approved"], default: "pending" },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("ContactRequest", contactRequestSchema);
