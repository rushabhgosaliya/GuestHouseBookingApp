import User from "../models/userSchema.js";
import { logAction } from "../utils/auditLogger.js";
import bcrypt from "bcryptjs";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    const formatted = users.map((u) => ({
      ...u._doc,
      address:
        typeof u.address === "string"
          ? { line1: u.address }
          : u.address || { line1: "" },
    }));

    res.status(200).json({ users: formatted });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add user
export const addUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();

    await logAction(
      req.user?._id,
      "Created",
      "User",
      newUser._id,
      `User ${newUser.firstName} ${newUser.lastName} created`
    );

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    await logAction(
      req.user?._id,
      "Updated",
      "User",
      updatedUser?._id,
      `User ${updatedUser?.firstName} ${updatedUser?.lastName} updated`
    );

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

//  Soft Delete (Deactivate)
export const deleteUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    // FIXED — correct variable name
    await logAction(
      req.user?._id,
      "Deleted",
      "User",
      updatedUser?._id,
      `User ${updatedUser?.firstName} ${updatedUser?.lastName} deactivated`
    );

    return res.status(200).json({
      success: true,
      message: "User deactivated",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deactivating user" });
  }
};

//  Activate User
export const activateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "User activated",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error activating user" });
  }
};

//change password
export const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password incorrect" });

    user.password = newPassword; // will be hashed automatically
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
