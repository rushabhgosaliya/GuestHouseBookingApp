import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingsByUser,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from "../controller/bookingController.js";

const router = express.Router();

// 🟢 Create a new booking
router.post("/", createBooking);

// 🟡 Get all bookings (admin)
router.get("/", getAllBookings);

// 🟠 Get all bookings for a specific user
router.get("/user/:userId", getBookingsByUser);

// 🔵 Get single booking by ID
router.get("/:id", getBookingById);

// 🟣 Update booking status (Approve/Reject)
router.patch("/:id", updateBookingStatus);  // ✅ THIS LINE IS REQUIRED

// 🔴 Delete booking
router.delete("/:id", deleteBooking);

export default router;
