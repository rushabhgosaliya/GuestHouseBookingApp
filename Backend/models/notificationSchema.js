import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    notificationId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Confirm", "Cancel"],
      default: "Confirm",
    },
  },
  { timestamps: true }
);

export default mongoose.model("notification", notificationSchema);
