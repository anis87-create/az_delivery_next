import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

interface Restaurant {
    name: '',
    img: null,
    coverImg: null,
    type: '',
    category: '',
    tags: [],
    restaurantAddress: '',
    restaurantStreet: '',
    restaurantCity: '',
    restaurantZipCode: '',
    restaurantPhone: '',
    restaurantDescription: '',
    // Business info fields
    deliveryZone: '',
    ownerId:''
}
const isClient = typeof window !== 'undefined';
const restaurantsFromStorage: string | null = isClient ? localStorage.getItem('restaurants') : null;

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
        createRestaurant: (state, {payload}) => {
            // Ajouter l'ID du propriétaire au restaurant
            const restaurantWithOwner = {
                ...payload,
                id: Date.now(), // ID unique pour le restaurant
                ownerId: payload.ownerId || null, // ID du propriétaire
                openingHours: payload.openingHours || null, // Horaires d'ouverture
                paymentSettings: {
                    acceptCash: true,
                    acceptCard: true,
                    acceptMobilePayment: false,
                    minimumOrderAmount: 0
                },
                deliverySettings: {
                    baseFee: 3 // Frais de livraison fixes
                },
                createdAt: new Date().toISOString()
            };
            state.restaurants.push(restaurantWithOwner);
            localStorage.setItem('restaurants', JSON.stringify(state.restaurants));
        },
        resetRestaurants: (state) => {
            state.restaurants = [];
            localStorage.setItem('restaurants', JSON.stringify([]));
        },
        updateRestaurant: (state, {payload}) => {
           const index = state.restaurants.findIndex((restaurant:Restaurant) => restaurant.name === payload.name); 
           state.restaurants[index] = {
              ...payload
           }

           localStorage.setItem('restaurants', JSON.stringify(state.restaurants));
        },
    },
})

export const { createRestaurant, resetRestaurants, updateRestaurant } = restaurantSlice.actions;

// Selector pour obtenir les restaurants d'un propriétaire
export const getRestaurantsByOwner = (state:any, ownerId:string) => {   
 return   state.restaurant.restaurants.find((restaurant:Restaurant) => restaurant.ownerId === ownerId) || null;
}   

export default restaurantSlice.reducer;