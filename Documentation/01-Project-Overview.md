# Project Overview

## Application Purpose

The **Guest House Booking Application** is a full-stack web application that enables users to book guest houses, rooms, and beds online. The system provides a seamless booking experience for users while giving administrators complete control over bookings, inventory, and user management.

## Key Features

### User Features
- **Account Management**: Registration, login, password reset
- **Guest House Browsing**: View available guest houses with details
- **Booking System**: Select dates, rooms, and beds for booking
- **Booking Management**: View and track personal bookings
- **Profile Management**: Update personal information

### Admin Features
- **Dashboard**: Overview of bookings, users, and statistics
- **Guest House Management**: Create, update, delete guest houses
- **Room Management**: Manage rooms within guest houses
- **Bed Management**: Manage beds within rooms
- **Booking Management**: Approve, reject, or cancel bookings
- **User Management**: View and manage all users
- **Audit Logs**: Track all system actions and changes

## System Architecture

### Technology Stack

#### Frontend
- **React.js** - UI component library
- **React Router DOM** - Client-side routing /Navigation
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework
- **React Toastify** - Notification system
- **Lucide React** - Icon library
- **react-Hook** - State Management

#### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Authentication tokens
- **Bcrypt.js** - Password hashing
- **Nodemailer** - Email service
- **Multer** - File upload handling

### Architecture Pattern

The application follows a **3-tier architecture**:

```
┌─────────────────┐
│   Frontend      │  React.js Application
│   (Client)      │  - User Interface
│                 │  - State Management
└────────┬────────┘
         │ HTTP/REST API
         │
┌────────▼────────┐
│   Backend       │  Express.js Server
│   (Server)      │  - Business Logic
│                 │  - Authentication
│                 │  - API Endpoints
└────────┬────────┘
         │
┌────────▼────────┐
│   Database      │  MongoDB
│   (Data Layer)  │  - Data Storage
│                 │  - Data Validation
└─────────────────┘
```

## Application Flow

### High-Level Flow

1. **User Registration/Login**
   - User creates account or logs in
   - JWT token generated and stored
   - User redirected to dashboard

2. **Booking Process**
   - User selects guest house
   - Chooses check-in/check-out dates
   - Selects room and bed
   - Submits booking request (status: Pending)

3. **Admin Review**
   - Admin views pending bookings
   - Approves or rejects booking
   - System updates availability
   - User receives email notification

4. **Ongoing Management**
   - Users can view booking status
   - Admins manage inventory
   - System tracks all changes via audit logs

## Data Models

### Core Entities

- **Users**: User accounts (admin and regular users)
- **Guest Houses**: Properties available for booking
- **Rooms**: Rooms within guest houses
- **Beds**: Individual beds within rooms
- **Bookings**: Reservation records
- **Audit Logs**: System activity tracking

### Relationships

```
GuestHouse (1) ──→ (N) Room
Room (1) ──→ (N) Bed
User (1) ──→ (N) Booking
Room (1) ──→ (N) Booking
Bed (1) ──→ (N) Booking
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for passwords
- **Role-Based Access**: Admin and user role separation
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin resource sharing security
- **Protected Routes**: Middleware-based route protection

## Scalability Considerations

- **Modular Code Structure**: Easy to extend and maintain
- **RESTful API Design**: Standard HTTP methods and status codes
- **Database Indexing**: Optimized queries for performance
- **Error Handling**: Comprehensive error management
- **Audit Logging**: Complete activity tracking

## Development Environment

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Project Structure
```
GuestHouseBooking/
├── Backend/          # Express.js server
│   ├── config/       # Database and email config
│   ├── controller/   # Business logic
│   ├── middleware/   # Custom middleware
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── utils/        # Helper functions
├── Frontend/         # React.js application
│   ├── src/
│   │   ├── admin/    # Admin components
│   │   ├── user/     # User components
│   │   └── routes/   # Route definitions
└── Documentation/    # This documentation
```

## Next Steps

- Read [Frontend Workflow](./02-Frontend-Workflow.md) to understand the client-side implementation
- Review [Backend Workflow](./03-Backend-Workflow.md) for server-side details
- Check [Authentication-JWT](./05-Authentication-JWT.md) for security implementation





