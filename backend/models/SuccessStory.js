import mongoose from "mongoose";

const successStorySchema = new mongoose.Schema(
  {
    selfId: { type: Number },
    partnerId: { type: Number },
    title: { type: String },
    coupleImage: { type: String },
    marriageDate: { type: String },
    rating: { type: Number },
    story: { type: String },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("SuccessStory", successStorySchema);
