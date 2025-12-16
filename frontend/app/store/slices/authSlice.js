import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { authService } from "../services/auth";
const getStorageItem = (key) => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
};
const user = getStorageItem('user');
const initialState = {
    user:user? user:null,
    isError:null,
    isSuccess: null,
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
        return await authService.login(user)
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
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:(state) => {
        state.isLoading = false,
        state.isSuccess = false,
        state.isError = false,
        state.message = ''
    },
    extraReducers:(builder) => {
        builder.addCase(register.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(register.fulfilled, (state, {payload}) => {
            state.isLoading= false;
            state.isSuccess = true;
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
            state.isSuccess = true;
            state.user = payload;
        })
        .addCase(login.rejected, (state, {payload}) => {
            state.isError = true;
            state.message = payload;
            state.user = null;
        })
    }
});

export const {reset} = authSlice.actions;

export default authSlice.reducer;