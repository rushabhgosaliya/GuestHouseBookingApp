# System Architecture Diagram and Workflow Summary

## Overview

This document provides a **high-level view** of the Guest House Booking system:

- Overall architecture (MERN stack)
- Main components (frontend, backend, database, email)
- How authentication, role-based access, and bookings flow through the system

---

## 1. High-Level Architecture

### 1.1 Layered Architecture

```text
┌─────────────────────────────┐
│        Frontend (React)     │
│  - Pages & Components       │
│  - Routing (react-router)   │
│  - State & Forms            │
└──────────────┬──────────────┘
               │  HTTPS / JSON (REST API)
               │  (Axios with JWT in headers)
┌──────────────▼──────────────┐
│     Backend (Node + Express)│
│  - Routes & Controllers     │
│  - Auth (JWT, bcrypt)      │
│  - RBAC (user/admin)       │
│  - Business Logic           │
│  - Email (Nodemailer)       │
└──────────────┬──────────────┘
               │  Mongoose ODM
┌──────────────▼──────────────┐
│       MongoDB Database       │
│  - Users                    │
│  - GuestHouses              │
│  - Rooms                    │
│  - Beds                     │
│  - Bookings                 │
│  - AuditLogs                │
└─────────────────────────────┘
```

### 1.2 Supporting Services

```text
┌─────────────────────────────┐
│        Email (SMTP)         │
│  - Nodemailer               │
│  - New bookings             │
│  - Status updates           │
│  - Welcome emails           │
└─────────────────────────────┘
```

---

## 2. Authentication and RBAC Flow

### 2.1 Login and Token Issuance

```text
User submits login form (email + password)
        │
        ▼
Frontend (React) → POST /api/auth/login
        │
        ▼
Backend (authController)
  - Find user by email
  - Verify password with bcrypt
  - Sign JWT { userId, email, role }
        │
        ▼
Frontend receives { token, user }
  - Save in localStorage
  - Redirect:
      - admin → /admin/dashboard
      - user  → /dashboard
```

### 2.2 Protected Requests

```text
Frontend component
  - Reads token from localStorage
  - Axios adds Authorization: Bearer <token>
        │
        ▼
Backend middleware (authenticateToken)
  - Verify JWT (jsonwebtoken)
  - Attach decoded payload to req.user
        │
        ▼
Role middleware (requireAdmin) [if admin route]
  - Check req.user.role === "admin"
        │
        ▼
Controller executes and returns data
```

---

## 3. Booking Flow Architecture

### 3.1 User Booking Creation

```text
User on BookingForm (React)
  - Selects dates, room, bed
  - Confirm personal info
        │
        ▼
POST /api/bookings
  Body: { userId, guesthouseId, roomId, bedId, checkIn, checkOut, status: "Pending" }
        │
        ▼
Backend (bookingController.createBooking)
  - Validate fields and dates
  - Check room availability (availabilityHelper.isRoomAvailable)
  - Check bed availability  (availabilityHelper.isBedAvailable)
  - Create Booking in MongoDB
  - Send 201 response to client
  - In background:
      - Populate booking with user + guesthouse
      - Send emails (sendNewBookingEmails)
      - Log audit action
        │
        ▼
Frontend
  - Shows success popup
  - Navigates to /mybookings
```

### 3.2 Booking Approval / Cancellation (Admin)

```text
Admin in AdminDashboard → BookingManagement
  - Views list from GET /api/bookings
  - Chooses a booking and sets new status (Approved/Cancelled)
        │
        ▼
PATCH /api/bookings/:id
  Body: { status }
        │
        ▼
Backend (updateBookingStatus)
  - Validate new status
  - Load existing booking
  - Update booking.status
  - Update room/bed availability:
      - Approved → mark booked (if dates include today/future)
      - Cancelled/Pending → recompute via availability helper
  - updateAvailabilityForPastBookings
  - sendBookingStatusEmail(user)
  - logAction (audit log)
        │
        ▼
Frontend (Admin + User)
  - Admin sees updated status list
  - User receives email and sees new status in MyBookings
```

---

## 4. Database Relationships Diagram

```text
┌──────────────┐        ┌──────────────┐
│   User       │        │ GuestHouse   │
│ (users)      │        │ (guesthouses)│
└─────┬────────┘        └─────┬────────┘
      │                         │
      │ 1..N                    │ 1..N
      │                         │
      ▼                         ▼
┌──────────────┐        ┌──────────────┐
│  Booking     │        │   Room       │
│ (bookings)   │        │ (rooms)      │
└─────┬────────┘        └─────┬────────┘
      │                         │
      │ 1..N                    │ 1..N
      │                         │
      ▼                         ▼
                      ┌──────────────┐
                      │    Bed       │
                      │  (beds)      │
                      └──────────────┘
```

- Each **Booking** references:
  - `userId` → `User`
  - `guesthouseId` → `GuestHouse`
  - `roomId` → `Room`
  - `bedId` → `Bed`
- **Room** belongs to a **GuestHouse**.
- **Bed** belongs to a **Room**.
- **AuditLog** points to `userId` and a generic `entityId` (User/Room/Booking/etc.).

---

## 5. Data and Control Flow Summary

### 5.1 User Journey

```text
Register/Login
  ↓
Browse Guest Houses (LandingPage)
  ↓
Open BookingForm (with selected guesthouse)
  ↓
Pick dates → GET rooms/beds with availability
  ↓
Pick room + bed → Submit booking
  ↓
Wait for admin decision → Email + MyBookings view
```

### 5.2 Admin Journey

```text
Admin Login
  ↓
AdminDashboard → view stats (users, bookings, occupancy, monthly chart)
  ↓
BookingManagement → view all bookings
  ↓
Approve / Cancel bookings
  ↓
Rooms/Beds/GuestHouses management (CRUD)
  ↓
Audit logs for security and traceability
```

---

## 6. Components Map

### 6.1 Frontend

- **Pages**:
  - `LandingPage`, `Login`, `Register`, `ForgotPassword`, `ResetPassword`
  - `UserDashboard`, `BookingForm`, `MyBookings`, `Profile`
  - `AdminDashboard`, `BookingManagement`, `RoomsManagement`, `BedManagement`, `GuestHouses`, `UserManagement`, `AuditLogPage`
- **Routing**:
  - `App.jsx` + `ProtectedRoute.jsx`
- **Shared**:
  - `Navbar`, `Footer`, `GuestHouseCard`, etc.

### 6.2 Backend

- **Routes**:
  - `authRoute`, `userRoute`, `guestHouseRoutes`, `roomRoutes`, `bedRoutes`, `bookingRoutes`, `adminRoutes`, `auditLogRoutes`
- **Controllers**:
  - `authController`, `userController`, `guestHouseController`, `roomController`, `bedController`, `bookingController`, `adminController`, `auditLogController`
- **Middleware**:
  - `authMiddleware`, `roleMiddleware`, `errorMiddleware`, `upload`
- **Utils**:
  - `availabilityHelper`, `sendMail`, `auditLogger`, `eventBus`

---

## 7. Summary

- The Guest House Booking application uses a clear **MERN layered architecture**.
- **Frontend** handles pages, routing, forms, and calls the backend via Axios.
- **Backend** handles business logic, authentication, RBAC, and emails using Express + Mongoose + supporting libraries.
- **MongoDB** stores users, guest houses, rooms, beds, bookings, and audit logs with well-defined relationships.
- The overall workflows (auth, RBAC, booking, email, stats) are consistently implemented across this structure.


