// utils/sendEmail.js
import transporter from "../config/mailer.js";
import dotenv from "dotenv";
dotenv.config();

/* -------------------------------------------------------------
   Base reusable mail sender
------------------------------------------------------------- */
const sendMail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Guest House Booking" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${to}: ${subject}`);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};

/* -------------------------------------------------------------
   General Email Card Wrapper (inline styling)
------------------------------------------------------------- */
const emailBox = (content) => `
  <div style="
    font-family: 'Arial', sans-serif; 
    background:#f5f7ff; 
    padding:25px;
  ">
    <div style="
      max-width:600px; 
      margin:auto; 
      background:white; 
      padding:25px; 
      border-radius:12px;
      border:1px solid #e0e7ff;
      box-shadow:0 4px 12px rgba(0,0,0,0.08);
    ">
      ${content}
      <hr style="margin-top:25px; border:0; border-top:1px solid #ddd;" />
      <p style="font-size:14px; color:#555; text-align:center;">
        © ${new Date().getFullYear()} Guest House Booking — All Rights Reserved
      </p>
    </div>
  </div>
`;

/* -------------------------------------------------------------
   1. Welcome Email
------------------------------------------------------------- */
export const sendWelcomeEmail = async (user) => {
  if (!user?.email) return;

  const html = emailBox(`
    <h2 style="color:#1e3a8a; font-size:24px; margin:0;">
      Welcome to Guest House Booking, ${user.firstName}!
    </h2>

    <p style="color:#555; font-size:16px; line-height:1.6; margin-top:16px;">
      Thank you for joining us, <b>${user.firstName} ${user.lastName || ""}</b>.
      You can now explore, book, and enjoy your perfect stay.
    </p>
  `);

  await sendMail(user.email, "🎉 Welcome to Guest House Booking!", html);
};

/* -------------------------------------------------------------
   2. Notify Admin + User when new booking is created
------------------------------------------------------------- */
export const sendNewBookingEmails = async (booking) => {
  if (!booking) return;

  const { userId, guesthouseId, checkIn, checkOut } = booking;
  const userName = `${userId?.firstName || ""} ${userId?.lastName || ""}`;
  const adminEmail = process.env.ADMIN_EMAIL;

  /* ------------------ ADMIN EMAIL ------------------ */
  const adminHtml = emailBox(`
    <h2 style="color:#1e3a8a; margin:0;">New Booking Request</h2>

    <table style="margin-top:18px; width:100%; font-size:15px; color:#333; line-height:1.5;">
      <tr><td><b>User</b></td><td>${userName} (${userId?.email})</td></tr>
      <tr><td><b>Guest House</b></td><td>${guesthouseId?.guestHouseName}</td></tr>
      <tr><td><b>Check-In</b></td><td>${new Date(checkIn).toDateString()}</td></tr>
      <tr><td><b>Check-Out</b></td><td>${new Date(checkOut).toDateString()}</td></tr>
      <tr><td><b>Status</b></td><td>Pending</td></tr>
    </table>

    <p style="margin-top:18px; color:#555;">
      A new booking request has been submitted.
    </p>
  `);

  await sendMail(adminEmail, "📩 New Booking Request Received", adminHtml);

  /* ------------------ USER EMAIL ------------------ */
  const userHtml = emailBox(`
    <h2 style="color:#1e3a8a; margin:0;">Booking Request Received</h2>

    <p style="color:#444; margin-top:14px;">
      Hi <b>${userName}</b>, your booking request has been received.
    </p>

    <table style="margin-top:18px; width:100%; font-size:15px; color:#333; line-height:1.5;">
      <tr><td><b>Guest House</b></td><td>${guesthouseId?.guestHouseName}</td></tr>
      <tr><td><b>Check-In</b></td><td>${new Date(checkIn).toDateString()}</td></tr>
      <tr><td><b>Check-Out</b></td><td>${new Date(checkOut).toDateString()}</td></tr>
      <tr><td><b>Status</b></td><td>Pending</td></tr>
    </table>

    <p style="margin-top:20px; color:#555;">
      You will be notified once your booking is approved or rejected.
    </p>
  `);

  await sendMail(userId?.email, "✅ Your Booking Request Has Been Received", userHtml);
};

/* -------------------------------------------------------------
   3. Notify User when booking status is updated
------------------------------------------------------------- */
export const sendBookingStatusEmail = async (booking) => {
  if (!booking) return;

  const { userId, guesthouseId, status, checkIn, checkOut } = booking;

  const html = emailBox(`
    <h2 style="color:#1e3a8a; margin:0;">Booking Status Updated</h2>

    <p style="margin-top:18px; color:#444;">
      Hello <b>${userId?.firstName}</b>, your booking has been updated.
    </p>

    <table style="margin-top:18px; width:100%; font-size:15px; color:#333; line-height:1.5;">
      <tr><td><b>Guest House</b></td><td>${guesthouseId?.guestHouseName}</td></tr>
      <tr><td><b>Check-In</b></td><td>${new Date(checkIn).toDateString()}</td></tr>
      <tr><td><b>Check-Out</b></td><td>${new Date(checkOut).toDateString()}</td></tr>
      <tr><td><b>Status</b></td><td>${status}</td></tr>
    </table>

    <p style="margin-top:20px; color:#555;">
      Thank you for using Guest House Booking.
    </p>
  `);

  await sendMail(userId?.email, `🔔 Your Booking Has Been ${status}`, html);
};
