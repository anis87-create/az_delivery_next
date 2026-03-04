import { Category } from '@/app/types/category.types';
import { privateApi, publicApi } from './api';
const API_URL = '/categories';
interface CategoryForm{
    name: string
}
export const categoryService = {
    async create(form: CategoryForm):Promise<Category>{
        const res = await privateApi.post(API_URL, form);
        return res.data;
    },
    async getAll(id?:string):Promise<Category[]>{
        let res = null;
        if(id){
            res = await publicApi.get(API_URL+`?restaurantId=${id}`);
        }else {
            res = await privateApi.get(API_URL);
        }
        return res.data;
    },
    async update(id:string , form:CategoryForm):Promise<Category>{
        const res = await privateApi.put(`${API_URL}/${id}`, form);
        return res.data;
    },
    async delete(id: string): Promise<void>{
        await privateApi.delete(`${API_URL}/${id}`);
    }
}
