// routes/adminRoutes.js
import express from "express";
import { getTotalUsers } from "../controller/adminController.js";

const router = express.Router();

// ✅ Route to get total user count
router.get("/total-users", getTotalUsers);

export default router;
