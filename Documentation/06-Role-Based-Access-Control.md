# Role-Based Access Control (RBAC)

## Overview

The Guest House Booking Application implements a **Role-Based Access Control (RBAC)** system that restricts access to resources and functionality based on user roles. The system supports two primary roles: **Admin** and **User**, each with distinct permissions and access levels.

## Role Definitions

### User Roles

1. **Admin Role**
   - Full system access
   - Can manage all bookings, rooms, beds, and guest houses
   - Can approve/reject bookings
   - Can view audit logs
   - Can manage users
   - Access to admin dashboard and all admin features

2. **User Role**
   - Limited access to personal features
   - Can create bookings
   - Can view own bookings only
   - Can update own profile
   - Cannot access admin features
   - Redirected to user dashboard

## Backend Workflow

### Role Storage in Database

Roles are stored in the User schema:

```javascript
// models/userSchema.js
const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    required: true
  },
  // ... other fields
});
```

### Role Assignment

#### Default Role Assignment
- New users are assigned `"user"` role by default during registration
- Admin role must be explicitly set during admin creation

#### Admin Creation
```javascript
// models/createAdmin.js
router.post('/create-admin', async(req, res) => {
  const admin = new User({
    firstName,
    lastName,
    email,
    phoneNo,
    password,
    role: "admin",  // Explicitly set admin role
    isActive: true
  });
  
  await admin.save();
});
```

### JWT Token Role Inclusion

The user's role is included in the JWT token payload:

```javascript
// authController.js - Login
const token = jwt.sign(
  {
    userId: user._id,
    email: user.email,
    role: user.role  // Role included in token
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
```

### Backend Route Protection

#### Authentication Middleware

All protected routes first verify the JWT token:

```javascript
// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    
    // Attach user info (including role) to request
    req.user = decoded;  // Contains: userId, email, role
    next();
  });
};
```

#### Role-Based Middleware

Admin-only routes use role checking middleware:

```javascript
// Middleware to check admin role
export const requireAdmin = (req, res, next) => {
  // First ensure user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  // Check if user has admin role
  if (req.user.role !== "admin") {
    return res.status(403).json({ 
      message: "Admin access required. Insufficient permissions." 
    });
  }
  
  next();
};
```

### Route Protection Examples

#### Admin-Only Routes

```javascript
// routes/adminRoutes.js
router.get("/total-users", authenticateToken, requireAdmin, getTotalUsers);
router.get("/total-bookings", authenticateToken, requireAdmin, getTotalBookings);
router.get("/total-approved", authenticateToken, requireAdmin, getApprovedBookings);
```

#### User Routes (with role-based data filtering)

```javascript
// routes/bookingRoutes.js
// Get all bookings - Admin can see all, User sees only their own
router.get("/", authenticateToken, getAllBookings);

// In controller - filter based on role
export const getAllBookings = async (req, res) => {
  try {
    let query = {};
    
    // If user is not admin, only show their bookings
    if (req.user.role !== "admin") {
      query.userId = req.user.userId;
    }
    
    const bookings = await Booking.find(query)
      .populate("userId", "firstName lastName email")
      .populate("roomId", "roomNumber")
      .populate("bedId", "bednumber");
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};
```

#### Admin-Only Actions

```javascript
// routes/bookingRoutes.js
// Update booking status - Only admin can approve/reject
router.patch("/:id", authenticateToken, requireAdmin, updateBookingStatus);

// routes/guestHouseRoutes.js
// Create/Update/Delete guest house - Admin only
router.post("/", authenticateToken, requireAdmin, upload.single("image"), createGuestHouse);
router.put("/:id", authenticateToken, requireAdmin, upload.single("image"), updateGuestHouse);
router.delete("/:id", authenticateToken, requireAdmin, deleteGuestHouse);
```

### Controller-Level Role Checking

Controllers can also check roles for fine-grained control:

```javascript
// controller/bookingController.js
export const updateBookingStatus = async (req, res) => {
  try {
    // Role check (if middleware not used)
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        message: "Only admins can update booking status" 
      });
    }
    
    // Admin-only logic
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    res.json({ message: "Booking status updated", booking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking" });
  }
};
```

### Error Responses

#### 401 Unauthorized
- No token provided
- Invalid/expired token
- User not authenticated

#### 403 Forbidden
- Valid token but insufficient permissions
- User role doesn't match required role
- Access denied to resource

## Frontend Workflow

### Role Storage

User role is stored in localStorage after login:

```javascript
// Login.jsx
const handleLogin = async (e) => {
  try {
    const response = await axios.post("/api/auth/login", loginData);
    
    // Store user data including role
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify({
      _id: response.data.user._id,
      firstName: response.data.user.firstName,
      lastName: response.data.user.lastName,
      email: response.data.user.email,
      role: response.data.user.role  // Role stored here
    }));
    
    // Redirect based on role
    if (response.data.user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  } catch (error) {
    // Handle error
  }
};
```

### Route Protection

#### Basic Protected Route

```javascript
// routes/ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
```

#### Role-Based Route Protection

```javascript
// Enhanced ProtectedRoute with role checking
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  
  // Check authentication
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on user's actual role
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return children;
};
```

### Admin Route Protection

#### Admin Dashboard Protection

```javascript
// admin/pages/AdminDashboard.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check authentication and role
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    
    if (!token) {
      navigate("/login");
      return;
    }
    
    // Verify admin role
    if (user?.role !== "admin") {
      // Redirect non-admin users
      navigate("/dashboard");
      return;
    }
  }, [navigate]);
  
  // Admin dashboard content
  return (
    <div>
      <AdminSidebar />
      <AdminRoutes />
    </div>
  );
};
```

#### Route Configuration

```javascript
// App.jsx
<Routes>
  {/* Public routes */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<Login />} />
  
  {/* User protected routes */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <UserDashboard />
      </ProtectedRoute>
    }
  />
  
  {/* Admin routes - protected by AdminDashboard component */}
  <Route 
    path="/admin/*" 
    element={<AdminDashboard />}  // Component handles role check
  />
</Routes>
```

### Conditional Rendering Based on Role

#### Navigation Menu

```javascript
// components/Navbar.jsx
const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";
  
  return (
    <nav>
      <Link to="/">Home</Link>
      
      {user && (
        <>
          {isAdmin ? (
            <Link to="/admin/dashboard">Admin Dashboard</Link>
          ) : (
            <Link to="/dashboard">Dashboard</Link>
          )}
          <Link to="/mybookings">My Bookings</Link>
        </>
      )}
    </nav>
  );
};
```

#### Feature Access Control

```javascript
// BookingManagement.jsx (Admin only)
const BookingManagement = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  
  // Double check role (defense in depth)
  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div>
      <h1>Booking Management</h1>
      {/* Admin-only booking management UI */}
    </div>
  );
};
```

#### Button/Feature Visibility

```javascript
// MyBookings.jsx
const MyBookings = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";
  
  return (
    <div>
      <h1>{isAdmin ? "All Bookings" : "My Bookings"}</h1>
      
      {isAdmin && (
        <button onClick={handleApproveAll}>
          Approve All Pending
        </button>
      )}
      
      {/* Booking list */}
    </div>
  );
};
```

### API Request Role Handling

#### Axios Interceptor

```javascript
// utils/axiosConfig.js
import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 403 Forbidden (role mismatch)
    if (error.response?.status === 403) {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user?.role !== "admin") {
        // Redirect to appropriate dashboard
        window.location.href = "/dashboard";
      }
    }
    
    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);
```

## Complete Access Control Flow

### User Login Flow

```
1. User submits login credentials
   ↓
2. Backend validates credentials
   ↓
3. Backend generates JWT with role
   ↓
4. Frontend receives token + user data (including role)
   ↓
5. Frontend stores token + user in localStorage
   ↓
6. Frontend redirects based on role:
   - Admin → /admin/dashboard
   - User → /dashboard
```

### Admin Access Flow

```
1. Admin navigates to /admin/dashboard
   ↓
2. AdminDashboard component mounts
   ↓
3. Component checks localStorage for token + role
   ↓
4. If role !== "admin" → redirect to /dashboard
   ↓
5. If role === "admin" → render admin UI
   ↓
6. Admin makes API request
   ↓
7. Backend receives request with JWT token
   ↓
8. Backend verifies token (authenticateToken middleware)
   ↓
9. Backend checks role (requireAdmin middleware)
   ↓
10. If role === "admin" → process request
    If role !== "admin" → return 403 Forbidden
```

### User Access Flow

```
1. User navigates to protected route
   ↓
2. ProtectedRoute checks for token
   ↓
3. If no token → redirect to /login
   ↓
4. If token exists → check role
   ↓
5. User makes API request
   ↓
6. Backend verifies token
   ↓
7. Backend filters data based on role:
   - Admin: All data
   - User: Only their own data
   ↓
8. Return filtered response
```

## Security Best Practices

### Backend Security

1. **Always Verify Token First**
   - Authentication must happen before role checking
   - Use middleware chain: `authenticateToken` → `requireAdmin`

2. **Never Trust Client-Side Role**
   - Always verify role on backend
   - Client-side checks are for UX only

3. **Filter Data by Role**
   - Users should only see their own data
   - Admins can see all data
   - Implement filtering in controllers

4. **Use Middleware Chain**
   ```javascript
   router.get(
     "/admin/stats",
     authenticateToken,  // 1. Verify token
     requireAdmin,       // 2. Check role
     getAdminStats       // 3. Process request
   );
   ```

### Frontend Security

1. **Defense in Depth**
   - Check role in multiple places
   - Route protection + component check + API handling

2. **Handle 403 Errors**
   - Show appropriate message
   - Redirect to correct dashboard
   - Don't expose sensitive information

3. **Token Validation**
   - Check token before making requests
   - Handle token expiration
   - Clear storage on logout

4. **Role-Based UI**
   - Hide admin features from users
   - Show appropriate navigation
   - Provide role-appropriate actions

## Common Patterns

### Pattern 1: Admin-Only Route

```javascript
// Backend
router.post("/admin/create-guesthouse", 
  authenticateToken, 
  requireAdmin, 
  createGuestHouse
);

// Frontend
{user?.role === "admin" && (
  <Link to="/admin/guesthouses">Manage Guest Houses</Link>
)}
```

### Pattern 2: Role-Based Data Filtering

```javascript
// Backend Controller
export const getBookings = async (req, res) => {
  const query = req.user.role === "admin" 
    ? {} 
    : { userId: req.user.userId };
  
  const bookings = await Booking.find(query);
  res.json(bookings);
};
```

### Pattern 3: Conditional Feature Access

```javascript
// Frontend Component
const BookingCard = ({ booking }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";
  
  return (
    <div>
      <h3>Booking #{booking._id}</h3>
      {isAdmin && (
        <div>
          <button onClick={() => approveBooking(booking._id)}>Approve</button>
          <button onClick={() => rejectBooking(booking._id)}>Reject</button>
        </div>
      )}
    </div>
  );
};
```

## Error Handling

### Backend Error Responses

```javascript
// 401 Unauthorized - No token or invalid token
if (!token) {
  return res.status(401).json({ 
    message: "Authentication required" 
  });
}

// 403 Forbidden - Valid token but wrong role
if (req.user.role !== "admin") {
  return res.status(403).json({ 
    message: "Admin access required" 
  });
}
```

### Frontend Error Handling

```javascript
// Handle API errors
try {
  const response = await axios.get("/api/admin/stats");
  setStats(response.data);
} catch (error) {
  if (error.response?.status === 403) {
    toast.error("You don't have permission to access this");
    navigate("/dashboard");
  } else if (error.response?.status === 401) {
    localStorage.clear();
    navigate("/login");
  }
}
```

## Testing Role-Based Access

### Test Cases

1. **Admin Access**
   - Admin can access `/admin/dashboard`
   - Admin can see all bookings
   - Admin can approve/reject bookings

2. **User Access**
   - User redirected from `/admin/dashboard`
   - User sees only their bookings
   - User cannot approve/reject bookings

3. **Unauthenticated Access**
   - No access to protected routes
   - Redirected to login
   - Cannot make API requests

4. **Token Expiration**
   - Expired token returns 401
   - User redirected to login
   - Storage cleared

## Next Steps

- Review [Authentication-JWT](./05-Authentication-JWT.md) for token handling
- Check [Security Workflow](./10-Security-Workflow.md) for additional security
- See [Backend Workflow](./03-Backend-Workflow.md) for middleware implementation





