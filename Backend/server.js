// server.js
import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import urouter from "./routes/userRoute.js"; 
import cors from "cors";
import arouter from "./routes/authRoute.js"
import adminRoutes from './models/createAdmin.js'
import adminroutes from "./routes/adminRoutes.js";
import guestHouseRoutes from "./routes/guestHouseRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";



// Load .env file
dotenv.config();

// Connect with database
connectDb();

const app = express();

// Middleware to parse JSON
app.use(express.json());

app.use(cors())

// ✅ Register routes
// app.use("/api/users", router);

app.use("/api/auth", arouter);   // ✅ change here from /api/users → /api/auth


// Homepage Route
app.get("/", (req, res) => {
  res.status(200).send("Homepage. API is running successfully.");
});

app.get("/display", (req, res) => {
  res.status(201).send("<h1>Display working successfully...</h1>");
});

//Admin routes
app.use('/api/admin',adminRoutes);

app.use("/api", urouter);

app.use("/api/admin", adminroutes);

app.use("/api/guesthouses", guestHouseRoutes);

app.use("/api/rooms", roomRoutes);

// Start Server
const PORT = process.env.PORT_NUMBER || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
