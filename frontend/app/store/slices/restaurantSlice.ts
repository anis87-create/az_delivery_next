import { BaseRestaurantInfo, RestaurantState } from "@/app/types/restaurant.types";
import { createAsyncThunk, createSlice , PayloadAction} from "@reduxjs/toolkit";
import { restaurantService } from "../services/restaurant";
const initialState:RestaurantState = {
    restaurant: null,
    isLoading: false,
    isError : false,
    message: ''
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
            console.log(error.response);
            
            const message =
           (error.response &&
             error.response.data &&
             error.response.data.message) ||
           error.message ||
           error.toString()
           console.log(message);
           
         return thunkAPI.rejectWithValue(message)
       }
});
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
    }
})

export default restaurantSlice.reducer;