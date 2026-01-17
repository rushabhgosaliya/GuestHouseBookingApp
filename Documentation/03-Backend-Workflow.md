# Backend Workflow

## Overview

The backend is built with **Node.js** and **Express.js**, providing a RESTful API for the frontend application. It handles authentication, business logic, database operations, and external service integrations.

## Server Setup

### Express.js Configuration

```javascript
// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/rooms", roomRoutes);
// ... other routes

// Server start
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

### Environment Configuration

Environment variables stored in `.env`:
- Database connection string
- JWT secret key
- Email service credentials
- Server port
- File upload settings

## Request Handling

### Request Flow

```
Client Request
    ↓
Express Middleware
    ↓
Route Handler
    ↓
Controller Function
    ↓
Database Operation
    ↓
Response to Client
```

### Middleware Stack

1. **CORS Middleware**
   - Handles cross-origin requests
   - Configures allowed origins
   - Sets appropriate headers

2. **Body Parser**
   - Parses JSON request bodies
   - Parses URL-encoded data
   - Handles file uploads (Multer)

3. **Authentication Middleware**
   - Validates JWT tokens
   - Extracts user information
   - Attaches user to request object

4. **Role-Based Middleware**
   - Checks user role
   - Validates permissions
   - Blocks unauthorized access

5. **Error Handling Middleware**
   - Catches all errors
   - Formats error responses
   - Logs errors for debugging

## Route Structure

### Route Organization

```
Backend/routes/
├── authRoute.js          # Authentication routes
├── bookingRoutes.js      # Booking management
├── roomRoutes.js         # Room management
├── bedRoutes.js          # Bed management
├── guestHouseRoutes.js   # Guest house management
├── userRoute.js          # User management
├── adminRoutes.js        # Admin-specific routes
└── auditLogRoutes.js     # Audit log access
```

### Route Definition Pattern

```javascript
// bookingRoutes.js
import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking
} from "../controller/bookingController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public routes
router.post("/", authenticateToken, createBooking);

// Admin routes
router.get("/", authenticateToken, requireAdmin, getAllBookings);
router.put("/:id/status", authenticateToken, requireAdmin, updateBookingStatus);

export default router;
```

### HTTP Methods

- **GET**: Retrieve data
- **POST**: Create new resources
- **PUT**: Update existing resources
- **DELETE**: Remove resources
- **PATCH**: Partial updates

## Controller Functions

### Controller Pattern

Controllers contain business logic and handle request/response:

```javascript
// bookingController.js
export const createBooking = async (req, res) => {
  try {
    // 1. Validate input
    const { roomId, bedId, checkIn, checkOut } = req.body;
    
    // 2. Check availability
    const available = await isBedAvailable(bedId, checkIn, checkOut);
    
    // 3. Create booking
    const booking = await Booking.create(req.body);
    
    // 4. Send response
    res.status(201).json({
      message: "Booking created successfully",
      bookingId: booking._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Controller Responsibilities

1. **Input Validation**
   - Validate required fields
   - Check data types
   - Verify data format

2. **Business Logic**
   - Availability checking
   - Status updates
   - Data transformations

3. **Database Operations**
   - Create records
   - Read data
   - Update records
   - Delete records

4. **Response Handling**
   - Success responses
   - Error responses
   - Status codes

## Middleware Implementation

### Authentication Middleware

```javascript
// authMiddleware.js
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    
    req.user = decoded;
    next();
  });
};
```

### Role-Based Middleware

```javascript
// roleMiddleware.js
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
```

### Error Handling Middleware

```javascript
// errorMiddleware.js
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};
```

## Database Integration

### Mongoose Connection

```javascript
// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
```

### Model Usage in Controllers

```javascript
import Room from "../models/roomSchema.js";
import Bed from "../models/bedSchema.js";
import Booking from "../models/bookingSchema.js";

// Query example
const rooms = await Room.find({ guesthouseId });
const booking = await Booking.findById(id).populate("userId");
```

## API Response Patterns

### Success Response

```javascript
res.status(200).json({
  message: "Operation successful",
  data: result
});
```

### Error Response

```javascript
res.status(400).json({
  message: "Error description",
  error: errorDetails
});
```

### Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

## File Upload Handling

### Multer Configuration

```javascript
// middleware/upload.js
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/guesthouseimages/");
  },
  filename: (req, file, cb) => {
    cb(null, `guesthouse_${Date.now()}.${file.originalname.split(".").pop()}`);
  }
});

export const upload = multer({ storage });
```

### Upload Route

```javascript
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  upload.single("image"),
  createGuestHouse
);
```

## Utility Functions

### Helper Functions

Located in `Backend/utils/`:

- **availabilityHelper.js**: Room/bed availability checking
- **sendMail.js**: Email sending functionality
- **auditLogger.js**: Activity logging
- **eventBus.js**: Event handling (if used)

### Usage Example

```javascript
import { isBedAvailable } from "../utils/availabilityHelper.js";
import { sendBookingConfirmation } from "../utils/sendMail.js";
import { logAction } from "../utils/auditLogger.js";

// In controller
const available = await isBedAvailable(bedId, checkIn, checkOut);
await sendBookingConfirmation(booking);
await logAction(userId, "Created", "Booking", bookingId);
```

## Error Handling Strategy

### Try-Catch Blocks

All async operations wrapped in try-catch:

```javascript
export const someFunction = async (req, res) => {
  try {
    // Operation
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
```

### Custom Error Classes

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}
```

### Error Logging

- Console logging for development
- Error tracking service (if configured)
- Audit logs for security errors

## Security Measures

### Input Sanitization

- Validate all inputs
- Sanitize user data
- Prevent injection attacks

### Rate Limiting

- Prevent abuse
- Limit request frequency
- Protect endpoints

### CORS Configuration

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## Testing Considerations

### Unit Testing

- Test individual functions
- Mock database calls
- Test error handling

### Integration Testing

- Test API endpoints
- Test database operations
- Test authentication flow

## Next Steps

- Review [MongoDB Workflow](./04-MongoDB-Workflow.md) for database details
- Check [Authentication-JWT](./05-Authentication-JWT.md) for security
- See [Booking Workflow](./07-Booking-Workflow.md) for business logic





