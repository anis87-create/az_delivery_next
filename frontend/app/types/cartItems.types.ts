import { ItemSchema } from './item.types';
import {z} from 'zod';

export const CartEntrySchema = ItemSchema.omit({
    categoryId: true,
    restaurantId: true
}).extend({
    quantity: z.number(),
    restaurantName: z.string().optional(),                                                                  
    restaurantId: z.string().optional(),  // re-ajouté en optional                                          
    baseFee: z.number().optional(),    
})


export interface CartItemState {
    cartItem: CartItem | null;
    isLoading: boolean;
    isError: boolean;
    message: string
}



export const CartItemSchema = z.object({
    _id: z.string(),
    items: z.array(CartEntrySchema),
    userId: z.string()
});
export type CartEntry = z.infer<typeof CartEntrySchema>;
export type CartItem  = z.infer<typeof CartItemSchema>;