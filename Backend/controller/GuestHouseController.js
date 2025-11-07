import GuestHouse from "../models/guestHouseSchema.js";

// 🟢 Create a new Guest House
export const createGuestHouse = async (req, res) => {
  try {
    const { guestHouseName, location, description, image_url, underMaintenance } = req.body;

    if (!guestHouseName || !image_url) {
      return res.status(400).json({ message: "Guest house name and image are required." });
    }

    const newGuestHouse = new GuestHouse({
      guestHouseName,
      location,
      description,
      image_url,
      underMaintenance,
    });

    const savedGuestHouse = await newGuestHouse.save();
    res.status(201).json({
      message: "Guest house created successfully",
      guesthouse: savedGuestHouse,
    });
  } catch (error) {
    console.error("Error creating guest house:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟡 Get all Guest Houses
export const getAllGuestHouses = async (req, res) => {
  try {
    const guesthouses = await GuestHouse.find();
    res.status(200).json(guesthouses);
  } catch (error) {
    console.error("Error fetching guest houses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟠 Get Guest House by ID
export const getGuestHouseById = async (req, res) => {
  try {
    const guesthouse = await GuestHouse.findById(req.params.id);
    if (!guesthouse) {
      return res.status(404).json({ message: "Guest house not found" });
    }
    res.status(200).json(guesthouse);
  } catch (error) {
    console.error("Error fetching guest house:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔵 Update Guest House
export const updateGuestHouse = async (req, res) => {
  try {
    const updated = await GuestHouse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Guest house not found" });
    }

    res.status(200).json({
      message: "Guest house updated successfully",
      guesthouse: updated,
    });
  } catch (error) {
    console.error("Error updating guest house:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔴 Delete Guest House
export const deleteGuestHouse = async (req, res) => {
  try {
    const deleted = await GuestHouse.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Guest house not found" });
    }

    res.status(200).json({ message: "Guest house deleted successfully" });
  } catch (error) {
    console.error("Error deleting guest house:", error);
    res.status(500).json({ message: "Server error" });
  }
};
