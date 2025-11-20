import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

// Get existing connection instance
const connection = mongoose.connection;

// Initialize AutoIncrement
const AutoIncrement = AutoIncrementFactory(connection);

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: Number,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guesthouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GuestHouse",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room",
      required: true,
    },
    bedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bed",
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// ✅ Auto-Increment Plugin
bookingSchema.plugin(AutoIncrement, {
  inc_field: "bookingId", // The field to auto-increment
  start_seq: 1,        // Starting number (optional)
});

export default mongoose.model("booking", bookingSchema);
