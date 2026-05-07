import { createApi } from '@reduxjs/toolkit/query/react';
import type { Category, CategoryForm } from '@/app/types/category.types';
import baseQuery from './api';

export const categoryAPI = createApi({
  reducerPath: 'categoryApi',
  baseQuery,
  tagTypes: ['Categories'],
  endpoints: (builder) => ({

    getAllCategories: builder.query<Category[], string | undefined>({
      query: (restaurantId) =>
        restaurantId ? `/categories?restaurantId=${restaurantId}` : '/categories',
      providesTags: ['Categories'],
    }),

    createCategory: builder.mutation<Category, CategoryForm>({
      query: (form) => ({
        url: '/categories',
        method: 'POST',
        body: form,
      }),
      invalidatesTags: ['Categories'],
    }),

    updateCategory: builder.mutation<Category, { id: string; formData: CategoryForm }>({
      query: ({ id, formData }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Categories'],
    }),

    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),

  }),
});

export const {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryAPI;
