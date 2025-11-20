// config/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// ✅ Transporter setup (for Gmail / other providers)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER, // e.g. youremail@gmail.com
    pass: process.env.EMAIL_PASS, // App password (not normal password)
  },
});

export default transporter;
