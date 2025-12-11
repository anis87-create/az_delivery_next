import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

const getStorageItem = (key) => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
};

const initialState = {
    user:null,
    isError:null,
    isSuccess: null,
    isLoading: null,
    message:''
};
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:(state) => {
        state.isLoading = false,
        state.isSuccess = false,
        state.isError = false,
        state.message = ''
    }
});

export const {login, register, logout, reset} = authSlice.actions;

export default authSlice.reducer;