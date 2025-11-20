import mongoose from "mongoose";

const bedSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room",
      required: true,
    },
    bednumber: {
      type: Number,
      required: true,
    },
    bedType:{
      type: String,
      enum:["single","double","suit"],
      required:true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("bed", bedSchema);
