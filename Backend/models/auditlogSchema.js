import mongoose from "mongoose";
const auditlogSchema = new mongoose.Schema(
  {
    auditId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["Approved", "Cancled", "Updated", "Deleted"],
    },
    details: {
      type: String,
    },
    entityType: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("auditLog", auditlogSchema);
