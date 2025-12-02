import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const connection = mongoose.connection;
const AutoIncrement = AutoIncrementFactory(connection);

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: Number,
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
    isBooked: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Ensure that the same room number cannot be reused within the same guest house
// One guest house → many rooms, but each roomNumber must be unique per guesthouseId
roomSchema.index({ guesthouseId: 1, roomNumber: 1 }, { unique: true });

roomSchema.plugin(AutoIncrement, { inc_field: "roomId" });

export default mongoose.model("room", roomSchema);
