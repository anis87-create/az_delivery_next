import { Restaurant, RestaurantSchema } from './restaurant.types';
import {z} from 'zod';

// Base User interface
export const UserSchema = z.object({
   _id: z.string(),
   fullName: z.string(),
   phoneNumber: z.string(),
   email: z.string(),
   address: z.string(),
   city: z.string().optional(),
   zipCode: z.string().optional(),
   role: z.enum(['customer', 'restaurant_owner']),
   restaurant: RestaurantSchema.optional(),
})


export type User = z.infer<typeof UserSchema>;

// Login credentials (consolidated from LoginCredentials + FormState)


export const LoginCredentialsSchema = z.object({
  email: z.string(),
  password: z.string()
})
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;
// User form state for registration
export const UserFormStateSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional(),
  address: z.string(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  role: z.string(),
});
export type UserFormState = z.infer<typeof UserFormStateSchema>;

// Complete registration data sent to backend
export const RegisterDataSchema = z.object({
  id: z.string().optional(),
  fullName: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  role: z.string(),
  // Restaurant fields (optional, required if role is restaurant_owner)
  img: z.string().nullable().optional(),
  coverImg: z.string().nullable().optional(),
  name: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  restaurantEmail: z.string().optional(),
  description: z.string().optional(),
  deliveryZone: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
export type RegisterData = z.infer<typeof RegisterDataSchema>;

// Login response from backend
export const LoginResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// Auth Redux state
export interface AuthState {
  user: User | null;
  isError: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  message: string;
}
