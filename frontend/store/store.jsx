import {configureStore} from '@reduxjs/toolkit';
import authSlice  from './slices/authSlice.js';
import  restaurantSlice  from './slices/restaurantSlice.js';
import itemSlice from './slices/itemsSlice.js';
import categorySlice from './slices/categorySlice.js';
import  cartSlice  from './slices/carteSlice.js';
const store = configureStore({
    reducer: {
       auth: authSlice,
       restaurant: restaurantSlice,
       items: itemSlice,
       categories: categorySlice,
       cart: cartSlice
    }
})

export default store;