import express from "express";
import {createGuestHouse,getAllGuestHouses,getGuestHouseById,updateGuestHouse,deleteGuestHouse} from "../controller/GuestHouseController.js"


const router = express.Router();

router.post("/", createGuestHouse);

router.get("/", getAllGuestHouses);

router.get("/:id", getGuestHouseById);

router.put("/:id", updateGuestHouse);

router.delete("/:id", deleteGuestHouse);

export default router;
