// import Room from "../models/roomSchema.js";

// export const createRoom = async (req,res)=>{
//     try{
//         const newRoom = new Room(req.body);
//         const savedRoom = await newRoom.save();
//         res.status(201).json(savedRoom);
//     }catch (error){
//         res.status(400).json({message:error.message});
//     }
// };

// export const getAllRooms = async (req,res)=>{
//     try{
//         const rooms = await Room.find().populate("guesthouseId","guestHouseName location");
//         res.status(200).json(rooms);
//     }catch(error){
//         res.status(500).json({message:error.message});
//     }
// };

// // ✅ Get rooms by Guest House ID
// export const getRoomsByGuestHouse = async (req, res) => {
//   try {
//     const { guesthouseId } = req.query;
//     if (!guesthouseId) return res.status(400).json({ message: "Guesthouse ID required" });

//     const rooms = await Room.find({ guesthouseId }).populate("guesthouseId", "guestHouseName location");
//     if (!rooms.length) return res.status(404).json({ message: "No rooms found for this guesthouse" });

//     res.status(200).json(rooms);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching rooms by guesthouse", error: error.message });
//   }
// };


// export const getRoomById = async (req, res) => {
//   try {
//     const room = await Room.findById(req.params.id).populate("guesthouseId", "guestHouseName location");
//     if (!room) return res.status(404).json({ message: "Room not found" });
//     res.status(200).json(room);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const updateRoom = async (req,res)=>{
//     try{
//         const updateRoom = await Room.findByIdAndUpdate(req.params.id,req.body,{
//             new:true,
//             runValidators:true,
//         });
//         if(!updateRoom) return res.status(404).json({message:"Room not Found"});
//         res.status(200).json(updateRoom);
//     }catch(error){
//         res.status(400).json({message:error.message})
//     }
// };

// export const deleteRoom = async(req,res)=>{
//     try{
//         const deleteRoom= await Room.findByIdAndDelete(req.params.id);
//         if(!deleteRoom)return res.status(404).json({message:"Room not Found"});
//         res.status(200).json({message:"Room deleted Successfully"});
//     }catch(error){
//         res.status(500).json({message:error.message});
//     }
// };

import Room from "../models/roomSchema.js";
import { logAction } from "../utils/auditLogger.js";   // ✅ ADD THIS

export const createRoom = async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    const savedRoom = await newRoom.save();

    // ✅ AUDIT LOG: ROOM CREATED
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

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("guesthouseId", "guestHouseName location");
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Rooms by Guesthouse
export const getRoomsByGuestHouse = async (req, res) => {
  try {
    const { guesthouseId } = req.query;
    if (!guesthouseId) return res.status(400).json({ message: "Guesthouse ID required" });

    const rooms = await Room.find({ guesthouseId })
      .populate("guesthouseId", "guestHouseName location");

    if (!rooms.length)
      return res.status(404).json({ message: "No rooms found for this guesthouse" });

    res.status(200).json(rooms);
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
    const updateRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updateRoom) return res.status(404).json({ message: "Room not Found" });

    // ✅ AUDIT LOG: ROOM UPDATED
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

    // ✅ AUDIT LOG: ROOM DELETED
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
