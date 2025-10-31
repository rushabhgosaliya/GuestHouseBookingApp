import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,  
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
}, { timestamps: true });

export default mongoose.model("booking", bookingSchema);
