import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    guesthouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GuestHouse",
      required: true,
    },
    roomNumber: {
      type: Number,
      required: true,
    },
    roomType: {
      type: String,
      enum: ["single", "double", "family"],
      required: true,
    },
    roomCapacity: {
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

export default mongoose.model("room", roomSchema);
