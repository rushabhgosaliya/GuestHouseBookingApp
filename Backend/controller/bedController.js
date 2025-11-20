// import Bed from "../models/bedSchema.js"
// import Room from "../models/roomSchema.js";

// //create new bed

// export const  createBed = async (req,res)=>{
//     try{
//         const{roomId,bednumber,bedType,isAvailable}=req.body;
        
//         if(!roomId || !bednumber || !bedType){
//             return res.status(400).json({message:"All required fields must be field"});
//         }

//         //optional : check if room exists

//         const roomExists = await Room.findById(roomId);
//     if (!roomExists) {
//       return res.status(404).json({ message: "Room not found" });
//     }

//     const existingBed = await Bed.findOne({ roomId, bednumber });
//     if (existingBed) {
//       return res.status(400).json({ message: "Bed number already exists in this room" });
//     }

//     const newBed = new Bed({
//       roomId,
//       bednumber,
//       bedType,
//       isAvailable,
//     });

//     await newBed.save();
//     res.status(201).json({ message: "Bed created successfully", bed: newBed });
//   } catch (error) {
//     console.error("Error creating bed:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
// //get all Beds

// export const getAllBeds = async (req,res)=>{
//     try{
//         const beds = await Bed.find().populate("roomid","roomNumber roomType roomId");
//         res.status(200).json(beds);
//     }catch(error){
//         console.error("Error fetching Beds:",error);
//         res.status(500).json({message: "server error" , error:error.message})
//     }
// };


// //get beds by room id

// export const getBedsByRoom = async (req, res) => {
//   try {
//     const { roomId } = req.params;
//     const beds = await Bed.find({ roomId }).populate("roomId", "roomNumber roomType");
//     if (!beds || beds.length === 0) {
//       return res.status(404).json({ message: "No beds found for this room" });
//     }
//     res.status(200).json(beds);
//   } catch (error) {
//     console.error("Error fetching beds by room:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // ✅ Update bed
// export const updateBed = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedBed = await Bed.findByIdAndUpdate(id, req.body, { new: true });

//     if (!updatedBed) {
//       return res.status(404).json({ message: "Bed not found" });
//     }

//     res.status(200).json({ message: "Bed updated successfully", bed: updatedBed });
//   } catch (error) {
//     console.error("Error updating bed:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // ✅ Delete bed
// export const deleteBed = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedBed = await Bed.findByIdAndDelete(id);

//     if (!deletedBed) {
//       return res.status(404).json({ message: "Bed not found" });
//     }

//     res.status(200).json({ message: "Bed deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting bed:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

import Bed from "../models/bedSchema.js";

// ✅ Get all beds
export const getAllBeds = async (req, res) => {
  try {
    const beds = await Bed.find().populate({
      path: "roomId",
      select: "roomNumber roomType", // only fetch these fields
    });
    res.status(200).json(beds);
  } catch (error) {
    res.status(500).json({ message: "Error fetching beds", error });
  }
};

// ✅ Get beds by Room ID
export const getBedsByRoom = async (req, res) => {
  try {
    const { roomId } = req.query;
    if (!roomId) return res.status(400).json({ message: "Room ID required" });

    const beds = await Bed.find({ roomId }).populate("roomId", "roomNumber roomType");
    if (!beds.length) return res.status(404).json({ message: "No beds found for this room" });

    res.status(200).json(beds);
  } catch (error) {
    res.status(500).json({ message: "Error fetching beds by room", error: error.message });
  }
};


// ✅ Add new bed
export const addBed = async (req, res) => {
  try {
    const { roomId, bednumber, bedType, isAvailable } = req.body;
    const newBed = new Bed({ roomId, bednumber, bedType, isAvailable });
    await newBed.save();
    res.status(201).json({ message: "Bed added successfully", bed: newBed });
  } catch (error) {
    res.status(400).json({ message: "Error adding bed", error });
  }
};

// ✅ Update bed
export const updateBed = async (req, res) => {
  try {
    const updated = await Bed.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Bed updated successfully", bed: updated });
  } catch (error) {
    res.status(400).json({ message: "Error updating bed", error });
  }
};

// ✅ Delete bed
export const deleteBed = async (req, res) => {
  try {
    await Bed.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Bed deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting bed", error });
  }
};
