// // routes/adminRoutes.js
// import express from "express";
// import { getTotalUsers , getTotalBookings } from "../controller/adminController.js";

// const router = express.Router();

// // ✅ Route to get total user count
// router.get("/total-users", getTotalUsers);
// router.get("/total-bookings", getTotalBookings);

// export default router;
import express from "express";
import Booking from "../models/bookingSchema.js";
import User from "../models/userSchema.js";
import GuestHouse from "../models/guesthouseSchema.js";
import Bed from "../models/bedSchema.js"; // ⭐ NEW IMPORT

const router = express.Router();

/* ------------------ TOTAL USERS ------------------ */
router.get("/total-users", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (err) {
    res.status(500).json({ message: "Error fetching total users" });
  }
});

/* ------------------ TOTAL BOOKINGS ------------------ */
router.get("/total-bookings", async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    res.json({ totalBookings });
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

/* ------------------ APPROVED BOOKINGS ------------------ */
router.get("/total-approved", async (req, res) => {
  try {
    const approved = await Booking.countDocuments({ status: "Approved" });
    res.json({ totalApproved: approved });
  } catch (err) {
    res.status(500).json({ message: "Error fetching approved bookings" });
  }
});

/* ------------------ PENDING BOOKINGS ------------------ */
router.get("/total-pending", async (req, res) => {
  try {
    const pending = await Booking.countDocuments({ status: "Pending" });
    res.json({ totalPending: pending });
  } catch (err) {
    res.status(500).json({ message: "Error fetching pending bookings" });
  }
});

/* ------------------ REJECTED BOOKINGS ------------------ */
router.get("/total-rejected", async (req, res) => {
  try {
    const rejected = await Booking.countDocuments({
      $or: [{ status: "Rejected" }, { status: "Cancelled" }],
    });
    res.json({ totalRejected: rejected });
  } catch (err) {
    res.status(500).json({ message: "Error fetching rejected bookings" });
  }
});

/* ------------------ TOTAL GUEST HOUSES ------------------ */
router.get("/total-guesthouses", async (req, res) => {
  try {
    const total = await GuestHouse.countDocuments();
    res.json({ totalGuestHouses: total });
  } catch (err) {
    res.status(500).json({ message: "Error fetching guesthouse count" });
  }
});

/* ------------------ TODAY'S BOOKINGS ------------------ */
router.get("/total-todays-bookings", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysBookings = await Booking.countDocuments({
      checkIn: { $gte: today, $lt: tomorrow },
    });

    res.json({ todaysBookings });
  } catch (err) {
    res.status(500).json({ message: "Error fetching today's bookings" });
  }
});

/* ------------------ ⭐ NEW: OCCUPANCY RATE ------------------ */
/* ------------------ ⭐ NEW SIMPLE OCCUPANCY RATE ------------------ */
router.get("/occupancy-rate", async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const approvedBookings = await Booking.countDocuments({ status: "Approved" });

    const occupancyRate =
      totalBookings === 0
        ? 0
        : Math.round((approvedBookings / totalBookings) * 100);

    res.json({ occupancyRate });
  } catch (err) {
    console.error("Error fetching occupancy rate:", err);
    res.status(500).json({ message: "Error fetching occupancy rate" });
  }
});


export default router;


