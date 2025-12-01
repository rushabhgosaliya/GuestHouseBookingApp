import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const connection = mongoose.connection;
const AutoIncrement = AutoIncrementFactory(connection);

const auditLogSchema = new mongoose.Schema(
  {
    auditId: {
      type: Number,
      unique: true,
    },
    userId: {
      type: String,
      default:"System"
    },
    action: {
      type: String,
      enum: ["Created", "Updated", "Deleted"],
      required: true,
    },
    entityType: {
      type: String, 
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
    },
    details: {
      type: String,
    },
  },
  { timestamps: true }
);

//  Auto-increment for auditId
auditLogSchema.plugin(AutoIncrement, { inc_field: "auditId" });

export default mongoose.model("AuditLog", auditLogSchema);
