import { Restaurant } from './restaurant.types';

// Base User interface
export interface User {
  _id?: string;
  fullName: string;
  email: string;
  role: 'customer' | 'restaurant_owner';
  restaurant?: Restaurant;
}

// Login credentials (consolidated from LoginCredentials + FormState)
export interface LoginCredentials {
  email: string;
  password: string;
}

// User form state for registration
export interface UserFormState {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  address: string;
  role: string;
}

// Complete registration data sent to backend
export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role: string;
  // Restaurant fields (optional, required if role is restaurant_owner)
  name?: string;
  category?: string;
  type?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  phone?: string;
  deliveryZone?: string;
  tags?: string[];
}

// Login response from backend
export interface LoginResponse {
  user: User;
  token: string;
}

// Auth Redux state
export interface AuthState {
  user: User | null;
  isError: boolean | null;
  isAuthenticated: boolean;
  isLoading: boolean | null;
  message: string;
}


