import { privateApi } from './api';

const API_URL = '/cartItems';

export const cartItemService = {
    async getCartItems() {
        const response = await privateApi.get(API_URL);
        return response.data;
    },
    async addToCartItem(id: string) {
        const response = await privateApi.patch(`${API_URL}/${id}/increment`);
        return response.data;
    },
    async removeFromCartItem(id: string) {
        const response = await privateApi.patch(`${API_URL}/${id}/decrement`);
        return response.data;
    }
}
