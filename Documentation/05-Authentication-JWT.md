# JWT Authentication Flow

## Overview

The application uses **JSON Web Tokens (JWT)** for secure authentication. JWT provides a stateless authentication mechanism that doesn't require server-side session storage.

## Authentication Flow

### Complete Flow Diagram

```
User Login
    ↓
Backend Validates Credentials
    ↓
JWT Token Generated
    ↓
Token Sent to Frontend
    ↓
Token Stored in localStorage
    ↓
Token Attached to Requests
    ↓
Backend Validates Token
    ↓
Request Processed
```

## Token Generation

### Login Process

```javascript
// authController.js
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // 3. Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    // 4. Send response
    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
```

### Token Payload

The JWT token contains:

```javascript
{
  userId: "user_id_here",
  email: "user@example.com",
  role: "user" | "admin",
  iat: 1234567890,  // Issued at
  exp: 1234567890   // Expiration
}
```

### Token Configuration

- **Secret Key**: Stored in environment variables
- **Expiration**: 7 days (configurable)
- **Algorithm**: HS256 (default)

## Token Storage

### Frontend Storage

```javascript
// Login.jsx
const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    const response = await axios.post("/api/auth/login", loginData);
    
    // Store token and user data
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    
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

### Storage Methods

1. **localStorage** (Current Implementation)
   - Persists across browser sessions
   - Accessible via JavaScript
   - Vulnerable to XSS attacks

2. **sessionStorage** (Alternative)
   - Cleared on browser close
   - More secure for sensitive data

3. **HttpOnly Cookies** (Most Secure)
   - Not accessible via JavaScript
   - Protected from XSS
   - Requires additional configuration

## Token Validation

### Middleware Implementation

```javascript
// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  // 1. Extract token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  // 2. Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    
    // 3. Attach user info to request
    req.user = decoded;
    next();
  });
};
```

### Usage in Routes

```javascript
// bookingRoutes.js
import { authenticateToken } from "../middleware/authMiddleware.js";

router.post(
  "/",
  authenticateToken,  // Token validation
  createBooking
);
```

## Protected Routes

### Frontend Protection

```javascript
// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  
  // Check token existence
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};
```

### Backend Protection

```javascript
// All protected routes use authenticateToken middleware
router.get("/bookings", authenticateToken, getBookings);
router.post("/bookings", authenticateToken, createBooking);
router.put("/bookings/:id", authenticateToken, updateBooking);
```

## Token Refresh

### Current Implementation

- Tokens expire after 7 days
- User must re-login when token expires
- Frontend checks token validity before requests

### Token Refresh Strategy (Future Enhancement)

```javascript
// Refresh token flow
const refreshToken = async () => {
  try {
    const response = await axios.post("/api/auth/refresh", {
      refreshToken: localStorage.getItem("refreshToken")
    });
    
    localStorage.setItem("token", response.data.token);
    return response.data.token;
  } catch (error) {
    // Redirect to login
    localStorage.clear();
    navigate("/login");
  }
};
```

## Logout Process

### Frontend Logout

```javascript
// Logout function
const handleLogout = () => {
  // Clear stored data
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  
  // Redirect to login
  navigate("/login");
};
```

### Backend Logout (Optional)

Since JWT is stateless, logout is typically handled client-side. For enhanced security:

```javascript
// Token blacklist (if implemented)
export const logout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  // Add token to blacklist (Redis/database)
  await TokenBlacklist.create({ token, expiresAt: decoded.exp });
  
  res.json({ message: "Logged out successfully" });
};
```

## Password Security

### Password Hashing

```javascript
// User registration
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

### Password Verification

```javascript
// Login verification
const isMatch = await bcrypt.compare(password, user.password);
```

### Password Requirements

- Minimum length: 6 characters (configurable)
- Should include: letters, numbers, special characters
- Stored as hash, never as plain text

## Registration Flow

### User Registration

```javascript
// authController.js
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNo } = req.body;
    
    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    // 2. Create user (password auto-hashed by pre-save hook)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNo,
      role: "user"
    });
    
    // 3. Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    // 4. Send response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
```

## Security Best Practices

### Token Security

1. **Secret Key Management**
   - Store in environment variables
   - Never commit to version control
   - Use strong, random secrets

2. **Token Expiration**
   - Set reasonable expiration times
   - Implement refresh tokens for long sessions
   - Clear expired tokens

3. **HTTPS Only**
   - Always use HTTPS in production
   - Prevent token interception
   - Secure cookie transmission

4. **Token Validation**
   - Validate on every request
   - Check expiration
   - Verify signature

### Additional Security Measures

1. **Rate Limiting**
   - Limit login attempts
   - Prevent brute force attacks
   - Throttle API requests

2. **Input Validation**
   - Validate email format
   - Check password strength
   - Sanitize user inputs

3. **Error Messages**
   - Don't reveal user existence
   - Generic error messages
   - Log detailed errors server-side

## Error Handling

### Authentication Errors

```javascript
// 401 Unauthorized - No token or invalid token
if (!token || !decoded) {
  return res.status(401).json({ message: "Authentication required" });
}

// 403 Forbidden - Valid token but insufficient permissions
if (requiredRole && user.role !== requiredRole) {
  return res.status(403).json({ message: "Insufficient permissions" });
}
```

### Frontend Error Handling

```javascript
// Axios interceptor for token errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

## Next Steps

- Review [Role-Based Access Control](./06-Role-Based-Access-Control.md) for permissions
- Check [Security Workflow](./10-Security-Workflow.md) for additional security
- See [Backend Workflow](./03-Backend-Workflow.md) for middleware usage





