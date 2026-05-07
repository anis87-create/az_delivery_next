import { createApi } from '@reduxjs/toolkit/query/react';
import type { Order, OrderProps, OrderStatus } from '@/app/types/order.types';
import baseQuery from './api';

export const orderAPI = createApi({
  reducerPath: 'orderApi',
  baseQuery,
  tagTypes: ['Orders', 'Order'],
  endpoints: (builder) => ({

    getAllOrders: builder.query<Order[], void>({
      query: () => '/orders/all',
      providesTags: ['Orders'],
    }),

    getOrderByUserId: builder.query<Order[], void>({
      query: () => '/orders',
      providesTags: ['Orders'],
    }),

    getOneOrder: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_, __, id) => [{ type: 'Order', id }],
    }),

    addOrder: builder.mutation<Order, OrderProps>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Orders'],
    }),

    updateOrder: builder.mutation<Order, { id: string; status: OrderStatus }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_, __, { id }) => ['Orders', { type: 'Order', id }],
    }),

    deleteOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => ['Orders', { type: 'Order', id }],
    }),

  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderByUserIdQuery,
  useGetOneOrderQuery,
  useAddOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderAPI;
