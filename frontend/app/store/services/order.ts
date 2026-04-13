import { Order, OrderProps,  OrderSchema,  OrderStatus } from '@/app/types/order.types';
import { privateApi } from './api';
import {z} from 'zod';
const API_URL = `/orders`;
export const OrderService = {
    async getAllOrders():Promise<Order[]>{
        const res =  await privateApi.get(`${API_URL}/all`);
        return  z.array(OrderSchema).parse(res.data);
    },
    async getOneOrder(id: string):Promise<Order>{
        const res = await privateApi.get(`${API_URL}/${id}`);
        return OrderSchema.parse(res.data);
    },
    async getOrderByUserId():Promise<Order[]>{
        const res = await privateApi.get(API_URL);
        return z.array(OrderSchema).parse(res.data);
    },
    async submitOrder(orderData: OrderProps):Promise<Order>{
         const res = await privateApi.post(API_URL, orderData);
         return OrderSchema.parse(res.data);
    },
    async updateStatus(id:string, status: OrderStatus):Promise<Order>{
          const res = await privateApi.patch(`${API_URL}/${id}`, {status});
          return OrderSchema.parse(res.data);  
    },
    async removeOrder(id: string):Promise<void>{
         await privateApi.delete(`${API_URL}/${id}`);
    } 
}