import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

const isClient = typeof window !== 'undefined';
const restaurantsFromStorage = isClient ? localStorage.getItem('restaurants') : null;

const storedItems = (() => {
    try {
        return restaurantsFromStorage && restaurantsFromStorage !== 'null' && restaurantsFromStorage !== '"null"' ? JSON.parse(restaurantsFromStorage) : [];
    } catch (error) {
        console.warn('Failed to parse restaurants from localStorage:', error);
        // Clear corrupted data
        //localStorage.removeItem('restaurants');
        return [];
    }
})();

const initialState = {
    restaurants: storedItems
}
const  restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        resetRestaurants: (state) => {
            state.restaurants = [];
            localStorage.setItem('restaurants', JSON.stringify([]));
        },
        updateRestaurant: (state, {payload}) => {
           const index = state.restaurants.findIndex((restaurant) => restaurant.name === payload.name);
           state.restaurants[index] = {
              ...payload
           }

           localStorage.setItem('restaurants', JSON.stringify(state.restaurants));
        },
    },
})

export const { createRestaurant, resetRestaurants, updateRestaurant } = restaurantSlice.actions;

// Selector pour obtenir les restaurants d'un propriétaire
export const getRestaurantsByOwner = (state, ownerId) => {
 return   state.restaurant.restaurants.find((restaurant) => restaurant.ownerId === ownerId) || null;
}

export default restaurantSlice.reducer;