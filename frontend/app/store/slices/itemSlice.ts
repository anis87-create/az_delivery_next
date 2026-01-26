import { Item, ItemFormUpdate, ItemProps, itemState } from "@/app/types/item.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ItemService } from "../services/item";
const initialState:itemState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    items: []
}
export const getAllItems =  createAsyncThunk<Item[], void>
('items/get', 
       async () => {
     const response = await ItemService.getAll();
     console.log(response);
     
     return response.data;
});
export const createItem = createAsyncThunk<Item, ItemProps>
('items/post',
    async (form, thunkAPI) => {
      try {
        const response = await ItemService.create(form);
        return response.data;
      } catch (error: any) {
        const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
       return thunkAPI.rejectWithValue(message);
      }
    }
);

export const deleteItem = createAsyncThunk<void, string>('items/delete', async (id, thunkAPI) => {
    try {
        await ItemService.remove(id);
    } catch (error) {
        const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
       return thunkAPI.rejectWithValue(message);
    }
})

export const updateItem = createAsyncThunk<Item, ItemFormUpdate>
('items/put', 
    async ({id, itemForm}, thunkAPI) => {
   try {
     const response = await ItemService.update(itemForm, id);
     return response.data;
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

const itemSlice = createSlice({
    name:'item',
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
       builder.addCase(getAllItems.pending,(state) => {
          state.isLoading = true;
          state.isSuccess = false;
          state.isError = false;
       }),
       builder.addCase(getAllItems.fulfilled, (state, {payload}) => {
         state.isLoading = false;
         state.isSuccess = true;
         state.isError = false;
         state.items = payload;
       }),
       builder.addCase(getAllItems.rejected, (state) => {
         state.isLoading = false;
         state.isSuccess = false;
         state.isError = false;
         state.items = [];
       }),
       builder.addCase(createItem.pending , (state) => {
         state.isLoading = true;
         state.isSuccess = false;
         state.isError = false;
       }),
       builder.addCase(createItem.fulfilled, (state, {payload}) => {
         state.isLoading = false;
         state.isSuccess = false;
         state.isError = false;
         state.items.push(payload)
       }),
       builder.addCase(createItem.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = false;
        state.items = [];
       }),
       builder.addCase(updateItem.pending , (state) => {
         state.isLoading = true;
         state.isSuccess = false;
         state.isError = false;
       }),
       builder.addCase(updateItem.fulfilled, (state, {payload}) => {
         state.isLoading = false;
         state.isSuccess = false;
         state.isError = false;
         const index = state.items.findIndex(item => item._id === payload._id);
         state.items[index] === payload;
       }),
       builder.addCase(updateItem.rejected, (state) => {
         state.isLoading = false;
         state.isSuccess = false;
         state.isError = false;
         state.items = []
       }),
       builder.addCase(deleteItem.pending, (state) => {
         state.isLoading = true;
         state.isSuccess = false;
         state.isError = false;
       }),
       builder.addCase(deleteItem.fulfilled, (state, {meta}) => {
          state.isLoading = false;
         state.isSuccess = false;
         state.isError = false;
         state.items.filter(item =>  item._id !== meta.arg)
       }),
       builder.addCase(deleteItem.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
       })
    }
})

export default itemSlice.reducer;