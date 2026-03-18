import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import { authService } from "../services/auth";
import type { User, LoginCredentials, RegisterData, LoginResponse, AuthState } from '@/app/types';

const initialState: AuthState = {
    user: null,
    isError: false,
    isAuthenticated: false,
    isLoading: false,
    message: '',
};

export const register = createAsyncThunk<User, RegisterData, { rejectValue: string }>(
  'auth/register',
  async(user, thunkAPI) => {
    try {
       return await authService.register(user)
    } catch (error) {
      const message =
        (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
        (error as Error).message ||
        String(error);
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const login = createAsyncThunk<LoginResponse, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async(user, thunkAPI) => {
    try {
        const minDelay = new Promise(resolve => setTimeout(resolve, 1000));
        const [userData] = await Promise.all([
            authService.login(user),
            minDelay
        ]);

        return userData;
    } catch (error) {
      const message =
        (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
        (error as Error).message ||
        String(error);
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const authMe = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/authme',
  async(_, thunkAPI) => {
    try {
        return await authService.getAuthenticatedUser();
    } catch (error) {
      const message =
        (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
        (error as Error).message ||
        String(error);
      return thunkAPI.rejectWithValue(message)
    }
  }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        logout: (state) => {
            state.isLoading = false,
            state.isAuthenticated = false,
            state.isError = false,
            state.message = '',
            state.user = null,
            localStorage.removeItem('token');
        }
    },
    extraReducers:(builder) => {
        builder.addCase(register.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(register.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = payload;
        })
        .addCase(register.rejected, (state, {payload}) => {
            state.isError = true;
            state.message = payload ?? 'Une erreur est survenue';
            state.user = null;
            state.isLoading = false;
        })
        .addCase(login.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = payload.user;
        })
        .addCase(login.rejected, (state, {payload}) => {
            state.isError = true;
            state.message = payload ?? 'Une erreur est survenue';
            state.user = null;
            state.isLoading = false;
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
            state.isLoading = false;
            state.message = payload ?? 'Une erreur est survenue';
            state.user = null;
            state.isAuthenticated = false;
        })
    }
});

export const {logout} = authSlice.actions;

export default authSlice.reducer;
