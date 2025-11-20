import express from "express";
import {
  createAuditLog,
  getAllAuditLogs,
  getAuditLogById,
  deleteAuditLog,
} from "../controller/auditLogController.js";

const router = express.Router();

router.post("/", createAuditLog); // ➕ Create
router.get("/", getAllAuditLogs); // 📜 Read all
router.get("/:id", getAuditLogById); // 🔍 Read single
router.delete("/:id", deleteAuditLog); // 🗑️ Delete

export default router;
