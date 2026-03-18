import { Restaurant, RestaurantDetail, RestaurantState } from "@/app/types/restaurant.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { restaurantService } from "../services/restaurant";

const initialState: RestaurantState = {
    restaurant: null,
    isLoading: false,
    isError: false,
    message: '',
    restaurants: [],
};

export const updateRestaurantInfo = createAsyncThunk<void, { id: string, form: FormData }, { rejectValue: string }>(
    'restaurant/update',
    async ({ id, form }, thunkAPI) => {
        try {
            const minDelay = new Promise(resolve => setTimeout(resolve, 3000));
            const [userData] = await Promise.all([
                restaurantService.update(id, form),
                minDelay
            ]);

            return userData;
        } catch (error) {
            const message =
                (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
                (error as Error).message ||
                String(error);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getAllRestaurants = createAsyncThunk<Restaurant[], void, { rejectValue: string }>(
    'restaurant/get',
    async (_, thunkAPI) => {
        try {
            return await restaurantService.getAll();
        } catch (error) {
            const message =
                (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
                (error as Error).message ||
                String(error);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getOneRestaurant = createAsyncThunk<RestaurantDetail, string, { rejectValue: string }>(
    'restaurant/getOne',
    async (id, thunkAPI) => {
        try {
            return await restaurantService.getOne(id);
        } catch (error) {
            const message =
                (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
                (error as Error).message ||
                String(error);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(updateRestaurantInfo.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(updateRestaurantInfo.fulfilled, (state) => {
            state.isLoading = false;
            state.isError = false;
        })
        .addCase(updateRestaurantInfo.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.message = payload ?? 'Une erreur est survenue';
        })
        .addCase(getAllRestaurants.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(getAllRestaurants.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.isError = false;
            state.restaurants = payload;
        })
        .addCase(getAllRestaurants.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.restaurants = [];
            state.message = payload ?? 'Une erreur est survenue';
        })
        .addCase(getOneRestaurant.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(getOneRestaurant.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.isError = false;
            state.restaurant = payload;
        })
        .addCase(getOneRestaurant.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.message = payload ?? 'Une erreur est survenue';
        })
    }
});

export default restaurantSlice.reducer;
