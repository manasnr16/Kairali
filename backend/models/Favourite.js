import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema(
  {
    name: { type: String },
    presentDivision: { type: String },
    occupation: { type: String },
    bioId: { type: Number, required: true },
    Authemail: { type: String, required: true },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("Favourite", favouriteSchema);
