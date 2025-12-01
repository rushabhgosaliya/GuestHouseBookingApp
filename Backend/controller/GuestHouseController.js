import GuestHouse from "../models/guesthouseSchema.js";
import { logAction } from "../utils/auditLogger.js";

//  Create a new Guest House

export const createGuestHouse = async (req, res) => {
  try {
    const { guestHouseName, description, image_url, underMaintenance, userId } = req.body;

    //  FIX: Parse location string
    let parsedLocation = {};
    if (req.body.location) {
      try {
        parsedLocation = JSON.parse(req.body.location);
      } catch (err) {
        parsedLocation = {};
      }
    }

    // Image logic
    let finalImageUrl = image_url;
    if (req.file) {
      finalImageUrl = `/uploads/guesthouseimages/${req.file.filename}`;
    }

    if (!guestHouseName || !finalImageUrl) {
      return res.status(400).json({ message: "Guest house name and image are required." });
    }

    const newGuestHouse = new GuestHouse({
      guestHouseName,
      location: parsedLocation,  
      description,
      image_url: finalImageUrl,
      underMaintenance,
    });

    const saved = await newGuestHouse.save();

    res.status(201).json({
      message: "Guest house created successfully",
      guesthouse: saved,
    });
  } catch (error) {
    console.error("Error creating guest house:", error);
    res.status(500).json({ message: "Server error" });
  }
};



//  Get all Guest Houses
export const getAllGuestHouses = async (req, res) => {
  try {
    const guesthouses = await GuestHouse.find();
    res.status(200).json(guesthouses);
  } catch (error) {
    console.error("Error fetching guest houses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  Get Guest House by ID
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

//  Update Guest House
export const updateGuestHouse = async (req, res) => {
  try {
    const userId =
      req.user?._id || req.body?.userId || req.query?.userId || null;

    let updatedData = req.body;
    
    //  FIX: Parse location if it was sent as JSON string
    if (req.body.location) {
      try {
        updatedData.location = JSON.parse(req.body.location);
      } catch (err) {
        updatedData.location = {};
      }
    }

    if (req.file) {
      updatedData.image_url = `/uploads/guesthouseimages/${req.file.filename}`;
    }

    const updated = await GuestHouse.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Guest house not found" });
    }

    await logAction(
      userId,
      "Updated",
      "GuestHouse",
      updated._id,
      `Updated guest house: ${updated.guestHouseName}`
    );

    res.status(200).json({
      message: "Guest house updated successfully",
      guesthouse: updated,
    });
  } catch (error) {
    console.error("Error updating guest house:", error);
    res.status(500).json({ message: "Server error" });
  }
};



//  Delete Guest House
export const deleteGuestHouse = async (req, res) => {
  try {
    const userId = req.user?._id || req.body?.userId || req.query?.userId || null;

    const deleted = await GuestHouse.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Guest house not found" });
    }

    //  Log deletion
    await logAction(
      userId,
      "Deleted",
      "GuestHouse",
      deleted._id,
      `Deleted guest house: ${deleted.guestHouseName}`
    );

    res.status(200).json({ message: "Guest house deleted successfully" });
  } catch (error) {
    console.error("Error deleting guest house:", error);
    res.status(500).json({ message: "Server error" });
  }
};
