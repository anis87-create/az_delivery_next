import { createApi } from '@reduxjs/toolkit/query/react';
import type { Item, ItemProps, ItemFormUpdate } from '@/app/types/item.types';
import baseQuery from './api';

export const itemAPI = createApi({
  reducerPath: 'itemApi',
  baseQuery,
  tagTypes: ['Items'],
  endpoints: (builder) => ({

    getAllItems: builder.query<Item[], void>({
      query: () => '/items',
      providesTags: ['Items'],
    }),

    createItem: builder.mutation<Item, ItemProps>({
      query: (form) => ({
        url: '/items',
        method: 'POST',
        body: form,
      }),
      invalidatesTags: ['Items'],
    }),

    updateItem: builder.mutation<Item, ItemFormUpdate>({
      query: ({ id, itemForm }) => ({
        url: `/items/${id}`,
        method: 'PUT',
        body: itemForm,
      }),
      invalidatesTags: ['Items'],
    }),

    deleteItem: builder.mutation<void, string>({
      query: (id) => ({
        url: `/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Items'],
    }),

  }),
});

export const {
  useGetAllItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemAPI;
