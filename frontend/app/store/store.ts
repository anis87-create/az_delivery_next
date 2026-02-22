import {configureStore} from '@reduxjs/toolkit';
import authSlice  from './slices/authSlice';
import  restaurantSlice  from './slices/restaurantSlice';
import itemSlice from './slices/itemSlice';
import categorySlice from './slices/categorySlice';
import cartItemSlice from './slices/cartItemSlice';

export const store = configureStore({
    reducer: {
       auth: authSlice,
       restaurant: restaurantSlice,
       items: itemSlice,
       categories: categorySlice,
       cartItem: cartItemSlice
    }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof  store.dispatch;

export default store;