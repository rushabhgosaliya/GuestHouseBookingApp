// import userSchema from "../models/userSchema.js"; 

// export const user = async (req, res) => {
//   try {
//     const newUser = await userSchema.create({
//       firstName: "Test",
//       lastName: "User",
//       email: "test@example.com",
//       password: "test123",
//       phoneNo: 9876543210,
//       adress: {
//         line1: "Street 1",
//         line2: "Area 2",
//         line3: "City 3",
//       },
//     });

//     res.status(201).json(newUser);
//     console.log('data display')
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };


import User from "../models/userSchema.js";

// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    // Always return address as { line1: "" }
    const formatted = users.map((u) => ({
      ...u._doc,
      address:
        typeof u.address === "string"
          ? { line1: u.address }
          : u.address || { line1: "" },
    }));

    res.status(200).json({ users: formatted });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add new user
export const addUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user", error });
  }
};

// ✅ Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error });
  }
};

// ✅ Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error });
  }
};
