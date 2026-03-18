import { RestaurantDetailSchema, RestaurantSchema } from '@/app/types/restaurant.types';
import { privateApi, publicApi } from './api';
import {z} from 'zod';
const API_URL = '/restaurants';

export const restaurantService = {
    async update(restaurantId: string, restaurantData: any) {
        const response = await privateApi.put(`${API_URL}/${restaurantId}`, restaurantData);
        return RestaurantSchema.parse(response.data);
    },
    async getAll() {
        const response = await publicApi.get(`${API_URL}/all`);
        return z.array(RestaurantSchema).parse(response.data);
    },
    async getOne(id: string) {
        const response = await publicApi.get(`${API_URL}/${id}`);
        return RestaurantDetailSchema.parse(response.data);
    }
}
