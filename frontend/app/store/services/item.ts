import axios from 'axios';
import { privateApi } from './api';
const API_URL = 'http://localhost:5000/api/items';
export const  ItemService = {
    async getAll(){
        try {
           const response =  await privateApi.get(API_URL);
           return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    async create(){
        try {
          const response = await privateApi.post(API_URL);
          return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    async remove(id:string){
        try {
           await privateApi.delete(`${API_URL}/${id}`); 
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    async update(form, id){
        try {
            const response = await privateApi.put(`${API_URL}/${id}`, form);
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}