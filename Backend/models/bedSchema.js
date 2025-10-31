import mongoose from "mongoose";

const bedSchema = new mongoose.Schema(
  {
    bedId: {
      type: String,
      required: true,
      unique: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room",
      required: true,
    },
    bednumber: {
      type: Number,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("bed", bedSchema);
