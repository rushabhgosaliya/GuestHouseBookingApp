import express from "express";
import {createRoom,getAllRooms,getRoomsByGuestHouse,getRoomById,updateRoom,deleteRoom} from "../controller/roomController.js"

const router = express.Router();

router.post("/", createRoom);
router.get("/", getAllRooms);
router.get("/by-guesthouse", getRoomsByGuestHouse);
router.get("/:id", getRoomById);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);



export default router;