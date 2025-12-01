import mongoose from "mongoose";
import AuditLog from "../models/auditlogSchema.js";

/**
 * Logs CRUD actions for any entity safely.
 * Never throws — logs errors to console and returns.
 *
 * @param {String|ObjectId|null} userId
 * @param {String} action - "Created"|"Updated"|"Deleted"
 * @param {String} entityType - e.g. "GuestHouse"
 * @param {String|ObjectId|null} entityId - the affected document _id
 * @param {String} details - optional details
 */
export const logAction = async (userId, action, entityType, entityId, details = "") => {
  try {
    const dummyId = "000000000000000000000000"; 

    const finalUserId =
      userId && mongoose.Types.ObjectId.isValid(String(userId)) ? String(userId) : dummyId;

    const finalEntityId =
      entityId && mongoose.Types.ObjectId.isValid(String(entityId)) ? String(entityId) : dummyId;

    await AuditLog.create({
      userId: finalUserId,
      action,
      entityType,
      entityId: finalEntityId,
      details,
    });
  } catch (err) {
    console.error("Error saving audit log:", err?.message || err);
  }
};