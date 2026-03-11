import { Category, CategorySchema } from '@/app/types/category.types';
import { privateApi, publicApi } from './api';
import { z } from 'zod';

const API_URL = '/categories';

interface CategoryForm {
  name: string;
}

export const categoryService = {
  async create(form: CategoryForm): Promise<Category> {
    const res = await privateApi.post(API_URL, form);
    return CategorySchema.parse(res.data);
  },
  async getAll(id?: string): Promise<Category[]> {
    const res = id
      ? await publicApi.get(`${API_URL}?restaurantId=${id}`)
      : await privateApi.get(API_URL);
    return z.array(CategorySchema).parse(res.data);
  },
  async update(id: string, form: CategoryForm): Promise<Category> {
    const res = await privateApi.put(`${API_URL}/${id}`, form);
    return CategorySchema.parse(res.data);
  },
  async delete(id: string): Promise<void> {
    await privateApi.delete(`${API_URL}/${id}`);
  },
};
