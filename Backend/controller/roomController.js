import Room from "../models/roomSchema.js";
import { logAction } from "../utils/auditLogger.js";
import { updateRoomAvailability, isRoomAvailable } from "../utils/availabilityHelper.js";

export const createRoom = async (req, res) => {
  try {
    const { guesthouseId, roomNumber } = req.body;

    if (!guesthouseId || roomNumber === undefined || roomNumber === null) {
      return res.status(400).json({
        message: "guesthouseId and roomNumber are required",
      });
    }

    // ❗ Prevent duplicate room number inside the same guest house
    const existingRoom = await Room.findOne({ guesthouseId, roomNumber });
    if (existingRoom) {
      return res.status(400).json({
        message: `Room number ${roomNumber} already exists for this guest house.`,
      });
    }

    const newRoom = new Room(req.body);
    const savedRoom = await newRoom.save();

    //  AUDIT LOG: ROOM CREATED
    await logAction(
      req.user?._id,                 // if login user exist
      "Created",
      "Room",
      savedRoom._id,
      `Room created with number ${savedRoom.roomNumber}`
    );

    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATED: Returns rooms with correct availability status (based on APPROVED bookings only)
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("guesthouseId", "guestHouseName location");
    
    // Update availability for each room based on current APPROVED bookings
    const roomsWithUpdatedAvailability = await Promise.all(
      rooms.map(async (room) => {
        await updateRoomAvailability(room._id);
        // Fetch updated room
        const updatedRoom = await Room.findById(room._id)
          .populate("guesthouseId", "guestHouseName location");
        return updatedRoom;
      })
    );

    res.status(200).json(roomsWithUpdatedAvailability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Rooms by Guesthouse
//  UPDATED: Returns rooms with correct availability status (supports checkIn/checkOut query params)
export const getRoomsByGuestHouse = async (req, res) => {
  try {
    const { guesthouseId, checkIn, checkOut } = req.query;
    if (!guesthouseId) return res.status(400).json({ message: "Guesthouse ID required" });

    const rooms = await Room.find({ guesthouseId })
      .populate("guesthouseId", "guestHouseName location");

    if (!rooms.length)
      return res.status(404).json({ message: "No rooms found for this guesthouse" });

    //  If checkIn and checkOut are provided, check availability for those dates
    // Otherwise, check current availability (today)
    if (checkIn && checkOut) {
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
      return res.status(200).json(roomsWithAvailability);
    } else {
      // Update availability for each room based on current date
      const roomsWithUpdatedAvailability = await Promise.all(
        rooms.map(async (room) => {
          await updateRoomAvailability(room._id);
          const updatedRoom = await Room.findById(room._id)
            .populate("guesthouseId", "guestHouseName location");
          return updatedRoom;
        })
      );
      return res.status(200).json(roomsWithUpdatedAvailability);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms by guesthouse", error: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate("guesthouseId", "guestHouseName location");

    if (!room) return res.status(404).json({ message: "Room not found" });

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const existing = await Room.findById(roomId);
    if (!existing) return res.status(404).json({ message: "Room not Found" });

    // Determine the target guesthouseId and roomNumber after update
    const targetGuesthouseId = req.body.guesthouseId || existing.guesthouseId;
    const targetRoomNumber =
      req.body.roomNumber !== undefined && req.body.roomNumber !== null
        ? req.body.roomNumber
        : existing.roomNumber;

    // ❗ Prevent changing to a duplicate room number within the same guest house
    const conflict = await Room.findOne({
      _id: { $ne: roomId },
      guesthouseId: targetGuesthouseId,
      roomNumber: targetRoomNumber,
    });

    if (conflict) {
      return res.status(400).json({
        message: `Room number ${targetRoomNumber} already exists for this guest house.`,
      });
    }

    const updateRoom = await Room.findByIdAndUpdate(roomId, req.body, {
      new: true,
      runValidators: true,
    });

    //  AUDIT LOG: ROOM UPDATED
    await logAction(
      req.user?._id,
      "Updated",
      "Room",
      updateRoom._id,
      `Room updated with number ${updateRoom.roomNumber}`
    );

    res.status(200).json(updateRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const deleteRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deleteRoom) return res.status(404).json({ message: "Room not Found" });

    //  AUDIT LOG: ROOM DELETED
    await logAction(
      req.user?._id,
      "Deleted",
      "Room",
      deleteRoom._id,
      `Room deleted with number ${deleteRoom.roomNumber}`
    );

    res.status(200).json({ message: "Room deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
