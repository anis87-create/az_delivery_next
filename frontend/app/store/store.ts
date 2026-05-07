import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import authSlice from './slices/authSlice';
import { authAPI } from './services/auth';
import { restaurantAPI } from './services/restaurant';
import { itemAPI } from './services/item';
import { categoryAPI } from './services/category';
import { cartAPI } from './services/cartItems';
import { orderAPI } from './services/order';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        [authAPI.reducerPath]: authAPI.reducer,
        [restaurantAPI.reducerPath]: restaurantAPI.reducer,
        [itemAPI.reducerPath]: itemAPI.reducer,
        [categoryAPI.reducerPath]: categoryAPI.reducer,
        [cartAPI.reducerPath]: cartAPI.reducer,
        [orderAPI.reducerPath]: orderAPI.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authAPI.middleware,
            restaurantAPI.middleware,
            itemAPI.middleware,
            categoryAPI.middleware,
            cartAPI.middleware,
            orderAPI.middleware,
        ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
