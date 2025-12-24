import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { authService } from "../services/auth";
const getStorageItem = (key) => {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
};
const token = getStorageItem('token');
const initialState = {
    user: null,
    isError:null,
    isAuthenticated: false,
    isLoading: null,
    message:''
};
export const register = createAsyncThunk('auth/register', async(user, thunkAPI)=> {
    try {
       return await authService.register(user)
    } catch (error) {
         const message =
        (error.response &&
          error.response.data &&
          error.response.data.msg) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
})

export const login = createAsyncThunk('auth/login', async(user, thunkAPI)=> {
    try {
        const minDelay = new Promise(resolve => setTimeout(resolve, 3000));
        const [userData] = await Promise.all([
            authService.login(user),
            minDelay
        ]);

        return userData;
    } catch (error) {
         const message =
        (error.response &&
          error.response.data &&
          error.response.data.msg) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
})

export const authMe = createAsyncThunk('auth/authme', async(user, thunkAPI) => {
    try {
        // Create a minimum delay promise of 3 seconds
        const minDelay = new Promise(resolve => setTimeout(resolve, 3000));

        // Wait for both the API call and the minimum delay
        const [userData] = await Promise.all([
            authService.getAuthenticatedUser(),
            minDelay
        ]);

        return userData;
    } catch (error) {
          const message =
        (error.response &&
          error.response.data &&
          error.response.data.msg) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
});
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        logout: (state) => {
            state.isLoading = false,
            state.isAuthenticated = false,
            state.isError = false,
            state.message = '',
            state.user =null,
            localStorage.removeItem('token');
        }
    },
    extraReducers:(builder) => {
        builder.addCase(register.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(register.fulfilled, (state, {payload}) => {
            state.isLoading= false;
            state.isAuthenticated = false;
            state.user = payload;
        })
        .addCase(register.rejected, (state, {payload}) => {
            state.isError = true;
            state.message = payload;
            state.user = null;
        })
        .addCase(login.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, {payload}) => {
            state.isLoading= false;
            state.isAuthenticated = true;
            state.user = payload.user;
        })
        .addCase(login.rejected, (state, {payload}) => {
            state.isError = true;
            state.message = payload;
            state.user = null;
        })
        .addCase(authMe.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(authMe.fulfilled , (state, {payload}) => {
            state.user = payload;
            state.isAuthenticated = true;
            state.isLoading = false
        })
        .addCase(authMe.rejected, (state, {payload}) => {
            state.isError = true;
            state.message =  payload;
            state.user = null;
            state.isAuthenticated = false;
        })
    }
});

export const {logout} = authSlice.actions;

export default authSlice.reducer;