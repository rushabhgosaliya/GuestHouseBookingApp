import Room from "../models/roomSchema.js";
import Bed from "../models/bedSchema.js";
import Booking from "../models/bookingSchema.js";
import mongoose from "mongoose";
import { sendNewBookingEmails, sendBookingStatusEmail } from "../utils/sendMail.js";
import { logAction } from "../utils/auditLogger.js";
import {
  isRoomAvailable,
  isBedAvailable,
  updateRoomAvailability,
  updateBedAvailability,
  updateAvailabilityForPastBookings,
} from "../utils/availabilityHelper.js";

//  Fetch all rooms for a guest house (with dynamic availability)
export const getRoomsByGuestHouse = async (req, res) => {
  try {
    const { guesthouseId, checkIn, checkOut } = req.query;
    
    // Fetch rooms
    const rooms = await Room.find({ guesthouseId });

    // If checkIn and checkOut are provided, check availability for those dates
    // Otherwise, check current availability (today)
    if (checkIn && checkOut) {
      // Check availability for specific date range
      const roomsWithAvailability = await Promise.all(
        rooms.map(async (room) => {
          const available = await isRoomAvailable(room._id, checkIn, checkOut);
          return {
            ...room.toObject(),
            isAvailable: available,
            isBooked: !available,
          };
        })
      );
      return res.json(roomsWithAvailability);
    } else {
      // Check current availability (for admin panel or general listing)
      const roomsWithAvailability = await Promise.all(
        rooms.map(async (room) => {
          // First update the room's availability status
          await updateRoomAvailability(room._id);
          // Then fetch the updated room
          const updatedRoom = await Room.findById(room._id);
          return updatedRoom;
        })
      );
      return res.json(roomsWithAvailability);
    }
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ message: "Error fetching rooms" });
  }
};

//  Fetch all beds for a room (with dynamic availability)
export const getBedsByRoom = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.query;
    
    // Fetch beds
    const beds = await Bed.find({ roomId });

    // If checkIn and checkOut are provided, check availability for those dates
    // Otherwise, check current availability
    if (checkIn && checkOut) {
      // Check availability for specific date range
      const bedsWithAvailability = await Promise.all(
        beds.map(async (bed) => {
          const available = await isBedAvailable(bed._id, checkIn, checkOut);
          return {
            ...bed.toObject(),
            isAvailable: available,
            isBooked: !available,
          };
        })
      );
      return res.json(bedsWithAvailability);
    } else {
      // Check current availability
      const bedsWithAvailability = await Promise.all(
        beds.map(async (bed) => {
          // First update the bed's availability status
          await updateBedAvailability(bed._id);
          // Then fetch the updated bed
          const updatedBed = await Bed.findById(bed._id);
          return updatedBed;
        })
      );
      return res.json(bedsWithAvailability);
    }
  } catch (err) {
    console.error("Error fetching beds:", err);
    res.status(500).json({ message: "Error fetching beds" });
  }
};

// Create new booking (with proper availability checking)
export const createBooking = async (req, res) => {
  try {
    const { roomId, bedId, checkIn, checkOut, userId, guesthouseId } = req.body;

    // Validate required fields
    if (!roomId || !bedId || !checkIn || !checkOut || !userId || !guesthouseId) {
      return res.status(400).json({
        message: "All fields are required: roomId, bedId, checkIn, checkOut, userId, guesthouseId"
      });
    }

    // Convert to Date objects
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // Validate dates
    if (start >= end) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date"
      });
    }

    //  CHECK IF ROOM IS AVAILABLE (only APPROVED bookings block availability)
    const roomAvailable = await isRoomAvailable(roomId, checkIn, checkOut);
    if (!roomAvailable) {
      return res.status(400).json({
        message: "Room is already booked for these dates."
      });
    }

    //  CHECK IF BED IS AVAILABLE (only APPROVED bookings block availability)
    const bedAvailable = await isBedAvailable(bedId, checkIn, checkOut);
    if (!bedAvailable) {
      return res.status(400).json({
        message: "Bed is already booked for these dates."
      });
    }

    //  NO CONFLICT → CREATE BOOKING (status will be "Pending" by default)
    const booking = await Booking.create(req.body);

    //   Note: We do NOT update room/bed isBooked flags here because:
    // - Booking is created with status "Pending"
    // - Only "Approved" bookings should block availability
    // - Room/bed availability will be updated when admin approves the booking

    res.status(201).json({
      message: "Booking created successfully",
      bookingId: booking._id
    });

    //  Background tasks (emails and audit log)
    setImmediate(async () => {
      try {
        const populated = await Booking.findById(booking._id)
          .populate("userId", "firstName lastName email")
          .populate("guesthouseId", "guestHouseName");

        await sendNewBookingEmails(populated);

        await logAction(
          req.user?._id,
          "Created",
          "Booking",
          booking._id,
          `Booking created for guesthouse: ${populated?.guesthouseId?.guestHouseName}`
        );
      } catch (err) {
        console.error("Background booking tasks error:", err);
      }
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error while creating booking" });
  }
};


//  Get all bookings (admin)
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

//  Get all bookings for a specific user
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

//  Get a single booking by ID
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

//  Update booking status (Approve / Reject / Cancel)
//  CRITICAL: This function updates room/bed availability based on booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Pending", "Approved", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be: Pending, Approved, or Cancelled" });
    }

    // Get the booking before update to check previous status
    const oldBooking = await Booking.findById(id);
    if (!oldBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update booking status
    const updated = await Booking.findByIdAndUpdate(id, { status }, { new: true })
      .populate("userId", "firstName lastName email")
      .populate("guesthouseId", "guestHouseName");

    //  UPDATE ROOM/BED AVAILABILITY BASED ON STATUS CHANGE
    if (status === "Approved") {
      // When booking is approved, mark room and bed as booked (if dates are current/future)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkIn = new Date(updated.checkIn);
      const checkOut = new Date(updated.checkOut);

      // Only mark as booked if checkout is in the future
      if (checkOut > today) {
        await Room.findByIdAndUpdate(updated.roomId, {
          isBooked: true,
          isAvailable: false,
        });
        await Bed.findByIdAndUpdate(updated.bedId, {
          isBooked: true,
          isAvailable: false,
        });
      }
    } else if (status === "Cancelled") {
      // When booking is cancelled, update availability dynamically
      // This will check if there are other APPROVED bookings for the same room/bed
      // If no other APPROVED bookings exist, room/bed becomes available
      await updateRoomAvailability(updated.roomId);
      await updateBedAvailability(updated.bedId);
    } else if (status === "Pending") {
      // If status changes back to Pending, update availability (room/bed should be available)
      await updateRoomAvailability(updated.roomId);
      await updateBedAvailability(updated.bedId);
    }

    // Also update availability for past bookings (in case checkout date has passed)
    await updateAvailabilityForPastBookings(updated.roomId, updated.bedId);

    // Send email notification
    await sendBookingStatusEmail(updated);

    // Audit log
    await logAction(
      req.user?._id,
      "Updated",
      "Booking",
      updated._id,
      `Booking status changed from ${oldBooking.status} to ${status}`
    );

    res.status(200).json({ 
      message: "Booking status updated successfully", 
      booking: updated 
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Error updating booking status" });
  }
};

//  Delete booking
//  UPDATED: Uses dynamic availability checking instead of hardcoded flags
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // UPDATE ROOM & BED AVAILABILITY DYNAMICALLY
    // This checks if there are other APPROVED bookings for the same room/bed
    // If the deleted booking was the only one blocking availability, room/bed becomes available
    await updateRoomAvailability(deletedBooking.roomId);
    await updateBedAvailability(deletedBooking.bedId);

    // Also update availability for past bookings
    await updateAvailabilityForPastBookings(deletedBooking.roomId, deletedBooking.bedId);

    await logAction(
      req.user?._id,
      "Deleted",
      "Booking",
      deletedBooking._id,
      `Booking deleted for user ${deletedBooking.userId}`
    );

    res.status(200).json({ message: "Booking deleted successfully ✅" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ message: "Error deleting booking" });
  }
};

//  Update availability for all past bookings (auto-availability after checkout)
// This can be called manually or via cron job to ensure rooms/beds become available after checkout
export const updatePastBookingsAvailability = async (req, res) => {
  try {
    const result = await updateAvailabilityForPastBookings();
    
    res.status(200).json({
      message: "Availability updated for past bookings",
      roomsUpdated: result?.roomsUpdated || 0,
      bedsUpdated: result?.bedsUpdated || 0,
    });
  } catch (error) {
    console.error("Error updating past bookings availability:", error);
    res.status(500).json({ message: "Error updating availability" });
  }
};
