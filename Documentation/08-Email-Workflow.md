# Email Workflow

## Overview

This document describes how the **email system** works in the Guest House Booking application.  
Emails are used for:

- Welcoming new users
- Notifying admins and users when a **new booking** is created
- Informing users when their **booking status** changes (Approved / Cancelled)
- (Optional) Password reset / other notifications

The implementation is based on **Nodemailer** and configured via environment variables.

---

## 1. Email Infrastructure (Backend)

### 1.1 Mail Transport Configuration

File: `Backend/config/mailer.js` (not shown here in full)

- Uses `nodemailer.createTransport()` with:
  - `host`, `port`
  - `auth` (user, password) from `.env`:
    - `EMAIL_USER`
    - `EMAIL_PASS`
- Exports a `transporter` used by `utils/sendMail.js`.

### 1.2 Base Send Function

File: `Backend/utils/sendMail.js`

Core utility:

- `sendMail(to, subject, html)`:
  - Builds `mailOptions` with `from`, `to`, `subject`, `html`.
  - Uses `transporter.sendMail(mailOptions)`.
  - Logs success or error to console.

HTML wrapper:

- `emailBox(content)`:
  - Wraps raw HTML content in a styled container:
    - Background color, padding, border, shadow.
    - Footer with © and year.
  - Ensures all emails share a consistent layout.

---

## 2. Email Types and Workflows

### 2.1 Welcome Email

Function: `sendWelcomeEmail(user)`

- **When**: after successful user registration (optional integration in `authController.register`).
- **Input**: `user` document with `firstName`, `lastName`, `email`.
- **Flow**:
  1. Checks if `user.email` exists.
  2. Creates HTML using `emailBox(...)` with greeting and short message.
  3. Calls `sendMail(user.email, "🎉 Welcome to Guest House Booking!", html)`.

**Purpose**:  
Make new users feel welcomed and confirm their account creation.

---

### 2.2 New Booking Emails (Admin + User)

Function: `sendNewBookingEmails(booking)`

- **When**: After a new booking is created successfully in `createBooking` (background task).
- **Input**: A **populated** booking object:
  - `userId` → contains `firstName`, `lastName`, `email`
  - `guesthouseId` → contains `guestHouseName`
  - `checkIn`, `checkOut`

#### 2.2.1 Admin Notification

- Retrieves:
  - Admin email from `process.env.ADMIN_EMAIL`
  - User full name and email
  - Guest house name
  - Check-in / check-out dates
- Builds HTML with:
  - Header: \"New Booking Request\"
  - Table:
    - User name and email
    - Guest house
    - Check-in, check-out
    - Status: `Pending`
- Sends:

```text
To: ADMIN_EMAIL
Subject: 📩 New Booking Request Received
```

**Purpose**:  
Inform the admin that a new booking request is waiting for review.

#### 2.2.2 User Confirmation

- Builds HTML with:
  - Header: \"Booking Request Received\"
  - Greeting by name
  - Table with guest house, dates, and `Pending` status
  - Message that they will be notified after approval/rejection.
- Sends:

```text
To: userId.email
Subject: ✅ Your Booking Request Has Been Received
```

**Purpose**:  
Confirm to the user that their booking request was received and is under review.

---

### 2.3 Booking Status Update Email

Function: `sendBookingStatusEmail(booking)`

- **When**: After admin updates a booking’s status in `updateBookingStatus`.
- **Input**: A **populated** booking object with:
  - `userId` (name + email)
  - `guesthouseId` (name)
  - `checkIn`, `checkOut`
  - `status` (`Pending`, `Approved`, `Cancelled`)

#### 2.3.1 Workflow

1. Extracts:
   - `userId.firstName`
   - `guesthouseId.guestHouseName`
   - `status`, `checkIn`, `checkOut`
2. Wraps content with `emailBox(...)`:
   - Title: \"Booking Status Updated\"
   - Greeting with user’s first name.
   - Table summarising:
     - Guest House
     - Check-In / Check-Out dates
     - New `status`
3. Sends:

```text
To: userId.email
Subject: 🔔 Your Booking Has Been <STATUS>
```

**Examples**:

- If status = `Approved` → \"🔔 Your Booking Has Been Approved\"
- If status = `Cancelled` → \"🔔 Your Booking Has Been Cancelled\"

**Purpose**:  
Keep users informed about changes to their booking so they do not need to constantly check manually.

---

## 3. Integration with Booking Workflow

### 3.1 On Booking Creation

In `bookingController.createBooking`:

- After the booking is created and response is sent:
  - A `setImmediate` callback:
    - Reloads the booking with:
      - `populate('userId')`
      - `populate('guesthouseId')`
    - Calls `sendNewBookingEmails(populatedBooking)`:
      - Admin + user notifications.
    - Logs an audit entry using `auditLogger`.

### 3.2 On Booking Status Change

In `bookingController.updateBookingStatus`:

- After:
  - Validating new status
  - Updating room/bed availability
  - Calling `updateAvailabilityForPastBookings`
- The function calls:
  - `sendBookingStatusEmail(updatedBooking)`
  - This sends the status update email to the user.

---

## 4. Environment Variables and Configuration

Typical `.env` keys:

- `EMAIL_USER`: SMTP username / email
- `EMAIL_PASS`: SMTP password or app-specific password
- `SMTP_HOST`: SMTP host (e.g. `smtp.gmail.com`)
- `SMTP_PORT`: SMTP port (e.g. `587` for TLS)
- `ADMIN_EMAIL`: destination for admin notifications

Mail configuration file reads these variables and passes them to `nodemailer.createTransport`.

---

## 5. Error Handling and Reliability

### 5.1 Error Logging

- All email send operations are wrapped in `try/catch`.
- On failure:
  - Error message logged with `console.error("Error sending email:", error.message)`.
  - **Important**: Booking operations do **not** fail just because email failed.

### 5.2 Non-Blocking Emails

- Emails for new bookings and status updates are sent **after** the main response:
  - Implemented with `setImmediate` or equivalent.
- This ensures:
  - The API remains responsive.
  - Email delays do not slow down the user experience.

---

## 6. Frontend User Experience

- Users do **not** see raw email content in the UI.
- Instead, they:
  - Get immediate visual feedback via popups / toast notifications.
  - Receive emails for confirmation and updates.
- Admins:
  - See stats and booking lists in `AdminDashboard`.
  - Are notified via email about new booking requests.

---

## 7. Extending the Email System

You can easily add more email types using the same pattern:

1. Create a new helper in `utils/sendMail.js`, for example:
   - `sendPasswordResetEmail(user, resetLink)`
   - `sendAdminAlertEmail(message)`
2. Use `emailBox(content)` for consistent styling.
3. Call the helper from:
   - Auth controllers (`forgotPassword`, `resetPassword`)
   - Admin controllers (system alerts).

---

## 8. Summary

- Emails are central to user and admin communication:
  - Welcome messages
  - New booking notifications
  - Booking status updates
- The system uses **Nodemailer** with a reusable base `sendMail` function and a unified `emailBox` layout.
- Email operations are non-blocking and robust, so booking flows remain reliable even if email delivery occasionally fails.



