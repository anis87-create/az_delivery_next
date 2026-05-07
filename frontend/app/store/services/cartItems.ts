import { createApi } from '@reduxjs/toolkit/query/react';
import { createSelector } from '@reduxjs/toolkit';
import type { CartItem } from '@/app/types/cartItems.types';
import baseQuery from './api';

export const cartAPI = createApi({
  reducerPath: 'cartApi',
  baseQuery,
  tagTypes: ['Cart'],
  endpoints: (builder) => ({

    getCartItem: builder.query<CartItem, void>({
      query: () => '/cartItems',
      providesTags: ['Cart'],
    }),

    addCartItem: builder.mutation<CartItem, string>({
      query: (itemId) => ({
        url: `/cartItems/${itemId}/increment`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Cart'],
    }),

    removeFromCartItem: builder.mutation<CartItem, string>({
      query: (itemId) => ({
        url: `/cartItems/${itemId}/decrement`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Cart'],
    }),

    clearItems: builder.mutation<CartItem, void>({
      query: () => ({
        url: '/cartItems/clearItems',
        method: 'PATCH',
      }),
      invalidatesTags: ['Cart'],
    }),

  }),
});

export const {
  useGetCartItemQuery,
  useAddCartItemMutation,
  useRemoveFromCartItemMutation,
  useClearItemsMutation,
} = cartAPI;

// ─── Selectors (basés sur le cache RTK Query) ─────────────────────────────────

const selectCartResult = cartAPI.endpoints.getCartItem.select();

export const selectCartItems = createSelector(
  selectCartResult,
  (result) => result.data?.items ?? []
);

export const selectTotalQuantityOfCartItems = createSelector(
  selectCartItems,
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);

export const getSubTotalPrice = createSelector(
  selectCartItems,
  (items) => items.reduce((total, item) => total + item.price * item.quantity, 0)
);

export const getTotalPrice = createSelector(
  selectCartItems,
  (items) =>
    items.reduce((total, item) => total + item.price * item.quantity + (item.baseFee ?? 0), 0)
);

export const getDeliveryFees = createSelector(
  selectCartItems,
  (items): { restaurantName: string; baseFee: number }[] => {
    const seen = new Map<string, { restaurantName: string; baseFee: number }>();
    for (const item of items) {
      const key = item.restaurantId ?? item.restaurantName ?? 'unknown';
      if (!seen.has(key)) {
        seen.set(key, { restaurantName: item.restaurantName ?? '', baseFee: item.baseFee ?? 0 });
      }
    }
    return Array.from(seen.values());
  }
);
