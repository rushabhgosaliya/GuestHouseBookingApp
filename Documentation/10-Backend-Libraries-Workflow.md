# Backend Libraries Workflow

## Overview

The backend of the Guest House Booking application is built with **Node.js** and **Express**, and uses several key libraries for:

- HTTP routing and middleware
- Authentication (JWT + bcrypt)
- Database access (Mongoose + MongoDB)
- File uploads
- Email sending
- Environment configuration

All backend dependencies are declared in `Backend/package.json`.

---

## 1. Core Server and HTTP Handling

### 1.1 Express (`express`)

- **Purpose**: Web framework for Node.js; handles HTTP requests and routing.
- **Where**:
  - `server.js` – creates `express()` app, attaches middleware and routes, starts server.
  - `Backend/routes/*.js` – defines route handlers (auth, bookings, rooms, beds, etc.).
  - `Backend/controller/*.js` – controller functions called by routes.

- **Workflow**:
  1. Request arrives at `server.js`.
  2. Express applies global middleware (`cors`, `json`, etc.).
  3. Request is forwarded to the matching router (`/api/bookings`, `/api/rooms`, etc.).
  4. Router calls controller (e.g., `createBooking`).
  5. Controller uses models/utilities and sends response back.

### 1.2 CORS (`cors`)

- **Purpose**: Enable Cross-Origin Resource Sharing so the frontend (different origin/port) can talk to the backend.
- **Where**:
  - `server.js` – `app.use(cors())` or more restrictive configuration.
- **Typical Config**:

```js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
```

---

## 2. Environment and Configuration

### 2.1 Dotenv (`dotenv`)

- **Purpose**: Load environment variables from `.env`.
- **Where**:
  - `server.js` – `dotenv.config()` at top.
  - `config/mailer.js`, `config/db.js`, `utils/sendMail.js` – read `process.env` for:
    - DB connection string
    - JWT secret
    - Email credentials
    - Admin email

- **Workflow**:
  - At startup, `.env` is read.
  - All configuration values are accessible via `process.env.KEY`.

---

## 3. Database and Models

### 3.1 Mongoose (`mongoose`)

- **Purpose**: ODM (Object Data Modeling) library for MongoDB.
- **Where**:
  - `config/db.js` – `mongoose.connect()` to MongoDB.
  - `Backend/models/*.js` – define schemas and models (User, GuestHouse, Room, Bed, Booking, AuditLog).

- **Workflow**:
  1. `connectDB()` uses `mongoose.connect(MONGODB_URI)` to connect.
  2. Each schema defines the structure and validation rules of a collection.
  3. Controllers use model methods:
     - `Model.find()`, `Model.findById()`, `Model.create()`, `Model.findByIdAndUpdate()`, etc.
  4. `populate()` is used to join related documents (e.g., bookings with user and room).

### 3.2 Mongoose Sequence (`mongoose-sequence`)

- **Purpose**: Auto-increment numeric fields (e.g., `roomId`, `userId`).
- **Where**:
  - `userSchema.js`, `roomSchema.js`.

- **Usage**:
  - Plugin attached to schema:

```js
userSchema.plugin(AutoIncrement, { inc_field: "userId" });
roomSchema.plugin(AutoIncrement, { inc_field: "roomId" });
```

---

## 4. Authentication and Security

### 4.1 JSON Web Token (`jsonwebtoken`)

- **Purpose**: Stateless authentication with signed tokens.
- **Where**:
  - `authController.js` – generate JWT on login/register.
  - `middleware/authMiddleware.js` – verify JWT on protected routes.

- **Workflow**:
  - On login:
    - Generate token:
      - `jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: "7d" })`.
  - On each protected request:
    - Extract token from `Authorization: Bearer <token>`.
    - Verify using `jwt.verify(token, JWT_SECRET)`.
    - Attach decoded payload to `req.user`.

### 4.2 Bcrypt (`bcryptjs`)

- **Purpose**: Hash passwords before storing them; verify passwords on login.
- **Where**:
  - `userSchema.js` – `pre('save')` hook:
    - Generates salt and hashes `password` field.
  - `authController.js` – `bcrypt.compare()` to verify login password.

- **Workflow**:
  - During registration:
    - Plain text password is replaced with hash before saving to MongoDB.
  - During login:
    - User-submitted password is compared against stored hash using `bcrypt.compare`.

---

## 5. File Uploads

### 5.1 Multer (`multer`)

- **Purpose**: Handle file uploads (e.g., guest house images).
- **Where**:
  - `middleware/upload.js` – configure storage path and filename pattern.
  - `guestHouseRoutes.js` – routes using `upload.single("image")`.

- **Workflow**:
  - Define storage:
    - Destination folder: `uploads/guesthouseimages/`.
    - Filename: includes `guesthouse_` + timestamp + original extension.
  - In routes:

```js
router.post("/", authenticateToken, requireAdmin, upload.single("image"), createGuestHouse);
```

  - In controller:
    - Access file info via `req.file`.
    - Save file path along with guest house details.

---

## 6. Email Sending

### 6.1 Nodemailer (`nodemailer`)

- **Purpose**: Send transactional emails (welcome, booking notifications, status updates).
- **Where**:
  - `config/mailer.js` – sets up Nodemailer transporter with SMTP config.
  - `utils/sendMail.js` – wraps `transporter.sendMail`.
  - Used by booking and auth controllers through:
    - `sendWelcomeEmail`
    - `sendNewBookingEmails`
    - `sendBookingStatusEmail`

- **Workflow**:
  1. Configure transporter with SMTP host, port, user, password.
  2. Use `sendMail(to, subject, html)` to send emails.
  3. Higher-level helpers create specific email templates and call `sendMail`.
  4. Booking controller triggers these helpers after booking creation/status updates.

---

## 7. Development Utilities

### 7.1 Nodemon (`nodemon`)

- **Purpose**: Automatically restart Node server on file changes during development.
- **Where**:
  - Dev script in backend `package.json` (you can add, e.g.):

```json
"scripts": {
  "dev": "nodemon server.js"
}
```

- **Workflow**:
  - Run `npm run dev` in `Backend/`.
  - Nodemon watches files; when a controller/model changes, the server restarts automatically.

---

## 8. How Backend Libraries Work Together

Example: **Create Booking** request:

1. **Express** receives `POST /api/bookings` request.
2. **CORS** ensures the request is allowed from the frontend origin.
3. **authMiddleware** (using **jsonwebtoken**) verifies the JWT:
   - Attaches `req.user` with `userId`, `role`.
4. **Controller** (`bookingController.createBooking`):
   - Uses **Mongoose** models (Room, Bed, Booking) to:
     - Validate references.
     - Check overlapping bookings.
   - Uses helper functions from `availabilityHelper.js`.
5. **Mongoose** writes new booking document in MongoDB.
6. A background task calls **Nodemailer** via `sendNewBookingEmails` to:
   - Notify admin (ADMIN_EMAIL).
   - Notify user (booking received).
7. Throughout the flow, **dotenv** provides secret values:
   - JWT secret, DB URL, email credentials.

---

## 9. Security Considerations

- **JWT + bcrypt**:
  - Ensure tokens are signed with a strong secret.
  - Never store plain-text passwords.
- **Mongoose**:
  - Validation rules prevent invalid data from being stored.
  - Indexes and unique constraints (e.g., unique room/bed numbers) prevent duplicates.
- **Multer**:
  - Only allow expected file types and sizes (can be extended).
  - Store uploads in a safe folder.
- **Nodemailer**:
  - Use app passwords or SMTP providers with proper security.
  - Never commit SMTP credentials to version control.

---

## 10. Summary

- **Express** orchestrates HTTP requests, routes, and middleware.
- **Mongoose** handles MongoDB models and queries.
- **jsonwebtoken** and **bcryptjs** implement JWT-based authentication and secure password storage.
- **multer** manages file uploads for guest house images.
- **nodemailer** powers transactional emails for bookings and user notifications.
- **dotenv**, **cors**, and **nodemon** support configuration, security, and developer experience.

These libraries together create a secure, maintainable, and scalable backend for the Guest House Booking system.



