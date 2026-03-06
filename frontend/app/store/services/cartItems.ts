import { CartItem } from '@/app/types/cartItems.types';
import { privateApi } from './api';

const API_URL = '/cartItems';

export const cartItemService = {
    async getCartItem():Promise<CartItem> {
        const res = await privateApi.get(API_URL);
        return res.data;
    },
    async addToCartItem(itemId: string):Promise<CartItem> {
        const res = await privateApi.patch(`${API_URL}/${itemId}/increment`);
        return res.data;
    },
    async removeFromCartItem(itemId: string):Promise<CartItem> {
        const res = await privateApi.patch(`${API_URL}/${itemId}/decrement`);
        return res.data;
    },
    async clearItems(userId: string):Promise<CartItem>{
       const res = await privateApi.patch(`${API_URL}/${userId}/clearItems`);
       return res.data; 
    }
}
