import { createSlice, current } from "@reduxjs/toolkit";

/**
 * Redux slice for managing shopping cart state
 * Handles cart items, quantities, and localStorage persistence
 */

const isClient = typeof window !== 'undefined';
const cartFromStorage = isClient ? localStorage.getItem('cartItems') : null;
const totalWithFeesFromStorage = isClient ? localStorage.getItem('totalWithFees') : null;
const subTotalPriceFromStorage = isClient ? localStorage.getItem('subTotalPrice') : null;
export const cartSlice = createSlice({
    name:'cart',
    initialState: {
       // Load cart items from localStorage with error handling
       cartItems: (() => {
         try {
           return cartFromStorage ? [JSON.parse(cartFromStorage)] : []
         } catch {
           return [];
         }
       }
      )(),
      // Load subtotal from localStorage
      subTotalPrice: (() => {
        const stored = subTotalPriceFromStorage;
        return stored ? Number(stored) : 0;
      })(),
      // Load total with fees from localStorage
      totalWithFees: (() => {
        try {
          return totalWithFeesFromStorage ? JSON.parse(totalWithFeesFromStorage) : {
            subtotal: 0,
            total: 0
          };
        } catch {
          return {
            subtotal: 0,
            total: 0
          };
        }
      })()
    },
    reducers: {
       addToCart : (state, { payload }) => {
            state.cartItems.push(payload);
            // Persist to localStorage
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
       },
       updateQuantity: (state, {payload}) => {
           const itemFound = state.cartItems.find((item) => item.id === payload.id);
           if (itemFound) {
               itemFound.quantity = payload?.quantity;
               // Persist to localStorage
               localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
           }
       },
       deleteItem : (state, { payload }) => {
          state.cartItems = state.cartItems.filter(item => item.id !== payload.id);
          // Persist to localStorage
          localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
       },
       resetCart: (state) => {
            // Clear localStorage
            localStorage.setItem('cartItems', JSON.stringify([]));
            localStorage.setItem('subTotalPrice', '0');
            localStorage.setItem('totalWithFees', JSON.stringify({
              subtotal: 0,
              total: 0
            }));
            // Reset state
            state.cartItems = [];
            state.subTotalPrice = 0;
            state.totalWithFees = {
              subtotal: 0,
              total: 0
            };
        },
        getSubTotalPrice: (state) => {
          const sum = state.cartItems?.reduce((total, item) => total + ((item.price * item.quantity)), 0);          
          state.subTotalPrice = sum;      
          // Persist subtotal to localStorage
          localStorage.setItem('subTotalPrice', String(state.subTotalPrice));
        },
        getTotalPriceWithFees: (state, {payload}) => {
          const { restaurants } = payload;
          
          // Calculate subtotal (price without fees)
          const subtotal = state.cartItems?.reduce((total, item) => total + ((item.price * item.quantity)), 0);
          
          // Group items by restaurant
          const itemsByRestaurant = state.cartItems.reduce((acc, item) => {
            if (!acc[item.restaurantId]) {
              acc[item.restaurantId] = [];
            }
            acc[item.restaurantId].push(item);
            return acc;
          }, {});
          
          let totalWithAllFees = 0;
          
          // Calculate total for each restaurant including fees
          Object.keys(itemsByRestaurant).forEach(restaurantId => {
            const restaurant = restaurants.find((r) => r.id === Number(restaurantId));
            const restaurantItems = itemsByRestaurant[restaurantId];
            const restaurantSubtotal = restaurantItems.reduce((total, item) => total + (item.price * item.quantity), 0);
            
            const deliveryFee = Number(restaurant?.deliverySettings?.baseFee) || 0;
            
            // Add restaurant total with fees
            totalWithAllFees += restaurantSubtotal + deliveryFee;
          });
          
          state.totalWithFees = {
            subtotal,
            total: totalWithAllFees
          };
          
          // Persist to localStorage
          localStorage.setItem('totalWithFees', JSON.stringify(state.totalWithFees));
        }
    }
});

export const { addToCart, updateQuantity, resetCart, deleteItem, getSubTotalPrice, getTotalPriceWithFees } = cartSlice.actions;

export default cartSlice.reducer;