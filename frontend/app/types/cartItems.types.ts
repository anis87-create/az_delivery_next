import { Item } from './item.types';

export type CartEntry = Omit<Item, 'categoryId' | 'restaurantId'> & { quantity: number; restaurantName?: string; restaurantId?: string; baseFee?: number };

export interface CartItemState {
    cartItem: CartItem | null;
    isLoading: boolean;
    isError: boolean;
}

export interface CartItem {
    _id: string;
    items: CartEntry[];
    userId: string;
}
