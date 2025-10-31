import express from "express";
import { registerUser, loginUser, forgotPassword, resetPassword, } from "../controller/authController.js";

const router = express.Router();

//Correct route mappings

//register route
router.post("/register", registerUser);

//login route
router.post("/login", loginUser);

// Forgot Password (send reset link)
router.post("/forgot-password", forgotPassword);

// Reset Password (update password)
router.post("/reset-password", resetPassword);
export default router;
