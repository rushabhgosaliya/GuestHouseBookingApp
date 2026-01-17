# MongoDB Workflow

## Overview

The application uses **MongoDB** as the NoSQL database with **Mongoose** as the Object Data Modeling (ODM) library. MongoDB provides flexible schema design and efficient querying for the booking system.

## Database Connection

### Connection Setup

```javascript
// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
```

### Connection String

```
mongodb://localhost:27017/guesthousebooking
// or
mongodb+srv://username:password@cluster.mongodb.net/guesthousebooking
```

## Collections (Collections)

### Core Collections

1. **users** - User accounts
2. **guesthouses** - Guest house properties
3. **rooms** - Rooms within guest houses
4. **beds** - Beds within rooms
5. **bookings** - Booking reservations
6. **auditlogs** - System activity logs

## Schema Definitions

### User Schema

```javascript
// models/userSchema.js
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNo: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
```

**Key Features:**
- Unique email constraint
- Role-based access (user/admin)
- Password hashing before save
- Automatic timestamps

### Guest House Schema

```javascript
// models/guesthouseSchema.js
const guesthouseSchema = new mongoose.Schema({
  guestHouseName: { type: String, required: true },
  location: {
    city: String,
    state: String,
    address: String
  },
  description: String,
  image: String,
  amenities: [String],
  contactInfo: {
    phone: String,
    email: String
  }
}, { timestamps: true });
```

**Key Features:**
- Nested location object
- Array of amenities
- Image path storage
- Contact information

### Room Schema

```javascript
// models/roomSchema.js
const roomSchema = new mongoose.Schema({
  roomId: { type: Number, unique: true },
  guesthouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GuestHouse",
    required: true
  },
  roomNumber: { type: Number, required: true },
  roomType: { type: String, enum: ["single", "double", "family"], required: true },
  roomCapacity: { type: Number, required: true },
  isBooked: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });
```

**Key Features:**
- Auto-incrementing roomId
- Reference to GuestHouse
- Availability flags
- Room type enumeration

### Bed Schema

```javascript
// models/bedSchema.js
const bedSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "room",
    required: true
  },
  bednumber: { type: Number, required: true },
  bedType: { type: String, enum: ["single", "double", "suit"], required: true },
  isAvailable: { type: Boolean, default: true },
  isBooked: { type: Boolean, default: false }
}, { timestamps: true });
```

**Key Features:**
- Reference to Room
- Bed type enumeration
- Individual availability tracking

### Booking Schema

```javascript
// models/bookingSchema.js
const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  guesthouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GuestHouse",
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "room",
    required: true
  },
  bedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "bed",
    required: true
  },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Cancelled"],
    default: "Pending"
  }
}, { timestamps: true });
```

**Key Features:**
- Multiple references (User, GuestHouse, Room, Bed)
- Date range (checkIn, checkOut)
- Status enumeration
- Automatic timestamps

### Audit Log Schema

```javascript
// models/auditlogSchema.js
const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: mongoose.Schema.Types.ObjectId,
  description: String,
  ipAddress: String,
  userAgent: String
}, { timestamps: true });
```

**Key Features:**
- Tracks all system actions
- User reference
- Entity tracking
- Metadata storage

## Relationships

### Reference Relationships

```
GuestHouse (1) ──→ (N) Room
Room (1) ──→ (N) Bed
User (1) ──→ (N) Booking
GuestHouse (1) ──→ (N) Booking
Room (1) ──→ (N) Booking
Bed (1) ──→ (N) Booking
```

### Populating References

```javascript
// Populate single reference
const booking = await Booking.findById(id)
  .populate("userId", "firstName lastName email")
  .populate("roomId", "roomNumber")
  .populate("bedId", "bednumber");

// Populate nested references
const room = await Room.findById(id)
  .populate({
    path: "guesthouseId",
    select: "guestHouseName location"
  });
```

## Data Validation

### Schema-Level Validation

```javascript
email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
  match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
}
```

### Custom Validation

```javascript
checkOut: {
  type: Date,
  required: true,
  validate: {
    validator: function(value) {
      return value > this.checkIn;
    },
    message: "Check-out must be after check-in"
  }
}
```

### Pre-Save Hooks

```javascript
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

## Query Patterns

### Basic Queries

```javascript
// Find all
const rooms = await Room.find({ guesthouseId });

// Find one
const room = await Room.findOne({ roomNumber: 101 });

// Find by ID
const booking = await Booking.findById(bookingId);

// Count
const count = await Booking.countDocuments({ status: "Pending" });
```

### Advanced Queries

```javascript
// Date range query
const bookings = await Booking.find({
  checkIn: { $lt: checkOut },
  checkOut: { $gt: checkIn },
  status: "Approved"
});

// Complex query with operators
const availableRooms = await Room.find({
  guesthouseId,
  isAvailable: true,
  $or: [
    { isBooked: false },
    { roomCapacity: { $gte: guests } }
  ]
});
```

### Aggregation

```javascript
// Statistics aggregation
const stats = await Booking.aggregate([
  { $match: { status: "Approved" } },
  { $group: {
    _id: "$guesthouseId",
    totalBookings: { $sum: 1 },
    totalRevenue: { $sum: "$amount" }
  }}
]);
```

## Indexing

### Index Creation

```javascript
// Single field index
userSchema.index({ email: 1 });

// Compound index
bookingSchema.index({ roomId: 1, checkIn: 1, checkOut: 1 });

// Text search index
guesthouseSchema.index({ guestHouseName: "text", description: "text" });
```

### Index Benefits

- Faster query performance
- Unique constraint enforcement
- Efficient sorting
- Text search capabilities

## Data Operations

### Create Operations

```javascript
// Create single document
const booking = await Booking.create({
  userId,
  roomId,
  bedId,
  checkIn,
  checkOut
});

// Create multiple
const rooms = await Room.insertMany([room1, room2, room3]);
```

### Read Operations

```javascript
// Find with conditions
const bookings = await Booking.find({
  userId,
  status: "Approved"
}).sort({ createdAt: -1 });

// Find with pagination
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;
const bookings = await Booking.find()
  .skip(skip)
  .limit(limit);
```

### Update Operations

```javascript
// Update one
await Booking.findByIdAndUpdate(id, {
  status: "Approved"
}, { new: true });

// Update multiple
await Room.updateMany(
  { guesthouseId },
  { isAvailable: true }
);
```

### Delete Operations

```javascript
// Delete one
await Booking.findByIdAndDelete(id);

// Delete multiple
await Bed.deleteMany({ roomId });
```

## Transaction Support

### Transaction Example

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  const booking = await Booking.create([bookingData], { session });
  await Room.findByIdAndUpdate(roomId, { isBooked: true }, { session });
  await Bed.findByIdAndUpdate(bedId, { isBooked: true }, { session });
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

## Data Consistency

### Availability Updates

The system maintains data consistency through:

1. **Dynamic Availability Checking**
   - Checks actual bookings, not just flags
   - Updates flags based on current bookings
   - Handles date overlaps correctly

2. **Cascade Updates**
   - When booking approved → update room/bed availability
   - When booking cancelled → recalculate availability
   - When dates change → recheck conflicts

3. **Validation Rules**
   - Prevent double booking
   - Validate date ranges
   - Check room capacity

## Backup and Maintenance

### Backup Strategy

- Regular database backups
- Point-in-time recovery
- Export/import functionality

### Maintenance Tasks

- Index optimization
- Collection cleanup
- Data archiving
- Performance monitoring

## Next Steps

- Review [Backend Workflow](./03-Backend-Workflow.md) for controller usage
- Check [Booking Workflow](./07-Booking-Workflow.md) for booking logic
- See [Authentication-JWT](./05-Authentication-JWT.md) for user management





