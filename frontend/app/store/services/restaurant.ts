import { createApi } from '@reduxjs/toolkit/query/react';
import type { Restaurant, RestaurantDetail } from '@/app/types/restaurant.types';
import baseQuery from './api';

export const restaurantAPI = createApi({
  reducerPath: 'restaurantApi',
  baseQuery,
  tagTypes: ['Restaurants', 'Restaurant'],
  endpoints: (builder) => ({

    getAllRestaurants: builder.query<Restaurant[], void>({
      query: () => '/restaurants/all',
      providesTags: ['Restaurants'],
    }),

    getOneRestaurant: builder.query<RestaurantDetail, string>({
      query: (id) => `/restaurants/${id}`,
      providesTags: (_, __, id) => [{ type: 'Restaurant', id }],
    }),

    updateRestaurantInfo: builder.mutation<void, { id: string; form: FormData }>({
      query: ({ id, form }) => ({
        url: `/restaurants/${id}`,
        method: 'PUT',
        body: form,
      }),
      invalidatesTags: (_, __, { id }) => ['Restaurants', { type: 'Restaurant', id }],
    }),

  }),
});

export const {
  useGetAllRestaurantsQuery,
  useGetOneRestaurantQuery,
  useUpdateRestaurantInfoMutation,
} = restaurantAPI;
