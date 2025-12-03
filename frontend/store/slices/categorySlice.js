import { createSlice } from "@reduxjs/toolkit";
const isClient = typeof window !== 'undefined';
const categoryFromStorage = isClient ? localStorage.getItem('categories') : null;
const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories:  categoryFromStorage ? [JSON.parse(categoryFromStorage)] : []
    },
    reducers: {
        addCategory: (state, {payload}) => {
            state.categories.push(payload);
            localStorage.setItem('categories', JSON.stringify(state.categories));
        },
        findCategoryById: (state, payload) => {
          return state.categories.find(category => category.id ===  payload); 
        },
        resetCategory : (state) => {
            state.categories = [];
            localStorage.setItem('categories', JSON.stringify(state.categories));
    }
}
});
export const { addCategory, resetCategory, findCategoryById } = categorySlice.actions;
export default categorySlice.reducer;