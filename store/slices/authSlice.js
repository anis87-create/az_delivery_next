import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

const getStorageItem = (key) => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
};

const initialState = {
    users: JSON.parse(getStorageItem('users') ?? '[]'),
    currentUser: JSON.parse(getStorageItem('currentUser') ?? 'null'),
    isAuth: Boolean(getStorageItem('currentUser')),
};
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login:(state, action) => {
           let foundUser = state.users.find(user => user.email === action.payload.email);
           if(foundUser){
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            state.currentUser = foundUser;
            state.isAuth = true;
           } else {
            state.isAuth = false;
           }
        },
        register: (state, action) => {
           const newUser =  {
               created_at: new Date().toISOString(),
               ...action.payload
           };
           state.users = [...state.users, newUser];
           state.isAuth = false;
           localStorage.setItem('users', JSON.stringify(state.users));
        },
        logout:(state) => {
            state.isAuth = false;
            localStorage.removeItem('currentUser');
        },
        reset: (state) => {
            state.users = [];
            state.currentUser = null;
            state.isAuth = false;
            localStorage.setItem('users', JSON.stringify(state.users));
        }
    }
});

export const {login, register, logout, reset} = authSlice.actions;

export default authSlice.reducer;