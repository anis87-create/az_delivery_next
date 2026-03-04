import { privateApi } from './api';
import { Item, ItemProps } from '@/app/types/item.types';
const API_URL = '/items';
export const  ItemService = {
    async getAll():Promise<Item[]>{
        const res =  await privateApi.get(API_URL);           
        return res.data;
    },
    async create(form: ItemProps):Promise<Item>{
        const res = await privateApi.post(API_URL, form);
        return res.data;
    },
    async remove(id:string):Promise<void>{
        await privateApi.delete(`${API_URL}/${id}`); 
    },
    async update(form:ItemProps, id:string):Promise<Item>{
        const res = await privateApi.put(`${API_URL}/${id}`, form);
        return res.data;
    }
}