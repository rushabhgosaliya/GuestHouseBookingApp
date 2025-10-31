import mongoose from "mongoose";

const guesthouseSchema = new mongoose.Schema(
  {
    guesthouseId: {
      type: String,
      required: true,
      unique: true,
    },
    guestHouseName: {
      type: String,
      required: true,
    },
    location: {
      city: String,
      state: String,
    },
    description: {
      type: String,
    },
    image_url: {
      type: String,
      required: true,
    },
    underMaintenance: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("GuestHouse", guesthouseSchema);
