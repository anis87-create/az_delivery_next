import { privateApi, publicApi } from './api';

const API_URL = '/restaurants';

export const restaurantService = {
    async update(restaurantId: string, restaurantData: any) {
        const response = await privateApi.put(`${API_URL}/${restaurantId}`, restaurantData);
        return response.data;
    },
    async getAll() {
        const response = await publicApi.get(`${API_URL}/all`);
        return response.data;
    },
    async getOne(id: string) {
        const response = await publicApi.get(`${API_URL}/${id}`);
        return response.data;
    }
}
