import { z } from 'zod';
import { ItemSchema } from './item.types';

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const RestaurantSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  category: z.string(),
  type: z.string().optional(),
  street: z.string(),
  zipCode: z.string(),
  deliveryZone: z.string().optional(),
  img: z.string().optional(),
  coverImg: z.string().optional(),
  tags: z.array(z.string()).optional(),
  email: z.string(),
  openingHours: z.any().optional(),
  phone: z.string(),
  description: z.string().optional(),
  city: z.string(),
  baseFee: z.number(),
  estimatedDeliveryTime: z.string().optional(),
  owner: z.string(),
});

export const RestaurantDetailSchema = z.object({
  restaurant: RestaurantSchema,
  items: z.array(ItemSchema),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type Restaurant = z.infer<typeof RestaurantSchema>;
export type RestaurantDetail = z.infer<typeof RestaurantDetailSchema>;

// ─── Form / UI Types (not API responses) ─────────────────────────────────────

export const RestaurantFormStateSchema = z.object({
  name: z.string(),
  img: z.instanceof(File).nullable(),
  coverImg: z.instanceof(File).nullable(),
  type: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  street: z.string(),
  city: z.string(),
  zipCode: z.string(),
  phone: z.string(),
  email: z.string(),
  description: z.string(),
  deliveryZone: z.string(),
});
export type RestaurantFormState = z.infer<typeof RestaurantFormStateSchema>;

export interface RegisterFormProps {
  onRoleChange(role: string): void;
}

export interface RestaurantState {
  restaurant: RestaurantDetail | null;
  isError: boolean;
  isLoading: boolean;
  message: string;
  restaurants: Restaurant[];
}

export interface ImageProps {
  img: string | null;
  coverImg: string | null;
}
