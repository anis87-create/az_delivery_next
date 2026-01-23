import axios from 'axios';
import { privateApi } from './api';
const API_URL = 'http://localhost:5000/api/categories';
interface CategoryForm{
    name: string
}
export const categoryService = {
    async create(form: CategoryForm){                                                                         
    try {                                                                                                                                                                                                                                                                                                                          
       const response = await privateApi.post(API_URL, form);                                                                                                                                                                                                                                
       return response.data;                                                                                
    } catch (error) {                                                                                       
       console.log('Service: ERREUR:', error);                                                              
       throw error;                                                                                         
    }                                                                                                       
  },    
   async getAll(){
    try {
         const response = await privateApi.get(API_URL); 
         return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
   },
   async update(id:string , form:CategoryForm){
    try {
              
        const response = await privateApi.put(`${API_URL}/${id}`, form); 
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }

   
   },
   async delete (id: string){
    try {
        await privateApi.delete(`${API_URL}/${id}`);
    } catch (error) {
         console.log(error);
         throw error;
    }
   }  
}