import { privateApi } from './api';
import { Item, ItemProps, ItemSchema } from '@/app/types/item.types';
import { z } from 'zod';

const API_URL = '/items';

export const ItemService = {
  async getAll(): Promise<Item[]> {
    const res = await privateApi.get(API_URL);
    return z.array(ItemSchema).parse(res.data);
  },
  async create(form: ItemProps): Promise<Item> {
    const res = await privateApi.post(API_URL, form);
    return ItemSchema.parse(res.data);
  },
  async remove(id: string): Promise<void> {
    await privateApi.delete(`${API_URL}/${id}`);
  },
  async update(form: ItemProps, id: string): Promise<Item> {
    const res = await privateApi.put(`${API_URL}/${id}`, form);
    return ItemSchema.parse(res.data);
  },
};
