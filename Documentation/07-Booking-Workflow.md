# Booking Workflow

## Overview

This document explains the **end-to-end booking workflow** in the Guest House Booking MERN application:

- How the **user** creates a booking from the React frontend
- How the **backend** validates availability and saves the booking
- How **MongoDB** stores and links booking data
- How the **admin** approves/rejects bookings and how availability is updated

---

## 1. User Booking Flow (Frontend)

### 1.1 Navigate to the Booking Form

- On the `LandingPage`, each guest house card has a **Book Now** button.
- When the user clicks it, React Router navigates to the `BookingForm` page and passes `guestHouseId` via `location.state`.
- `BookingForm.jsx` reads this value:
  - `const { state } = useLocation();`
  - `const guestHouseId = state?.guestHouseId;`

### 1.2 Select Dates

- The user chooses:
  - **Check-In** date (`formData.checkIn`)
  - **Check-Out** date (`formData.checkOut`)
- When both dates are selected:
  - A `useEffect` hook in `BookingForm` sends a request to the backend:

```text
GET /api/rooms/by-guesthouse?guesthouseId=<id>&checkIn=<date>&checkOut=<date>
```

- The backend returns rooms for that guest house, with **dynamic availability**:
  - `isAvailable` and `isBooked` computed using approved bookings in that date range.

### 1.3 Select Room

- The room dropdown is populated from the `/by-guesthouse` API response.
- Each room option typically shows:
  - `Room {roomNumber} • {roomType} • {roomCapacity} guests`
  - Optionally `(Unavailable)` when `isAvailable` is `false`.
- When a room is selected (`formData.room` is set):
  - A second `useEffect` executes and loads beds:

```text
GET /api/beds/by-room?roomId=<roomId>&checkIn=<date>&checkOut=<date>
```

### 1.4 Select Bed

- The bed dropdown shows beds for the chosen room.
- Each bed has:
  - `Bed {bednumber} • {bedType}`
  - Optionally `(Unavailable)` when `isAvailable` is `false`.
- The user selects a **specific bed** (`formData.bed`).
- Step 1 validation ensures:
  - Dates are filled
  - `checkOut` is after `checkIn`
  - A room and bed are picked

### 1.5 Confirm Personal Information

- Step 2 of the form displays:
  - Full name, email, phone (auto-filled from `localStorage.user`)
  - Optional special requests.
- Step 2 validation checks required fields (full name, email, phone).

### 1.6 Submit Booking

On **Submit Booking**:

1. Client-side validation runs (`validateStep()`).
2. A loading popup appears (`type: "loading"`, message: `"Submitting your booking..."`).
3. `bookingData` is built:

```text
{
  userId: <logged in user id>,
  guesthouseId: <guestHouseId from state>,
  roomId: <selected room>,
  bedId: <selected bed>,
  checkIn: <date>,
  checkOut: <date>,
  status: "Pending"
}
```

4. Frontend calls:

```text
POST /api/bookings
Content-Type: application/json
Authorization: Bearer <JWT token>
```

5. Response handling:
   - **201 Created**:
     - Show success popup: `"Booking submitted successfully!"`
     - Redirect to `/mybookings`.
   - **400 Bad Request**:
     - Show error popup with backend message (e.g., `"Bed is already booked for these dates."`).
   - **500 Server Error**:
     - Show generic error popup.

---

## 2. Backend Booking Creation Flow

### 2.1 Route and Controller

- Route: `POST /api/bookings`
- Controller: `createBooking` in `bookingController.js`

### 2.2 Steps in `createBooking`

1. **Input validation**
   - Confirms all required fields are present:
     - `roomId`, `bedId`, `checkIn`, `checkOut`, `userId`, `guesthouseId`
   - Missing field → `400` with message listing required fields.

2. **Date validation**
   - Converts `checkIn` and `checkOut` to `Date`.
   - Ensures `checkOut > checkIn`.
   - Invalid dates → `400` with `"Check-out date must be after check-in date"`.

3. **Room availability check**
   - Calls `isRoomAvailable(roomId, checkIn, checkOut)` from `availabilityHelper.js`.
   - Only **Approved** bookings block availability.
   - Room is considered **unavailable** only when **all beds** are booked for those dates.
   - If unavailable → `400` with `"Room is already booked for these dates."`.

4. **Bed availability check**
   - Calls `isBedAvailable(bedId, checkIn, checkOut)` from `availabilityHelper.js`.
   - Checks for overlapping **Approved** bookings on the specific bed.
   - If unavailable → `400` with `"Bed is already booked for these dates."`.

5. **Create booking document**
   - If both checks pass, creates a new `Booking` with status `"Pending"`:

```text
Booking.create({
  userId,
  guesthouseId,
  roomId,
  bedId,
  checkIn,
  checkOut,
  status: "Pending"
})
```

6. **Immediate response**
   - Sends `201` with:
     - `message: "Booking created successfully"`
     - `bookingId`

7. **Background tasks**
   - After responding, schedules background tasks:
     - Load the created booking with populated `user` and `guesthouse`.
     - Send notification emails:
       - `sendNewBookingEmails(populatedBooking)`
         - Email to admin (new request).
         - Email to user (request received).
     - Log audit action with `auditLogger.logAction`.

---

## 3. Booking Retrieval Flow

### 3.1 User Bookings (`GET /api/bookings/user/:userId`)

- Used for the `MyBookings` page.
- Controller:
  - Validates `userId`.
  - Finds bookings matching `userId`.
  - Populates:
    - `guesthouseId` (name)
    - `roomId` (room number)
    - `bedId` (bed number)
  - Sorts by `createdAt` descending.
  - Returns as JSON for the frontend to display.

### 3.2 Single Booking (`GET /api/bookings/:id`)

- Returns a fully populated booking with:
  - User
  - Guest house
  - Room
  - Bed
- Useful for detailed views or admin inspection.

---

## 4. Admin Booking Management Flow

### 4.1 View All Bookings

- Route (admin context): `GET /api/bookings`
- Controller:
  - Finds **all** bookings.
  - Populates `userId`, `guesthouseId`, `roomId`, `bedId`.
  - Sorts by `createdAt` descending.
  - Returns list for `BookingManagement` admin page.

### 4.2 Update Booking Status

- Route: `PATCH /api/bookings/:id`
- Body: `{ status: "Pending" | "Approved" | "Cancelled" }`

Steps:

1. Validate `status` is one of the allowed values.
2. Load existing booking (`oldBooking`).
3. Update booking with new `status` and get `updated` booking.
4. Adjust room/bed availability:
   - **Approved**:
     - If `checkOut` is in the future:
       - Set:
         - `Room.isBooked = true`, `Room.isAvailable = false`
         - `Bed.isBooked = true`, `Bed.isAvailable = false`
   - **Cancelled** / **Pending**:
     - Recalculate availability using:
       - `updateRoomAvailability(roomId)`
       - `updateBedAvailability(bedId)`
5. Run `updateAvailabilityForPastBookings(roomId, bedId)` to free room/bed if checkout already passed.
6. Send notification email via `sendBookingStatusEmail(updatedBooking)`.
7. Log audit action (who changed status, old vs new).

### 4.3 Delete Booking

- Route: `DELETE /api/bookings/:id`
- Flow:
  - Delete booking from the database.
  - Recalculate room and bed availability using availability helpers.
  - Log audit entry.

---

## 5. Availability Workflow (Room & Bed)

### 5.1 Room Availability

- Implemented in `availabilityHelper.isRoomAvailable(roomId, checkIn, checkOut)`.
- Logic:
  - Count total beds for the room.
  - Count overlapping **Approved** bookings for that room in the given date range.
  - If `overlappingBookingsCount < totalBeds` → room is **available**.
  - If `overlappingBookingsCount >= totalBeds` → room is **fully booked** (unavailable).

### 5.2 Bed Availability

- Implemented in `availabilityHelper.isBedAvailable(bedId, checkIn, checkOut)`.
- Logic:
  - Look for **Approved** bookings that overlap with the given date range for this specific bed.
  - If a booking exists → bed is **unavailable**.
  - If none → bed is **available**.

### 5.3 Current-Day Availability Flags

- `updateRoomAvailability(roomId)`:
  - Checks if the room has any active **Approved** booking that covers **today**.
  - Sets `isBooked` / `isAvailable` on the room document.
- `updateBedAvailability(bedId)`:
  - Same logic but for the specific bed.

### 5.4 Past Bookings Cleanup

- `updateAvailabilityForPastBookings(roomId?, bedId?)`:
  - Finds all **Approved** bookings whose `checkOut` is before today.
  - For affected rooms/beds, calls `updateRoomAvailability` and `updateBedAvailability`.

---

## 6. Database Entities in the Booking Flow

### 6.1 Booking Schema (Core of the Flow)

- `userId` → reference to `User`
- `guesthouseId` → reference to `GuestHouse`
- `roomId` → reference to `room`
- `bedId` → reference to `bed`
- `checkIn`, `checkOut` → Date range
- `status` → `"Pending" | "Approved" | "Cancelled"`

### 6.2 Related Schemas

- **Room**:
  - Related to `GuestHouse` and `Booking`.
  - Holds capacity and flags (`isBooked`, `isAvailable`).
- **Bed**:
  - Related to `Room` and `Booking`.
  - Tracks individual availability (`isAvailable`, `isBooked`).
- **User**:
  - Linked to bookings via `userId`.

---

## 7. Error Handling in the Booking Flow

### 7.1 Frontend

- Display clear messages from backend:
  - Example: \"Bed is already booked for these dates.\"
- Use popup component with:
  - Error text
  - Close button
  - Click-outside-to-close (for non-loading states)

### 7.2 Backend

- Input / validation errors:
  - `400 Bad Request` with detailed message.
- Not found:
  - `404 Not Found` when booking or user ID is invalid.
- Server / unexpected errors:
  - `500 Internal Server Error` with generic message (details logged server-side).

---

## 8. Summary

- The **frontend** guides the user step-by-step: select dates → room → bed → confirm details → submit.
- The **backend** enforces strict checks on room/bed availability, date validity, and data integrity.
- **MongoDB** stores the booking and maintains relationships between users, guest houses, rooms, and beds.
- **Admins** control booking lifecycle (approve/cancel/delete), which dynamically updates room and bed availability.
- Availability helpers ensure that the booking system reliably prevents double-booking while keeping the UI accurate.

{
  "cells": [],
  "metadata": {
    "language_info": {
      "name": "python"
    }
  },
  "nbformat": 4,
  "nbformat_minor": 2
}