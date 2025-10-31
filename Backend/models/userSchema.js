import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const connection = mongoose.connection;
const AutoIncrement = AutoIncrementFactory(connection);

const userSchema = new mongoose.Schema(
  {
    userId: { type: Number, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNo: { type: String, required: true, unique: true },
    address: {
      line1: { type: String },
    },
  },
  { timestamps: true }
);

// Add auto-increment plugin
userSchema.plugin(AutoIncrement, { inc_field: "userId" });

export default mongoose.model("User", userSchema);
