import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Transporter setup (for Gmail / other providers)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

export default transporter;
