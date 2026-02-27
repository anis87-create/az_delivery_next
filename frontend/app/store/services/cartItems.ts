import { privateApi } from './api';

const API_URL = '/cartItems';

export const cartItemService = {
    async getCartItems() {
        const response = await privateApi.get(API_URL);
        return response.data;
    },
    async addToCartItem(itemId: string) {
        const response = await privateApi.patch(`${API_URL}/${itemId}/increment`);
        return response.data;
    },
    async removeFromCartItem(itemId: string) {
        const response = await privateApi.patch(`${API_URL}/${itemId}/decrement`);
        return response.data;
    },
    async clearItems(userId: string){
       const response = await privateApi.patch(`${API_URL}/${userId}/clearItems`);
       return response.data; 
    }
}
