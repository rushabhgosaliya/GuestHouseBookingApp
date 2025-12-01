# Guest House Booking System - Complete Project Structure

## 📁 Project Overview
This is a full-stack Guest House Booking System with:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React + Vite

---

## 🗂️ Complete Folder Structure

```
GuestHouseBooking/
├── Backend/                    # Node.js/Express Backend
│   ├── config/                 # Configuration files
│   ├── controller/             # Business logic (request handlers)
│   ├── middleware/              # Custom middleware
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # API route definitions
│   ├── utils/                   # Utility functions
│   ├── uploads/                 # File uploads storage
│   └── server.js               # Entry point
│
└── Frontend/                    # React Frontend
    ├── src/
    │   ├── admin/               # Admin panel components
    │   ├── user/                # User-facing components
    │   ├── routes/              # Route protection
    │   ├── utils/               # Frontend utilities
    │   └── App.jsx              # Main app component
    └── public/                  # Static assets
```

---

## 🔧 BACKEND STRUCTURE

### 1. **`Backend/server.js`** - Application Entry Point
**Purpose**: Main server file that starts the Express application

**Functions**:
- Initializes Express app
- Connects to MongoDB database
- Registers all API routes
- Serves static files (uploads)
- Starts the server on configured port

**Route Registrations**:
- `/api/auth` → Authentication routes
- `/api/admin` → Admin routes
- `/api/guesthouses` → Guest house management
- `/api/rooms` → Room management
- `/api/beds` → Bed management
- `/api/bookings` → Booking operations
- `/api/users` → User management
- `/api/auditlogs` → Audit log viewing

---

### 2. **`Backend/config/`** - Configuration Files

#### **`db.js`**
**Purpose**: MongoDB database connection
**Function**: `connectDb()`
- Establishes connection to MongoDB using environment variables
- Handles connection errors

#### **`mailer.js`**
**Purpose**: Email service configuration
**Exports**: `transporter` (Nodemailer instance)
- Configures SMTP settings for Gmail
- Used by email utility functions

---

### 3. **`Backend/models/`** - Database Schemas

#### **`userSchema.js`**
**Model**: `User`
**Fields**:
- `userId` (auto-increment)
- `firstName`, `lastName`, `email`, `password`
- `phoneNo`, `address`
- `role` (user/admin)
- `isActive` (boolean)

**Relationships**:
- Referenced by: `Booking.userId`

#### **`guesthouseSchema.js`**
**Model**: `GuestHouse`
**Fields**:
- `guesthouseId` (auto-increment)
- `guestHouseName`, `location` (city, state)
- `description`, `image_url`
- `underMaintenance` (boolean)

**Relationships**:
- Referenced by: `Room.guesthouseId`, `Booking.guesthouseId`

#### **`roomSchema.js`**
**Model**: `room`
**Fields**:
- `roomId` (auto-increment)
- `guesthouseId` (ref: GuestHouse)
- `roomNumber`, `roomType` (single/double/family)
- `roomCapacity`
- `isBooked`, `isAvailable` (booleans)

**Relationships**:
- References: `GuestHouse`
- Referenced by: `Bed.roomId`, `Booking.roomId`

#### **`bedSchema.js`**
**Model**: `bed`
**Fields**:
- `roomId` (ref: room)
- `bednumber`, `bedType` (single/double/suit)
- `isAvailable`, `isBooked` (booleans)

**Relationships**:
- References: `room`
- Referenced by: `Booking.bedId`

#### **`bookingSchema.js`**
**Model**: `booking`
**Fields**:
- `bookingId` (auto-increment)
- `userId` (ref: User)
- `guesthouseId` (ref: GuestHouse)
- `roomId` (ref: room)
- `bedId` (ref: bed)
- `checkIn`, `checkOut` (dates)
- `status` (Pending/Approved/Cancelled)

**Relationships**:
- References: `User`, `GuestHouse`, `room`, `bed`

#### **`auditlogSchema.js`**
**Model**: `AuditLog`
**Purpose**: Tracks all CRUD operations
**Fields**: `userId`, `action`, `entityType`, `entityId`, `details`

#### **`notificationSchema.js`**
**Model**: `Notification`
**Purpose**: User notifications

#### **`createAdmin.js`**
**Purpose**: Admin user creation route/model setup

---

### 4. **`Backend/controller/`** - Business Logic

#### **`authController.js`**
**Functions**:
- `registerUser()` - User registration with password hashing
- `loginUser()` - User authentication, JWT token generation
- `forgotPassword()` - Password reset link generation
- `resetPassword()` - Password reset with token validation

**Dependencies**: `User` model, `sendWelcomeEmail()`

#### **`bookingController.js`**
**Functions**:
- `getRoomsByGuestHouse()` - Fetch rooms for a guest house
- `getBedsByRoom()` - Fetch beds for a room
- `createBooking()` - Create booking with date overlap validation
- `getAllBookings()` - Get all bookings (admin)
- `getBookingsByUser()` - Get user's bookings
- `getBookingById()` - Get single booking
- `updateBookingStatus()` - Approve/Cancel booking
- `deleteBooking()` - Delete booking

**Dependencies**: `Room`, `Bed`, `Booking` models, `sendNewBookingEmails()`, `sendBookingStatusEmail()`, `logAction()`

#### **`GuestHouseController.js`**
**Functions**:
- `createGuestHouse()` - Create guest house with image upload
- `getAllGuestHouses()` - Get all guest houses
- `getGuestHouseById()` - Get single guest house
- `updateGuestHouse()` - Update guest house
- `deleteGuestHouse()` - Delete guest house

**Dependencies**: `GuestHouse` model, `logAction()`

#### **`roomController.js`**
**Functions**:
- `createRoom()` - Create new room
- `getAllRooms()` - Get all rooms
- `getRoomsByGuestHouse()` - Get rooms by guest house ID
- `getRoomById()` - Get single room
- `updateRoom()` - Update room
- `deleteRoom()` - Delete room

**Dependencies**: `Room` model, `logAction()`

#### **`bedController.js`**
**Functions**:
- `getAllBeds()` - Get all beds
- `getBedsByRoom()` - Get beds by room ID
- `addBed()` - Create new bed
- `updateBed()` - Update bed
- `deleteBed()` - Delete bed

**Dependencies**: `Bed` model, `logAction()`

#### **`adminController.js`**
**Functions**:
- `getTotalUsers()` - Count total users
- `getTotalBookings()` - Count total bookings

#### **`userController.js`**
**Functions**: User profile management

#### **`auditLogController.js`**
**Functions**: Fetch audit logs

#### **`UpdateUser.js`**
**Functions**: Update user information

---

### 5. **`Backend/routes/`** - API Route Definitions

#### **`authRoute.js`**
**Base Path**: `/api/auth`
**Routes**:
- `POST /register` → `registerUser()`
- `POST /login` → `loginUser()`
- `POST /forgot-password` → `forgotPassword()`
- `POST /reset-password` → `resetPassword()`

#### **`bookingRoutes.js`**
**Base Path**: `/api/bookings`
**Routes**:
- `POST /` → `createBooking()`
- `GET /` → `getAllBookings()`
- `GET /user/:userId` → `getBookingsByUser()`
- `GET /:id` → `getBookingById()`
- `PATCH /:id` → `updateBookingStatus()`
- `DELETE /:id` → `deleteBooking()`

#### **`guestHouseRoutes.js`**
**Base Path**: `/api/guesthouses`
**Routes**: CRUD operations for guest houses

#### **`roomRoutes.js`**
**Base Path**: `/api/rooms`
**Routes**: CRUD operations for rooms

#### **`bedRoutes.js`**
**Base Path**: `/api/beds`
**Routes**: CRUD operations for beds

#### **`adminRoutes.js`**
**Base Path**: `/api/admin`
**Routes**:
- `GET /total-users` → Total users count
- `GET /total-bookings` → Total bookings count
- `GET /total-approved` → Approved bookings count
- `GET /total-pending` → Pending bookings count
- `GET /total-rejected` → Rejected/Cancelled bookings count
- `GET /total-guesthouses` → Total guest houses count
- `GET /total-todays-bookings` → Today's bookings count
- `GET /occupancy-rate` → Occupancy rate calculation
- `GET /monthly-bookings` → Monthly bookings chart data

#### **`userRoute.js`**
**Base Path**: `/api/users`
**Routes**: User management operations

#### **`auditLogRoutes.js`**
**Base Path**: `/api/auditlogs`
**Routes**: Fetch audit logs

#### **`ProtectedRoute.js`**
**Purpose**: Middleware for route protection (JWT authentication)

---

### 6. **`Backend/utils/`** - Utility Functions

#### **`sendMail.js`**
**Purpose**: Email sending utilities
**Functions**:
- `sendMail()` - Base email sender
- `sendWelcomeEmail()` - Welcome email for new users
- `sendNewBookingEmails()` - Notify admin & user on new booking
- `sendBookingStatusEmail()` - Notify user on booking status change

**Dependencies**: `mailer.js` transporter

#### **`auditLogger.js`**
**Purpose**: Audit logging utility
**Function**: `logAction(userId, action, entityType, entityId, details)`
- Logs all CRUD operations
- Never throws errors (safe logging)

**Dependencies**: `AuditLog` model

#### **`eventBus.js`**
**Purpose**: Event bus for inter-component communication

---

### 7. **`Backend/middleware/`** - Custom Middleware

#### **`upload.js`**
**Purpose**: File upload handling (Multer configuration)
- Handles image uploads for guest houses
- Stores files in `uploads/guesthouseimages/`

---

## 🎨 FRONTEND STRUCTURE

### 1. **`Frontend/src/App.jsx`** - Main App Component
**Purpose**: Root component with routing
**Routes**:
- Public: `/`, `/login`, `/register`, `/forgot-password`
- Protected: `/dashboard`, `/bookingform`, `/mybookings`, `/profile`
- Admin: `/admin/*`

---

### 2. **`Frontend/src/user/`** - User-Facing Components

#### **`pages/`**
- **`LandingPage.jsx`** (`Index.jsx`) - Homepage
- **`Login.jsx`** - User login
- **`Register.jsx`** - User registration
- **`UserDashboard.jsx`** - User dashboard
- **`BookingForm.jsx`** - Create booking form
- **`MyBookings.jsx`** - View user's bookings
- **`Profile.jsx`** - User profile management
- **`ForgotPassword.jsx`** - Password reset request
- **`ResetPassword.jsx`** - Password reset form

#### **`components/`**
- **`Navbar.jsx`** - Navigation bar
- **`LandingNavbar.jsx`** - Landing page navbar
- **`GuestHouseCard.jsx`** - Guest house display card
- **`Footer.jsx`** - Footer component

---

### 3. **`Frontend/src/admin/`** - Admin Panel

#### **`pages/`**
- **`AdminDashboard.jsx`** - Admin dashboard with statistics
- **`BookingManagement.jsx`** - Manage bookings
- **`GuestHouses.jsx`** - Manage guest houses
- **`RoomsManagement.jsx`** - Manage rooms
- **`BedManagement.jsx`** - Manage beds
- **`UserManagement.jsx`** - Manage users
- **`AuditLogPage.jsx`** - View audit logs

#### **`components/`**
- **`AdminSidebar.jsx`** - Admin navigation sidebar
- **`MainBody.jsx`** - Main content area
- **`RecentBooking.jsx`** - Recent bookings display

#### **`routes/AdminRoutes.jsx`**
**Purpose**: Admin-specific routing

---

### 4. **`Frontend/src/routes/ProtectedRoute.jsx`**
**Purpose**: Route protection middleware
**Function**: Checks for authentication token in localStorage
- Redirects to `/login` if not authenticated

---

## 🔗 RELATIONSHIPS BETWEEN FILES

### Data Flow Example: Creating a Booking

1. **Frontend**: `BookingForm.jsx` → API call to `/api/bookings`
2. **Backend Route**: `bookingRoutes.js` → `POST /` route
3. **Controller**: `bookingController.js` → `createBooking()`
4. **Models Used**:
   - `Booking` - Create booking record
   - `Room` - Check availability
   - `Bed` - Check availability
5. **Utilities**:
   - `sendNewBookingEmails()` - Send notification emails
   - `logAction()` - Log booking creation
6. **Response**: Returns booking ID to frontend

### Authentication Flow

1. **Frontend**: `Login.jsx` → API call to `/api/auth/login`
2. **Backend Route**: `authRoute.js` → `POST /login`
3. **Controller**: `authController.js` → `loginUser()`
4. **Model**: `User` - Verify credentials
5. **Response**: Returns JWT token + user data
6. **Frontend**: Stores token in localStorage

### Admin Dashboard Flow

1. **Frontend**: `AdminDashboard.jsx` → Multiple API calls
2. **Backend Routes**: `adminRoutes.js` → Various statistics endpoints
3. **Models**: `User`, `Booking`, `GuestHouse` - Count documents
4. **Response**: Returns statistics data
5. **Frontend**: Displays charts and metrics

---

## 📊 Database Relationships Diagram

```
User (1) ────< (Many) Booking
                │
                ├──> GuestHouse (Many)
                ├──> Room (Many)
                └──> Bed (Many)

GuestHouse (1) ────< (Many) Room
                     │
                     └───< (Many) Bed

Booking references:
  - userId → User
  - guesthouseId → GuestHouse
  - roomId → Room
  - bedId → Bed
```

---

## 🔐 Security & Authentication

- **JWT Tokens**: Used for authentication (7-day expiry)
- **Password Hashing**: bcryptjs (10 salt rounds)
- **Protected Routes**: Middleware checks JWT token
- **Role-Based Access**: User/Admin roles
- **Audit Logging**: All CRUD operations logged

---

## 📧 Email System

- **Service**: Nodemailer with Gmail SMTP
- **Emails Sent**:
  1. Welcome email (on registration)
  2. New booking notification (admin + user)
  3. Booking status update (user)
  4. Password reset link

---

## 🎯 Key Features

1. **Guest House Management**: CRUD operations
2. **Room & Bed Management**: Hierarchical structure
3. **Booking System**: Date overlap validation
4. **User Management**: Registration, login, profile
5. **Admin Dashboard**: Statistics and analytics
6. **Audit Logging**: Complete activity tracking
7. **Email Notifications**: Automated emails
8. **File Uploads**: Guest house images

---

## 🚀 How to Navigate the Codebase

1. **Start with**: `Backend/server.js` to understand entry point
2. **Check routes**: `Backend/routes/` to see API endpoints
3. **Read controllers**: `Backend/controller/` for business logic
4. **Review models**: `Backend/models/` for data structure
5. **Frontend routing**: `Frontend/src/App.jsx` for page navigation
6. **Components**: `Frontend/src/user/` and `Frontend/src/admin/` for UI

---

This structure follows **MVC (Model-View-Controller)** architecture pattern with clear separation of concerns.

