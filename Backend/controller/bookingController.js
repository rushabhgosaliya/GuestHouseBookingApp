import Room from "../models/roomSchema.js";
import Bed from "../models/bedSchema.js";
import Booking from "../models/bookingSchema.js";
import mongoose from "mongoose";
// import { v4 as uuidv4 } from "uuid";

// 🟢 Fetch all rooms for a guest house
export const getRoomsByGuestHouse = async (req, res) => {
  try {
    const rooms = await Room.find({ guesthouseId: req.query.guesthouseId });
    res.json(rooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ message: "Error fetching rooms" });
  }
};

// 🟢 Fetch all beds for a room
export const getBedsByRoom = async (req, res) => {
  try {
    const beds = await Bed.find({ roomId: req.query.roomId });
    res.json(beds);
  } catch (err) {
    console.error("Error fetching beds:", err);
    res.status(500).json({ message: "Error fetching beds" });
  }
};

// 🟢 Create new booking
export const createBooking = async (req, res) => {
  try {
    const { userId, guesthouseId, roomId, bedId, checkIn, checkOut } = req.body;

    if (!userId || !guesthouseId || !roomId || !bedId || !checkIn || !checkOut) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new booking entry
    const newBooking = new Booking({

      userId,
      guesthouseId,
      roomId,
      bedId,
      checkIn,
      checkOut,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking successful ✅", booking: newBooking });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Error creating booking" });
  }
};

// 🟡 Get all bookings (admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "firstName lastName email")
      .populate("guesthouseId", "guestHouseName")
      .populate("roomId", "roomNumber")
      .populate("bedId", "bednumber")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching all bookings:", err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

// 🟠 Get all bookings for a specific user
export const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const bookings = await Booking.find({ userId })
      .populate("guesthouseId", "guestHouseName")
      .populate("roomId", "roomNumber")
      .populate("bedId", "bednumber")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ message: "Error fetching user bookings" });
  }
};

// 🔵 Get a single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(id)
      .populate("userId", "firstName lastName email")
      .populate("guesthouseId", "guestHouseName")
      .populate("roomId", "roomNumber")
      .populate("bedId", "bednumber");

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (err) {
    console.error("Error fetching booking by ID:", err);
    res.status(500).json({ message: "Error fetching booking" });
  }
};

// 🟣 Update booking status (Approve / Cancel)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Approved", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedBooking)
      return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({
      message: "Booking status updated successfully ✅",
      booking: updatedBooking,
    });
  } catch (err) {
    console.error("Error updating booking status:", err);
    res.status(500).json({ message: "Error updating booking status" });
  }
};

// 🔴 Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking)
      return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking deleted successfully ✅" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ message: "Error deleting booking" });
  }
};
