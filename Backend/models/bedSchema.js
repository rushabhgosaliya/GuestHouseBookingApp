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
    bedType: {
      type: String,
      enum: ["single", "double", "suit"],
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Ensure that the same bed number cannot be reused within the same room
// One room → many beds, but each bednumber must be unique per roomId
bedSchema.index({ roomId: 1, bednumber: 1 }, { unique: true });

export default mongoose.model("bed", bedSchema);
