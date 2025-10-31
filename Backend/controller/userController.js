import userSchema from "../models/userSchema.js"; 

export const user = async (req, res) => {
  try {
    const newUser = await userSchema.create({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "test123",
      phoneNo: 9876543210,
      adress: {
        line1: "Street 1",
        line2: "Area 2",
        line3: "City 3",
      },
    });

    res.status(201).json(newUser);
    console.log('data display')
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
