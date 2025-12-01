import express from "express";
import {
  createAuditLog,
  getAllAuditLogs,
  getAuditLogById,
  deleteAuditLog,
} from "../controller/auditLogController.js";

const router = express.Router();

router.post("/", createAuditLog); 
router.get("/", getAllAuditLogs); 
router.get("/:id", getAuditLogById); 
router.delete("/:id", deleteAuditLog);

export default router;
