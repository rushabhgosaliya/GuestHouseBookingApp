import express from "express";
import {getAllBeds,getBedsByRoom,addBed,updateBed,deleteBed,} from "../controller/bedController.js";

const router = express.Router();

router.get("/", getAllBeds);
router.get("/by-room", getBedsByRoom);
router.post("/", addBed);
router.put("/:id", updateBed);
router.delete("/:id", deleteBed);


export default router;
