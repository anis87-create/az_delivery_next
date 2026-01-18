import axios from 'axios';
const API_URL = 'http://localhost:5000/api/categories';
interface CategoryForm{
    name: string
}
export const categoryService = {
   async create(form: CategoryForm){
     try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
         const response = await axios.post(API_URL, form, {
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
   async update(form:CategoryForm, id:string){
    console.log('update',`${API_URL}/${id}`);
    
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const response = await axios.put(`${API_URL}/${id}`,form,  {
            headers: {
                Authorization: `Bearer ${token}`
            }
         });
         console.log(`${API_URL}/${id}`, token);
         
         return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
   }
   
}