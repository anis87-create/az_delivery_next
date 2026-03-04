import { Order, OrderProps,  OrderStatus } from '@/app/types/order.types';
import { privateApi } from './api';
const API_URL = `/orders`;
export const OrderService = {
    async getAllOrders():Promise<Order[]>{
        const res =  await privateApi.get(API_URL);
        return res.data;
    },
    async getOneOrder(id: string):Promise<Order>{
        const res = await privateApi.get(`${API_URL}/${id}`);
        return res.data;
    },
    async submitOrder(orderData: OrderProps):Promise<Order>{
         const res = await privateApi.post(API_URL, orderData);
         return res.data;
    },
    async updateStatus(id:string, status: OrderStatus):Promise<Order>{
          const res = await privateApi.patch(`${API_URL}/${id}`, status);
          return res.data;  
    },
    async removeOrder(id: string):Promise<void>{
         const res = await privateApi.delete(`${API_URL}/${id}`);
         return res.data;
    } 
}