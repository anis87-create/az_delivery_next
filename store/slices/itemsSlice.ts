import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

const itemsSlice = createSlice({
    name: 'items',
    initialState: {
        items: (() => {
            try {
                const storedItems = localStorage.getItem('items');
                return storedItems ? JSON.parse(storedItems) : [];
            } catch (error) {
                console.warn('Failed to parse items from localStorage:', error);
                return [];
            }
        })()
    },
    reducers: {
       addItem: (state, {payload}) => {
         state.items.push({
          id: uuidv4(),
          ...payload
         });
         localStorage.setItem('items', JSON.stringify(state.items));
       },
       removeItem: (state, {payload}) => {
         state.items = state.items.filter((item:any) => item.id !== payload.id);
         localStorage.setItem('items', JSON.stringify(state.items)); 
       },
       updateItem: (state, {payload}) => {
         const index = state.items.findIndex((item:any) => item.id === payload.id);
         state.items[index]= {...payload};
         localStorage.setItem('items', JSON.stringify(state.items));
       },
       resetItems: (state) => {
          state.items = [];
          localStorage.setItem('items', JSON.stringify(state.items));
       }

    }
});
export const { addItem, removeItem, updateItem, resetItems } = itemsSlice.actions;
export default itemsSlice.reducer;