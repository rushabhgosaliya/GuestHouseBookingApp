import Bed from "../models/bedSchema.js";
import { logAction } from "../utils/auditLogger.js";
import { updateBedAvailability, isBedAvailable } from "../utils/availabilityHelper.js";

// Get all beds (with updated availability)
export const getAllBeds = async (req, res) => {
  try {
    const beds = await Bed.find().populate({
      path: "roomId",
      select: "roomNumber roomType",
    });

    // Update availability for each bed
    const bedsWithUpdatedAvailability = await Promise.all(
      beds.map(async (bed) => {
        await updateBedAvailability(bed._id);
        const updatedBed = await Bed.findById(bed._id).populate({
          path: "roomId",
          select: "roomNumber roomType",
        });
        return updatedBed;
      })
    );

    res.status(200).json(bedsWithUpdatedAvailability);
  } catch (error) {
    res.status(500).json({ message: "Error fetching beds", error });
  }
};

//  Get beds by Room ID (with updated availability, supports checkIn/checkOut query params)
export const getBedsByRoom = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.query;
    if (!roomId) return res.status(400).json({ message: "Room ID required" });

    const beds = await Bed.find({ roomId }).populate("roomId", "roomNumber roomType");
    if (!beds.length) return res.status(404).json({ message: "No beds found for this room" });

    //  If checkIn and checkOut are provided, check availability for those dates
    // Otherwise, check current availability (today)
    if (checkIn && checkOut) {
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
      return res.status(200).json(bedsWithAvailability);
    } else {
      // Update availability for each bed based on current date
      const bedsWithUpdatedAvailability = await Promise.all(
        beds.map(async (bed) => {
          await updateBedAvailability(bed._id);
          const updatedBed = await Bed.findById(bed._id).populate("roomId", "roomNumber roomType");
          return updatedBed;
        })
      );
      return res.status(200).json(bedsWithUpdatedAvailability);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching beds by room", error: error.message });
  }
};

//  Add new bed
export const addBed = async (req, res) => {
  try {
    const { roomId, bednumber, bedType, isAvailable } = req.body;

    const newBed = new Bed({
      roomId,
      bednumber,
      bedType: bedType || "single",  //  DEFAULT SINGLE
      isAvailable,
    });

    await newBed.save();

    //  NEW: Populate room to get roomNumber
    const populatedBed = await Bed.findById(newBed._id).populate(
      "roomId",
      "roomNumber"
    );

    await logAction(
      req.user?._id,
      "Created",
      "Bed",
      newBed._id,
      `Bed number ${populatedBed.bednumber} added to room ${populatedBed.roomId?.roomNumber}`
    );

    res.status(201).json({ message: "Bed added successfully", bed: populatedBed });
  } catch (error) {
    res.status(400).json({ message: "Error adding bed", error });
  }
};



//  Update bed
export const updateBed = async (req, res) => {
  try {
    const updated = await Bed.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    //  AUDIT LOG — BED UPDATED
    await logAction(
      req.user?._id,
      "Updated",
      "Bed",
      updated?._id,
      `Bed number ${updated?.bednumber} updated`
    );

    res.status(200).json({ message: "Bed updated successfully", bed: updated });
  } catch (error) {
    res.status(400).json({ message: "Error updating bed", error });
  }
};

//  Delete bed
export const deleteBed = async (req, res) => {
  try {
    const deletedBed = await Bed.findByIdAndDelete(req.params.id);

    //  AUDIT LOG — BED DELETED
    await logAction(
      req.user?._id,
      "Deleted",
      "Bed",
      deletedBed?._id,
      `Bed number ${deletedBed?.bednumber} deleted`
    );

    res.status(200).json({ message: "Bed deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting bed", error });
  }
};
