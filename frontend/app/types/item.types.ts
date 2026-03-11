import { z } from 'zod';

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const ItemSchema = z.object({
  _id: z.string(),
  categoryId: z.string(),
  restaurantId: z.string(),
  name: z.string(),
  ingredients: z.array(z.string()),
  price: z.number(),
  imageUrl: z.string(),
  isAvailable: z.boolean(),
  isPopular: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type Item = z.infer<typeof ItemSchema>;

// ─── Form / UI Types (not API responses) ─────────────────────────────────────

export interface ItemProps {
  categoryId: string;
  restaurantId: string;
  name: string;
  ingredients: string[];
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isPopular: boolean;
}

export interface itemState {
  isLoading: boolean;
  isError: boolean;
  message: string;
  items: Item[];
}

export interface ItemFormUpdate {
  itemForm: ItemProps;
  id: string;
}
