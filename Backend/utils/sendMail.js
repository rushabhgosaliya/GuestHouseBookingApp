// utils/sendEmail.js
import transporter from "../config/mailer.js";
import dotenv from "dotenv";
dotenv.config();

/* -------------------------------------------------------------
   ✅ Base reusable mail sender
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
   ✉️ 1. Welcome Email (User Registration)
------------------------------------------------------------- */
export const sendWelcomeEmail = async (user) => {
  if (!user?.email) return;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color:#2b6cb0;">Welcome to Guest House Booking, ${user.firstName}!</h2>
      <p>Thank you for joining us, ${user.firstName} ${user.lastName || ""}.</p>
      <p>You can now explore, book, and enjoy your perfect stay.</p>
      <br />
      <p style="color: #555;">Warm regards,</p>
      <p style="font-weight: bold;">Guest House Booking Team</p>
    </div>
  `;

  await sendMail(user.email, "🎉 Welcome to Guest House Booking!", html);
};

/* -------------------------------------------------------------
   🏨 2. Notify Admin + User when new booking is created
------------------------------------------------------------- */
export const sendNewBookingEmails = async (booking) => {
  if (!booking) return;

  const { userId, guesthouseId, checkIn, checkOut } = booking;
  const userName = `${userId?.firstName || ""} ${userId?.lastName || ""}`;
  const adminEmail = process.env.ADMIN_EMAIL;

  // 📨 Email to Admin
  const adminHtml = `
    <h3>📩 New Booking Request Received</h3>
    <p><b>User:</b> ${userName} (${userId?.email})</p>
    <p><b>Guest House:</b> ${guesthouseId?.guestHouseName}</p>
    <p><b>Check-In:</b> ${new Date(checkIn).toDateString()}</p>
    <p><b>Check-Out:</b> ${new Date(checkOut).toDateString()}</p>
  `;
  await sendMail(adminEmail, "📩 New Booking Request Received", adminHtml);

  // 📨 Confirmation Email to User
  const userHtml = `
    <h2>Hi ${userName},</h2>
    <p>We’ve received your booking request for <b>${guesthouseId?.guestHouseName}</b>.</p>
    <p>We’ll notify you once it’s approved or rejected.</p>
    <br />
    <p>Thank you for using <b>Guest House Booking</b>!</p>
  `;
  await sendMail(userId?.email, "✅ Your Booking Request Has Been Received", userHtml);
};

/* -------------------------------------------------------------
   🔔 3. Notify User when booking status is updated
------------------------------------------------------------- */
export const sendBookingStatusEmail = async (booking) => {
  if (!booking) return;

  const { userId, guesthouseId, status } = booking;

  const html = `
    <h2>Hello ${userId?.firstName},</h2>
    <p>Your booking for <b>${guesthouseId?.guestHouseName}</b> has been <b>${status}</b>.</p>
    <p>We hope to see you soon!</p>
    <br />
    <p style="color:#555;">Best Regards,</p>
    <p style="font-weight:bold;">Guest House Booking Team</p>
  `;

  await sendMail(userId?.email, `🔔 Your Booking Has Been ${status}`, html);
};
