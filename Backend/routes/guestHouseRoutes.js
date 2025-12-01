import express from "express";
import {
  createGuestHouse,
  getAllGuestHouses,
  getGuestHouseById,
  updateGuestHouse,
  deleteGuestHouse,
} from "../controller/GuestHouseController.js";

import { upload } from "../middleware/upload.js";

const router = express.Router();

//  use upload middleware
router.post("/", upload.single("image"), createGuestHouse);
router.put("/:id", upload.single("image"), updateGuestHouse);

router.get("/", getAllGuestHouses);
router.get("/:id", getGuestHouseById);
router.delete("/:id", deleteGuestHouse);

export default router;
