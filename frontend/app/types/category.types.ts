import { z } from 'zod';

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const CategorySchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  restaurantId: z.string(),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type Category = z.infer<typeof CategorySchema>;

// ─── Form / UI Types (not API responses) ─────────────────────────────────────


export const CategoryFormSchema = z.object({
  name: z.string()
});

export type CategoryForm = z.infer<typeof CategoryFormSchema>;

export interface CategoryState {
  category: Category | null;
  isError: boolean;
  isLoading: boolean;
  categories: Category[];
  message: string;
}
