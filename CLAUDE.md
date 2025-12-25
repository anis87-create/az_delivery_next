# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AzFoodDelivery is a full-stack food delivery application with a Next.js frontend and Express/MongoDB backend. The application supports two user types: customers and restaurant owners, with role-based authentication and access control.

## Development Commands

### Frontend (Next.js)
```bash
cd frontend
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Backend (Express)
```bash
cd backend
node server.js   # Start backend server (port 5000)
# Note: Backend uses nodemon in dependencies but no dev script configured
```

## Architecture

### Monorepo Structure
- `frontend/` - Next.js 16 application with App Router
- `backend/` - Express.js REST API with MongoDB

### Backend Architecture

**Entry Point**: `backend/server.js`
- Express server with CORS enabled
- MongoDB connection via `config/db.js`
- Single route namespace: `/api/auth`

**Authentication Flow**:
- JWT-based authentication using Bearer tokens
- Tokens stored in localStorage on frontend
- Middleware (`middlewares/auth.js`) validates JWT and attaches `req.user`
- Password hashing with bcrypt (10 salt rounds)

**User Roles**:
- `customer` - Default role for regular users
- `restaurant_owner` - Owners who have an associated Restaurant document

**Key Backend Files**:
- `models/User.js` - User schema with role enum, email validation
- `models/Restaurant.js` - Restaurant schema with owner reference to User
- `controllers/auth.js` - Three main actions:
  - `register` - Creates User (and Restaurant if role is restaurant_owner)
  - `login` - Returns user data + JWT token
  - `authMe` - Protected route that returns current user (with restaurant data if owner)
- `middlewares/auth.js` - JWT verification middleware (protect)

**API Endpoints**:
- `POST /api/auth/register` - Register user/restaurant
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get authenticated user (protected)

**Environment Variables** (backend/.env):
- `MONGO_URI` - MongoDB connection string
- `SECRET_TOKEN` - JWT signing secret
- `DEFAULT_PORT` - Server port (defaults to 5000)

### Frontend Architecture

**Framework**: Next.js 16 with App Router and React 19

**State Management**: Redux Toolkit with 5 slices:
- `authSlice` - User authentication state (`user`, `isError`, `isSuccess`, `isLoading`, `message`)
- `restaurantSlice` - Restaurant data
- `itemsSlice` - Menu items
- `categorySlice` - Categories
- `cartSlice` - Shopping cart

**Store Setup**:
- Store defined in `app/store/store.jsx`
- Wrapped via `StoreProvider` in `app/layout.jsx`
- Uses `'use client'` directive for client-side Redux

**Authentication State Management**:
- `authSlice.js` contains three async thunks: `register`, `login`, `authMe`
- All thunks have a 3-second minimum delay for UX consistency
- `isSuccess` is set to `true` on successful login/register/authMe
- Token stored in localStorage via `app/store/services/auth.js`
- API base URL: `http://localhost:5000/api/`

**IMPORTANT - Authentication Pattern**:
The codebase currently uses `isSuccess` from Redux state to check if user is authenticated, but this is semantically incorrect. `isSuccess` indicates an operation succeeded, not authentication status. There is an existing inconsistency:
- `Navbar.jsx:39` defines `const isAuthenticated = !!user` (correct approach)
- `Navbar.jsx:121` uses `isAuthenticated && user` for desktop menu
- `Navbar.jsx:230` uses `isSuccess && user` for mobile menu (inconsistent)

When working with authentication checks, prefer using `!!user` or a dedicated `isAuthenticated` boolean in Redux state instead of `isSuccess`.

**Layout Structure**:
- `app/layout.jsx` - Root layout with StoreProvider, ConditionalNavbar, ConditionalFooter
- `app/components/layouts/Navbar/Navbar.jsx` - Main navigation with role-based menu items
- `app/components/AuthInit.jsx` - Handles initial auth state by calling `authMe` thunk

**Page Routes**:
- `/` - Home page
- `/login` - Login page with LoginForm component
- `/register` - Registration page with RegisterForm component
- `/restaurantDashboard` - Protected route for restaurant owners only
  - Checks localStorage for token
  - Redirects to `/login` if no token
  - Redirects to `/` if user exists but role is not `restaurant_owner`
  - Shows loading spinner until `user` is loaded and role verified

**Component Patterns**:
- Client components use `'use client'` directive
- `isMounted` state pattern used to prevent hydration mismatches (Navbar, RestaurantDashboard)
- Forms use controlled inputs with local state
- Redux dispatch for async operations (login, register)

**Styling**: Tailwind CSS 4 with custom utilities

### Role-Based Access Control

**Restaurant Owner Registration**:
When a user registers with `role: 'restaurant_owner'`, the backend:
1. Creates the User document
2. Validates restaurant fields (name, category, type, street, city, zipCode, phone, deliveryZone)
3. Creates associated Restaurant document with `owner` field referencing the User

**Protected Routes Pattern**:
See `restaurantDashboard/page.jsx` for reference implementation:
1. Check if mounted (prevent SSR issues)
2. Verify token exists in localStorage → redirect to `/login` if missing
3. Check user role from Redux state → redirect to `/` if wrong role
4. Show loading state until verification complete

**Auth Data Retrieval**:
The `/api/auth/me` endpoint returns different data based on role:
- Customers: `{_id, fullName, email, role}`
- Restaurant owners: `{_id, fullName, email, role, restaurant}` (restaurant object populated)

## Key Development Patterns

### Authentication Flow
1. User logs in → `login` thunk dispatched
2. `authService.login()` calls backend, stores token in localStorage
3. Redux state updated with `user` and `isSuccess: true`
4. `authMe` thunk should be dispatched on app mount to restore session
5. Protected routes check for token + user role before rendering

### Adding New Protected Routes
1. Create page component with `'use client'`
2. Add `isMounted` state and useEffect to set it
3. Check `localStorage.getItem('token')` → redirect to `/login` if null
4. Access `user` from `useSelector(state => state.auth)`
5. Implement role-based logic if needed
6. Show loading state while `!isMounted || !user`

### Working with Redux Slices
- Async operations use `createAsyncThunk` from Redux Toolkit
- Services layer in `app/store/services/` handles API calls
- Slices handle pending/fulfilled/rejected states
- Always check for `typeof window !== 'undefined'` before localStorage access (SSR safety)

## Common Gotchas

1. **Hydration Errors**: Always use `isMounted` pattern for client-only features (auth state, localStorage)
2. **Token Storage**: Token is stored as JSON string in localStorage, must parse: `JSON.parse(localStorage.getItem('token'))`
3. **Role Validation**: Restaurant owner routes must check both token AND user role
4. **CORS**: Backend has CORS enabled globally, frontend makes requests to `http://localhost:5000`
5. **Password Security**: Never return password from backend - use `.select('-password')` or destructure specific fields
6. **Auth State**: The `isSuccess` flag indicates operation success, not authentication status - use `user` object or `!!user` to check if authenticated

## Technology Stack

**Frontend**:
- Next.js 16 (App Router)
- React 19
- Redux Toolkit + React-Redux
- Tailwind CSS 4
- Axios for HTTP
- React Icons

**Backend**:
- Express 5
- MongoDB + Mongoose 9
- JWT (jsonwebtoken)
- bcrypt for password hashing
- CORS
- dotenv for environment variables

## Bug Corrections
- when i want to fix a bug explain to me like you explain to a beginner, don't give me a full solution but i want to learn new concepts and give me also advices for better practices

