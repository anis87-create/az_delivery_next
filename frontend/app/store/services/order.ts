import { privateApi } from './api';
const API_URL = `http://localhost:5000/api/orders`;
export const OrderService = {
    async getAllOrders(){
      try {
        const res =  await privateApi.get(API_URL);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
    async getOneOrder(id: string){
     try {
        const res = await privateApi.get(`${API_URL}/${id}`);
        return res.data;
     } catch (error) {
        throw error;
     }
    },
    async submitOrder(orderData){
       try {
         const res = await privateApi.post(API_URL, orderData);
         return res.data;
       } catch (error) {
        throw error;
       }
    },
    async updateStatus(id:string, status){
        try {
          const res = await privateApi.patch(`${API_URL}/${id}`, status);
          return res.data;  
        } catch (error) {
          throw error;
        }
    },
    async removeOrder(id: string){
       try {
         const res = await privateApi.delete(`${API_URL}/${id}`);
         return res.data;
       } catch (error) {
         throw error;
       }
    } 
}