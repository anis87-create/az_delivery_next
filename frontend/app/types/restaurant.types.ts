import { z } from 'zod';

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const ImageSchema = z.object({ name: z.string() });

export const RestaurantSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  category: z.string(),
  type: z.string(),
  street: z.string(),
  zipCode: z.string(),
  deliveryZone: z.string(),
  img: ImageSchema.optional(),
  coverImg: ImageSchema.optional(),
  tags: z.array(z.string()).optional(),
  email: z.string(),
  openingHours: z.any(),
  phone: z.string(),
  description: z.string(),
  city: z.string(),
  baseFee: z.string(),
  estimatedDeliveryTime: z.string(),
  owner: z.string(),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type Image = z.infer<typeof ImageSchema>;
export type Restaurant = z.infer<typeof RestaurantSchema>;

// ─── Form / UI Types (not API responses) ─────────────────────────────────────

export interface RestaurantFormState {
  name: string;
  img: File | null;
  coverImg: File | null;
  type: string;
  category: string;
  tags: string[];
  street: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
  description: string;
  deliveryZone: string;
}

export interface RegisterFormProps {
  onRoleChange(role: string): void;
}

export interface RestaurantState {
  restaurant: Restaurant | null;
  isError: boolean;
  isLoading: boolean;
  message: string;
  restaurants: Restaurant[];
}

export interface ImageProps {
  img: string | null;
  coverImg: string | null;
}
