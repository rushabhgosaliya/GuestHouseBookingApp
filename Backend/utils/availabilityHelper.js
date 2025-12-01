/**
 * Availability Helper Utilities
 * 
 * These functions check room/bed availability dynamically based on APPROVED bookings only.
 * Pending and Rejected bookings do NOT block availability.
 */

import Booking from "../models/bookingSchema.js";
import Room from "../models/roomSchema.js";
import Bed from "../models/bedSchema.js";

/**
 * Check if a room is available for a given date range
 * 
 * IMPORTANT CHANGE:
 * - A room is now considered **unavailable ONLY when all its beds are booked**
 *   for the given date range.
 * - If at least one bed is free, the room is treated as available.
 *
 * This allows the UI to show that a **particular bed is unavailable**
 * instead of marking the whole room as "(unavailable)" when other beds
 * are still free.
 *
 * @param {String|ObjectId} roomId - Room ID
 * @param {Date} checkIn - Check-in date
 * @param {Date} checkOut - Check-out date
 * @param {String|ObjectId} excludeBookingId - Optional: exclude this booking ID (useful when updating existing booking)
 * @returns {Boolean} - true if available, false if fully booked
 */
export const isRoomAvailable = async (roomId, checkIn, checkOut, excludeBookingId = null) => {
  try {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // How many beds does this room have in total?
    const totalBeds = await Bed.countDocuments({ roomId });

    // If no beds are defined for this room, be safe and treat it as unavailable
    if (!totalBeds || totalBeds <= 0) {
      return false;
    }

    // Find APPROVED bookings for this room that overlap with the requested dates
    const query = {
      roomId,
      status: "Approved", // ⭐ Only APPROVED bookings block availability
      checkIn: { $lt: end }, // Booking starts before requested checkout
      checkOut: { $gt: start }, // Booking ends after requested checkin
    };

    // Exclude a specific booking (useful when updating an existing booking)
    if (excludeBookingId) {
      query._id = { $ne: excludeBookingId };
    }

    const overlappingBookingsCount = await Booking.countDocuments(query);

    // Room is available as long as **not all** beds are taken
    return overlappingBookingsCount < totalBeds;
  } catch (error) {
    console.error("Error checking room availability:", error);
    return false; // On error, assume not available for safety
  }
};

/**
 * Check if a bed is available for a given date range
 * @param {String|ObjectId} bedId - Bed ID
 * @param {Date} checkIn - Check-in date
 * @param {Date} checkOut - Check-out date
 * @param {String|ObjectId} excludeBookingId - Optional: exclude this booking ID
 * @returns {Boolean} - true if available, false if booked
 */
export const isBedAvailable = async (bedId, checkIn, checkOut, excludeBookingId = null) => {
  try {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // Build query: find APPROVED bookings that overlap with the requested dates
    const query = {
      bedId,
      status: "Approved", // ⭐ Only APPROVED bookings block availability
      checkIn: { $lt: end },
      checkOut: { $gt: start },
    };

    if (excludeBookingId) {
      query._id = { $ne: excludeBookingId };
    }

    const conflictingBooking = await Booking.findOne(query);
    
    return !conflictingBooking;
  } catch (error) {
    console.error("Error checking bed availability:", error);
    return false;
  }
};

/**
 * Check if a room is currently fully booked (all beds taken) for today.
 * A room is considered "booked" only when **every bed** has an active
 * APPROVED booking that includes today.
 *
 * @param {String|ObjectId} roomId - Room ID
 * @returns {Boolean} - true if fully booked, false if at least one bed is free
 */
export const isRoomCurrentlyBooked = async (roomId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total beds in this room
    const totalBeds = await Bed.countDocuments({ roomId });
    if (!totalBeds || totalBeds <= 0) {
      // If room has no beds configured, treat as not booked (or you could return true)
      return false;
    }

    // Count active APPROVED bookings for this room that include today
    const activeBookingsCount = await Booking.countDocuments({
      roomId,
      status: "Approved",
      checkIn: { $lte: today }, // Check-in is today or in the past
      checkOut: { $gt: today }, // Check-out is in the future
    });

    // Room is "booked" only if all beds are taken
    return activeBookingsCount >= totalBeds;
  } catch (error) {
    console.error("Error checking if room is currently booked:", error);
    return false;
  }
};

/**
 * Check if a bed is currently booked (has an active APPROVED booking that includes today)
 * @param {String|ObjectId} bedId - Bed ID
 * @returns {Boolean} - true if currently booked, false if available
 */
export const isBedCurrentlyBooked = async (bedId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeBooking = await Booking.findOne({
      bedId,
      status: "Approved",
      checkIn: { $lte: today },
      checkOut: { $gt: today },
    });

    return !!activeBooking;
  } catch (error) {
    console.error("Error checking if bed is currently booked:", error);
    return false;
  }
};

/**
 * Update room availability status based on current APPROVED bookings
 * This function checks if the room has any active APPROVED bookings and updates isBooked/isAvailable accordingly
 * @param {String|ObjectId} roomId - Room ID
 */
export const updateRoomAvailability = async (roomId) => {
  try {
    const isBooked = await isRoomCurrentlyBooked(roomId);
    
    await Room.findByIdAndUpdate(roomId, {
      isBooked,
      isAvailable: !isBooked,
    });

    return { isBooked, isAvailable: !isBooked };
  } catch (error) {
    console.error("Error updating room availability:", error);
  }
};

/**
 * Update bed availability status based on current APPROVED bookings
 * @param {String|ObjectId} bedId - Bed ID
 */
export const updateBedAvailability = async (bedId) => {
  try {
    const isBooked = await isBedCurrentlyBooked(bedId);
    
    await Bed.findByIdAndUpdate(bedId, {
      isBooked,
      isAvailable: !isBooked,
    });

    return { isBooked, isAvailable: !isBooked };
  } catch (error) {
    console.error("Error updating bed availability:", error);
  }
};

/**
 * Check and update availability for all rooms/beds that have past bookings
 * This should be called periodically (e.g., via cron job) or after status updates
 * @param {String|ObjectId} roomId - Optional: update specific room only
 * @param {String|ObjectId} bedId - Optional: update specific bed only
 */
export const updateAvailabilityForPastBookings = async (roomId = null, bedId = null) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all APPROVED bookings that have passed checkout date
    const query = {
      status: "Approved",
      checkOut: { $lt: today }, // Checkout date is in the past
    };

    if (roomId) {
      query.roomId = roomId;
    }
    if (bedId) {
      query.bedId = bedId;
    }

    const pastBookings = await Booking.find(query);

    // Update availability for rooms and beds from past bookings
    const roomIds = new Set();
    const bedIds = new Set();

    pastBookings.forEach((booking) => {
      if (booking.roomId) roomIds.add(booking.roomId.toString());
      if (booking.bedId) bedIds.add(booking.bedId.toString());
    });

    // Update all affected rooms
    for (const rid of roomIds) {
      await updateRoomAvailability(rid);
    }

    // Update all affected beds
    for (const bid of bedIds) {
      await updateBedAvailability(bid);
    }

    return { roomsUpdated: roomIds.size, bedsUpdated: bedIds.size };
  } catch (error) {
    console.error("Error updating availability for past bookings:", error);
  }
};

