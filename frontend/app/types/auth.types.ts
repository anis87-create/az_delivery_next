import { Restaurant, RestaurantSchema } from './restaurant.types';
import {z} from 'zod';

// Base User interface
export const UserSchema = z.object({
   _id: z.string(),
   fullName: z.string(),
   phoneNumber: z.string(),
   email: z.string(),
   address: z.string(),
   role: z.enum(['customer', 'restaurant_owner']), 
   restaurant: RestaurantSchema.optional(),
})


export type User = z.infer<typeof UserSchema>;

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
  phoneNumber?: string;
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
  isError: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  message: string;
}
