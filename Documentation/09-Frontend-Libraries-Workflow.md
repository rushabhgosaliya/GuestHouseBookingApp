# Frontend Libraries Workflow

## Overview

The frontend of the Guest House Booking application is built with **React** and modern tooling.  
This document explains **which libraries are used**, **where they are used**, and **how they work together**.

Frontend dependencies are defined in `Frontend/package.json`.

---

## 1. Core React Stack

### 1.1 React (`react`, `react-dom`)

- **Purpose**: Build component-based user interfaces.
- **Usage**:
  - All pages (Login, Register, BookingForm, MyBookings, Admin pages) are React components.
  - `main.jsx` renders `<App />` into the DOM using `ReactDOM.createRoot`.

### 1.2 React Router (`react-router-dom`)

- **Purpose**: Client-side routing and navigation.
- **Key Concepts**:
  - `<BrowserRouter>`: Wraps the entire app (in `main.jsx`).
  - `<Routes>` / `<Route>`: Define paths and components (in `App.jsx`).
  - `<Navigate>`: Redirects users (e.g., unauthenticated users to `/login`).
  - `useNavigate()`, `useLocation()`: Imperative navigation and access to route state.

- **Examples**:
  - Public routes (`/`, `/login`, `/register`, `/forgot-password`, `/reset-password/:token`).
  - Protected routes (wrapped by `ProtectedRoute`).
  - Admin routes under `/admin/*` rendered inside `AdminDashboard`.

### 1.3 React Hooks (`useState`, `useEffect`)

- **Purpose**: State and side effects management.
- **Usage**:
  - `useState` for form inputs, loading states, errors, popup visibility.
  - `useEffect` for:
    - Fetching guest house details, rooms, beds in `BookingForm`.
    - Auto-filling user info from `localStorage`.
    - Admin dashboard initial toast, auth checks.

---

## 2. Styling and UI

### 2.1 Tailwind CSS (`tailwindcss`, `@tailwindcss/cli`, `@tailwindcss/vite`)

- **Purpose**: Utility-first CSS framework for fast styling.
- **Workflow**:
  - Tailwind is configured in `index.css` / Tailwind config.
  - Classes like `bg-blue-700`, `rounded-lg`, `shadow-xl`, `grid md:grid-cols-2` are used directly in JSX.
- **Benefits**:
  - Responsive design with minimal custom CSS.
  - Consistent design language across pages.

### 2.2 Icons (`lucide-react`, `react-icons`)

- **`lucide-react`**:
  - Used for modern, clean icons (e.g., close button `X` in `BookingForm`).
  - Example:
    - `import { X } from "lucide-react";`

- **`react-icons`**:
  - Provides a large set of icons from different packs.
  - Example:
    - `import { FaMapMarkerAlt } from "react-icons/fa";`
    - Used to show location icons in guest house details.

---

## 3. Networking and Data Handling

### 3.1 Axios (`axios`)

- **Purpose**: HTTP client for calling backend APIs.
- **Usage**:
  - Imported directly in components like `BookingForm`, `Login`, `LandingPage`, admin pages.
  - Example:

```js
const res = await axios.get("http://localhost:5000/api/guesthouses");
```

- **Patterns**:
  - `GET` for fetching lists and details:
    - Rooms, beds, guest houses, bookings, stats.
  - `POST` for creating resources:
    - Login, register, create booking.
  - `PATCH` / `PUT` for updates:
    - Update booking status, edit rooms/beds/guest houses.
  - `DELETE` for deletions:
    - Delete bookings, beds, rooms.

- **With Auth**:
  - Token retrieved from `localStorage` and passed either:
    - Via component-level headers, or
    - Automatically via a shared `axios` configuration / interceptor.

---

## 4. Forms and Validation

### 4.1 React Hook Form (`react-hook-form`) (optional usage)

- **Purpose**: Simple, performant form state management and validation.
- **Potential Usage**:
  - Login and registration pages.
  - Admin forms for rooms, beds, guest houses.

- **If Used**:
  - `useForm()` to register inputs.
  - Built-in validation rules for required fields, patterns, etc.

*(If your current code uses plain `useState` for forms, `react-hook-form` is still available to refactor forms in the future.)*

---

## 5. Notifications and Feedback

### 5.1 React Toastify (`react-toastify`)

- **Purpose**: Show non-blocking toast notifications.
- **Usage**:
  - `ToastContainer` added to `AdminDashboard` or a top-level layout.
  - `toast.success(...)`, `toast.error(...)` used to show:
    - Login success.
    - Booking success / failure.
    - Admin actions (approve/cancel booking, CRUD operations).

- **Example**:

```js
toast.success("Admin Login Successful!", {
  position: "top-right",
  autoClose: 2500,
  theme: "colored",
});
```

---

## 6. Charts and Analytics

### 6.1 Recharts (`recharts`)

- **Purpose**: Build charts and visualizations.
- **Typical Usage**:
  - Admin dashboard to show:
    - Monthly bookings.
    - Occupancy rate.
  - Fetches data from admin stats endpoints and passes it as props to chart components.

---

## 7. Tooling and Build

### 7.1 Vite (`vite`, `@vitejs/plugin-react-swc`)

- **Purpose**: Fast dev server and bundler for React apps.
- **Features**:
  - Hot Module Replacement (HMR) in development.
  - Optimized production builds.
- **Configuration**:
  - `vite.config.js` integrates React with SWC plugin.

### 7.2 ESLint (`eslint`, plugins)

- **Purpose**: Linting and code quality.
- **Workflow**:
  - `npm run lint` checks the code.
  - Ensures standard React and JS best practices.

### 7.3 PostCSS, Autoprefixer (`postcss`, `autoprefixer`)

- **Purpose**: CSS post-processing.
- **Usage**:
  - Works with Tailwind to add vendor prefixes and support advanced CSS features.

---

## 8. How It All Connects

- **React + React Router**: Provide the overall SPA structure and navigation.
- **Axios**: Bridges frontend with backend REST API.
- **Tailwind + Icons**: Handle look and feel and UX polish.
- **React Hook Form / Hooks**: Manage complex form flows like the booking wizard.
- **React Toastify + Recharts**: Improve admin experience with feedback and analytics.
- **Vite + ESLint + Tailwind tooling**: Ensure fast development and clean, maintainable code.

Together, these libraries make the frontend:

- **Responsive** (Tailwind)
- **Interactive** (React, hooks)
- **Connected to backend safely** (Axios + JWT in headers)
- **Informative and user-friendly** (toasts, icons, charts)



