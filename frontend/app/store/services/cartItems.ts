import { CartItem, CartItemSchema } from '@/app/types/cartItems.types';
import { privateApi } from './api';

const API_URL = '/cartItems';

export const cartItemService = {
    async getCartItem():Promise<CartItem> {
        const res = await privateApi.get(API_URL);
        return CartItemSchema.parse(res.data);
    },
    async addToCartItem(itemId: string):Promise<CartItem> {
        const res = await privateApi.patch(`${API_URL}/${itemId}/increment`);
        return CartItemSchema.parse(res.data);
    },
    async removeFromCartItem(itemId: string):Promise<CartItem> {
        const res = await privateApi.patch(`${API_URL}/${itemId}/decrement`);
        return CartItemSchema.parse(res.data);
    },
    async clearItems():Promise<CartItem>{
       const res = await privateApi.patch(`${API_URL}/clearItems`);
       return CartItemSchema.parse(res.data);
    }
}
