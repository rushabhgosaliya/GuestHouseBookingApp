import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingsByUser,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  updatePastBookingsAvailability,
} from "../controller/bookingController.js";

const router = express.Router();

//  Create a new booking
router.post("/", createBooking);

//  Get all bookings (admin)
router.get("/", getAllBookings);

//  Get all bookings for a specific user
router.get("/user/:userId", getBookingsByUser);

//  Update availability for past bookings (auto-availability after checkout)
router.post("/update-availability", updatePastBookingsAvailability);

//  Get single booking by ID
router.get("/:id", getBookingById);

//  Update booking status (Approve/Reject/Cancel)
router.patch("/:id", updateBookingStatus);

//  Delete booking
router.delete("/:id", deleteBooking);

export default router;
