# Frontend Workflow

## Overview

The frontend is built with **React.js** and provides a responsive, user-friendly interface for both regular users and administrators. The application uses modern React patterns including hooks, context, and component-based architecture.

## UI Rendering

### Component Structure

React components are organized into logical groups:

```
Frontend/src/
├── admin/              # Admin-specific components
│   ├── components/     # Reusable admin components
│   ├── pages/          # Admin page components
│   └── routes/         # Admin route definitions
├── user/               # User-specific components
│   ├── components/     # Reusable user components
│   └── pages/          # User page components
└── routes/             # Route protection logic
```

### Key Pages

#### User Pages
- **LandingPage**: Homepage with guest house listings
- **Login**: User authentication
- **Register**: New user registration
- **ForgotPassword**: Password reset request
- **ResetPassword**: Password reset form
- **BookingForm**: Multi-step booking form
- **MyBookings**: User's booking history
- **UserDashboard**: User profile and overview
- **Profile**: User profile management

#### Admin Pages
- **AdminDashboard**: Admin overview and statistics
- **BookingManagement**: Approve/reject bookings
- **GuestHouses**: Manage guest houses
- **RoomsManagement**: Manage rooms
- **BedManagement**: Manage beds
- **UserManagement**: Manage users
- **AuditLogPage**: View system audit logs

### Rendering Flow

1. **Initial Load**
   ```javascript
   App.jsx → Router → ProtectedRoute → Page Component
   ```

2. **Component Lifecycle**
   - Component mounts
   - useEffect hooks execute
   - API calls fetch data
   - State updates trigger re-render
   - UI displays data

3. **Conditional Rendering**
   - Based on user role (admin/user)
   - Based on authentication status
   - Based on booking status
   - Based on data availability

## API Communication

### Axios Configuration

Axios is used for all HTTP requests to the backend API:

```javascript
// Example API call
const response = await axios.post(
  "http://localhost:5000/api/bookings",
  bookingData,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
```

### Request Flow

1. **User Action** → Component event handler
2. **API Call** → Axios request with token
3. **Backend Processing** → Server handles request
4. **Response Handling** → Success/error handling
5. **UI Update** → State update and re-render

### Token Management

- **Storage**: JWT token stored in `localStorage`
- **Attachment**: Token added to request headers
- **Validation**: Token checked before protected routes
- **Refresh**: Token validated on each request

```javascript
// Token retrieval
const token = localStorage.getItem("token");

// Token attachment
headers: {
  Authorization: `Bearer ${token}`
}
```

### Error Handling

- **Network Errors**: Displayed via toast notifications
- **Validation Errors**: Shown inline in forms
- **Authentication Errors**: Redirect to login
- **Server Errors**: User-friendly error messages

## State Management

### useState Hook

Manages component-level state:

```javascript
const [formData, setFormData] = useState({
  checkIn: "",
  checkOut: "",
  room: "",
  bed: ""
});
```

**Common State Variables:**
- Form inputs
- Loading states
- Error messages
- User data
- Booking data
- UI visibility toggles

### useEffect Hook

Handles side effects and lifecycle events:

```javascript
useEffect(() => {
  // Fetch data on component mount
  fetchRooms();
  
  // Cleanup on unmount
  return () => {
    // Cleanup logic
  };
}, [dependencies]);
```

**Common Use Cases:**
- Fetching data on mount
- Subscribing to updates
- Validating form inputs
- Auto-filling user data
- Managing side effects

### State Update Patterns

1. **Direct Updates**
   ```javascript
   setFormData({ ...formData, checkIn: value });
   ```

2. **Functional Updates**
   ```javascript
   setFormData(prev => ({ ...prev, checkIn: value }));
   ```

3. **Multiple Updates**
   ```javascript
   setFormData(prev => ({
     ...prev,
     checkIn: value,
     checkOut: ""
   }));
   ```

## Protected Routes

### Route Protection Implementation

React Router DOM handles navigation with route protection:

```javascript
<Route
  path="/admin/*"
  element={
    <ProtectedRoute
      requiredRole="admin"
      redirectTo="/login"
    />
  }
/>
```

### Protection Flow

1. **Route Access Attempt**
   - User navigates to protected route
   - ProtectedRoute component checks authentication

2. **Token Validation**
   - Token retrieved from localStorage
   - Token sent to backend for validation
   - Backend verifies token and role

3. **Access Decision**
   - **Valid Token + Correct Role** → Allow access
   - **Invalid Token** → Redirect to login
   - **Wrong Role** → Redirect to appropriate page

4. **Component Rendering**
   - Protected component renders
   - User data loaded
   - Page functionality available

### Admin Route Protection

```javascript
// AdminRoutes.jsx
const AdminRoutes = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  
  if (!token || user?.role !== "admin") {
    return <Navigate to="/login" />;
  }
  
  return <Outlet />;
};
```

## Navigation Flow

### React Router Setup

```javascript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/booking" element={<BookingForm />} />
    <Route path="/admin/*" element={<AdminRoutes />} />
  </Routes>
</BrowserRouter>
```

### Navigation Patterns

1. **Programmatic Navigation**
   ```javascript
   const navigate = useNavigate();
   navigate("/mybookings");
   ```

2. **Link Navigation**
   ```javascript
   <Link to="/booking">Book Now</Link>
   ```

3. **Conditional Navigation**
   ```javascript
   if (success) {
     navigate("/mybookings");
   }
   ```

## Form Handling

### Multi-Step Forms

The booking form uses a multi-step approach:

```javascript
const [step, setStep] = useState(1);

// Step 1: Booking details (dates, room, bed)
// Step 2: Personal information
```

### Form Validation

- **Client-Side Validation**: Immediate feedback
- **Server-Side Validation**: Final validation on submit
- **Error Display**: Inline error messages
- **Success Feedback**: Toast notifications

### Form Submission Flow

1. User fills form
2. Client-side validation
3. Submit button clicked
4. Loading state shown
5. API request sent
6. Response received
7. Success/error handling
8. UI updated

## UI/UX Features

### Toast Notifications

React Toastify provides user feedback:

```javascript
import { toast } from "react-toastify";

toast.success("Booking created successfully!");
toast.error("Error creating booking");
```

### Loading States

Visual feedback during async operations:

```javascript
{loading ? (
  <div className="spinner">Loading...</div>
) : (
  <div>Content</div>
)}
```

### Responsive Design

Tailwind CSS ensures mobile-friendly UI:
- Responsive grid layouts
- Mobile-first approach
- Breakpoint-based styling

## Component Communication

### Props Passing

Parent to child data flow:

```javascript
<GuestHouseCard
  guestHouse={guestHouse}
  onSelect={handleSelect}
/>
```

### Event Handling

Child to parent communication:

```javascript
const handleClick = () => {
  onSelect(guestHouseId);
};
```

### Context (if used)

Global state management for:
- User authentication state
- Theme preferences
- Global notifications

## Performance Optimization

### Code Splitting

- Route-based code splitting
- Lazy loading of components
- Reduced initial bundle size

### Memoization

- React.memo for component memoization
- useMemo for expensive calculations
- useCallback for function stability

### API Optimization

- Debounced search inputs
- Cached API responses
- Optimistic UI updates

## Next Steps

- Review [Backend Workflow](./03-Backend-Workflow.md) to understand API endpoints
- Check [Authentication-JWT](./05-Authentication-JWT.md) for token handling
- See [Booking Workflow](./07-Booking-Workflow.md) for booking implementation





