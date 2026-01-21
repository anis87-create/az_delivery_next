import axios from 'axios';
import { privateApi } from './api';
const API_URL = 'http://localhost:5000/api/categories';
interface CategoryForm{
    name: string
}
export const categoryService = {
    async create(form: CategoryForm){                                                                         
    try {                                                                                                                                                            
       const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;                                                                                                                                                                 
       const response = await privateApi.post(API_URL, form);                                                                                                  
                                                                                                                                               
       return response.data;                                                                                
    } catch (error) {                                                                                       
       console.log('Service: ERREUR:', error);                                                              
       throw error;                                                                                         
    }                                                                                                       
  },    
   async getAll(){
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
         const response = await axios.get(API_URL,  {
            headers: {
                Authorization: `Bearer ${token}`
            }
         });
         return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
   },
   async update(id:string , form:CategoryForm){
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const response = await axios.put(`${API_URL}/${id}`,form,  {
            headers: {
                Authorization: `Bearer ${token}`
            }
         });         

         return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }

   
   },
   async delete (id: string){
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        await axios.delete(`${API_URL}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    } catch (error) {
         console.log(error);
         throw error;
    }
   }  
}