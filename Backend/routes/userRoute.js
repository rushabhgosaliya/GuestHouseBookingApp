import express from "express";
import {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  activateUser,
  changePassword
} from "../controller/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", addUser);
router.put("/:id", updateUser);

// Soft delete (deactivate)
router.delete("/:id", deleteUser);

// Activate user
router.put("/activate/:id", activateUser);

//  NEW → Change Password Route
router.put("/change-password/:id", changePassword);

export default router;
