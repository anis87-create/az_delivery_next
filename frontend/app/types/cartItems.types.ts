import { Item } from './item.types';

export type CartEntry = Item & { quantity: number };

export interface CartItemState {
    cartItem: CartItem | null;
    isLoading: boolean;
    isError: boolean;
}

export interface CartItem {
    _id: string;
    items: CartEntry[];
    restaurantId: string;
    userId: string;
}
