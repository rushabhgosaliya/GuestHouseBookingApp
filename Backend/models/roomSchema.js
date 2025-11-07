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

roomSchema.plugin(AutoIncrement, { inc_field: "roomId" });

export default mongoose.model("room", roomSchema);
