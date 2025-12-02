import AuditLog from "../models/auditlogSchema.js";

// Create new audit log
export const createAuditLog = async (req, res) => {
  try {
    const { userId, action, details, entityType } = req.body;

    const auditLog = new AuditLog({
      userId,
      action,
      details,
      entityType,
    });

    const savedLog = await auditLog.save();
    res.status(201).json({
      message: "Audit log created successfully",
      data: savedLog,
    });
  } catch (error) {
    res.status(500).json({ message: " Failed to create audit log", error: error.message });
  }
};

// Get all audit logs
export const getAllAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate("userId", "name email").sort({createdAt:-1});
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: " Failed to fetch logs", error: error.message });
  }
};

// Get a single audit log by ID
export const getAuditLogById = async (req, res) => {
  try {
    const log = await AuditLog.findById(req.params.id).populate("userId", "name email");
    if (!log) return res.status(404).json({ message: "Audit log not found" });
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ message: " Failed to fetch log", error: error.message });
  }
};

//Delete audit log
export const deleteAuditLog = async (req, res) => {
  try {
    const deleted = await AuditLog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Audit log not found" });
    res.status(200).json({ message: "Audit log deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: " Failed to delete log", error: error.message });
  }
};
