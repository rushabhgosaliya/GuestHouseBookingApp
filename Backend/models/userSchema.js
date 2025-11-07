import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";
import bcrypt from "bcryptjs";

const connection = mongoose.connection;
const AutoIncrement = AutoIncrementFactory(connection);

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
      unique: true,
    },
    address: {
      line1: { type: String },
    },
  },
  { timestamps: true }
);

// Add auto-increment plugin
userSchema.plugin(AutoIncrement, { inc_field: "userId" });

userSchema.pre('save', async function(next){
 //Only hash password if it is changed or new
 if(!this.isModified('password')) return next();

 const salt = await bcrypt.genSalt(10);
 this.password = await bcrypt.hash(this.password, salt);
 next();
});

export default mongoose.model("User", userSchema);
