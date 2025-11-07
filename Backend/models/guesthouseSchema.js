import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const connection = mongoose.connection; // use existing mongoose connection
const AutoIncrement = AutoIncrementFactory(connection);

const guesthouseSchema = new mongoose.Schema(
  {
    guesthouseId: {
      type: Number, // now it's a number for auto increment
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

// ✅ Auto-increment plugin for guesthouseId
guesthouseSchema.plugin(AutoIncrement, { inc_field: "guesthouseId" });

export default mongoose.model("GuestHouse", guesthouseSchema);
