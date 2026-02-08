import { BaseRestaurantInfo, Restaurant, RestaurantState } from "@/app/types/restaurant.types";
import { createAsyncThunk, createSlice , PayloadAction} from "@reduxjs/toolkit";
import { restaurantService } from "../services/restaurant";
const initialState:RestaurantState = {
    restaurant: null,
    isLoading: false,
    isError : false,
    message: '',
    restaurants: [],
};

export  const updateRestaurantInfo = createAsyncThunk<void, {id: string, form: FormData}>('restaurant/update', async({id, form}, thunkAPI) => {
   try {
           const minDelay = new Promise(resolve => setTimeout(resolve, 3000));
           const [userData] = await Promise.all([
               restaurantService.update(id, form),
               minDelay
           ]);
   
           return userData;
       } catch (error: any) {
            
            const message =
           (error.response &&
             error.response.data &&
             error.response.data.message) ||
           error.message ||
           error.toString()
           
         return thunkAPI.rejectWithValue(message)
       }
});

export const getAllRestaurants = createAsyncThunk<Restaurant[], void> ('restaurant/get', async (_, thunkAPI) => {
    try {
        const response = await restaurantService.getAll();
        return response;
    } catch (error: any) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getOneRestaurant = createAsyncThunk<Restaurant, string>('restaurant/getOne', async(id, thunkAPI) => {
  try {
           const minDelay = new Promise(resolve => setTimeout(resolve, 3000));
           const [restaurantData] = await Promise.all([
               restaurantService.getOne(id),
               minDelay
           ]);
   
           return restaurantData;
       } catch (error: any) {
            
            const message =
           (error.response &&
             error.response.data &&
             error.response.data.message) ||
           error.message ||
           error.toString()
           
         return thunkAPI.rejectWithValue(message)
       }
})
export const restaurantSlice = createSlice({
    name:'restaurant',
    initialState,
    reducers:{},
    extraReducers:(builder) => {
         builder.addCase(updateRestaurantInfo.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(updateRestaurantInfo.fulfilled, (state) => {
            state.isLoading = false;
            state.isError = false;
         })
         .addCase(updateRestaurantInfo.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.isError = true;
            state.message = payload as string || 'An error occurred';
         })
         .addCase(getAllRestaurants.pending, (state) => {
            state.isLoading = true;
         })
         .addCase(getAllRestaurants.fulfilled, (state, {payload})=> {
            state.isLoading = false;
            state.isError = false;
            state.restaurants = payload;
         })
         .addCase(getAllRestaurants.rejected, (state,{payload}) => {
            state.isLoading = false;
            state.isError = false,
            state.restaurants = []
         })
         .addCase(getOneRestaurant.pending, (state, {payload}) => {
            state.isLoading = true;
         })
         .addCase(getOneRestaurant.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.isError = false;
            state.restaurant = payload;
         })
         .addCase(getOneRestaurant.rejected, (state, {payload}) => {
            state.isLoading = false;
         })
    }
})

export default restaurantSlice.reducer;