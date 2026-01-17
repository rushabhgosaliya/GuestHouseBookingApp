import User from "../models/userSchema.js";
import Booking from "../models/bookingSchema.js"; 

// Controller to get total users Count
export const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error("Error fetching total users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// NEW: Get Total Bookings
export const getTotalBookings = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    res.status(200).json({ totalBookings });
  } catch (error) {
    console.error("Error fetching total bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};
