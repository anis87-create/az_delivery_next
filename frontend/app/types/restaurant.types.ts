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
  baseFee: z.number(),
  estimatedDeliveryTime: z.string(),
  owner: z.string(),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type Image = z.infer<typeof ImageSchema>;
export type Restaurant = z.infer<typeof RestaurantSchema>;

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
