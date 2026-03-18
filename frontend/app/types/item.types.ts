import { z } from 'zod';

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const ItemSchema = z.object({
  _id: z.string(),
  categoryId: z.string(),
  restaurantId: z.string(),
  name: z.string(),
  ingredients: z.array(z.string()).catch([]),
  price: z.number(),
  imageUrl: z.string().catch(''),
  isAvailable: z.boolean().catch(true),
  isPopular: z.boolean().catch(false),
  createdAt: z.string().catch(''),
  updatedAt: z.string().catch(''),
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
