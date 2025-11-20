import express from "express";
import {
  getRoomsByGuestHouse,
  getBedsByRoom,
  createBooking,
  getAllBookings,
  getBookingsByUser,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from "../controller/bookingController.js";

const router = express.Router();

// Room/Bed fetching routes
router.get("/rooms", getRoomsByGuestHouse);
router.get("/beds", getBedsByRoom);

// Booking CRUD routes
router.post("/", createBooking);                     // <-- remove '/bookings'
router.get("/", getAllBookings);
router.get("/user/:userId", getBookingsByUser);
router.get("/:id", getBookingById);
router.put("/:id/status", updateBookingStatus);
router.delete("/:id", deleteBooking);

export default router;
