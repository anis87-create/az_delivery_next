import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CategoryState, Category, CategoryForm } from "@/app/types/category.types";
import { categoryService } from "../services/category";

interface CategoryProps {
   id: string
   name: CategoryForm,
}
const initialState:CategoryState = {
    category: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    categories: []
} 
export const createCateogry = createAsyncThunk<Category, CategoryForm>(
  'categories/create',
  async(formData, thunkAPI) => {
    try {
      const response = await categoryService.create(formData);
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
  }
);

export const getAllCategories = createAsyncThunk<Category[], void>(
  "categories/get",
  async () => {
   const response =  await categoryService.getAll();   
   return response;
  }
);

export const updateCategory = createAsyncThunk<Category, CategoryProps>('categories/put', async ({id, name}, thunkAPI) => {  
  try {     
      const response = await categoryService.update(name, id);
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


const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
    },
    extraReducers: (builder) =>{
        builder.addCase(createCateogry.pending, state => {
            state.isLoading = true,
            state.isError = false,
            state.isSuccess = false
        })
        .addCase(createCateogry.fulfilled, (state, {payload}) => {
            state.isLoading = false,
            state.category = payload,
            state.isError = false,
            state.isSuccess = true
        })
        .addCase(createCateogry.rejected, (state, {payload}) => {
            state.isLoading = false,
            state.isError = true,
            state.isSuccess = false
        })
        .addCase(getAllCategories.pending, state => {
          state.isLoading = true;
          state.isError = false;
          state.isSuccess = false;
        })
        .addCase(getAllCategories.fulfilled, (state, {payload}) => {
          state.isLoading = true;
          state.isError = false;
          state.isSuccess = false;
          state.categories = payload;
        })
        .addCase(getAllCategories.rejected, (state, {payload}) => {
          state.isLoading = true;
          state.isError = false;
          state.isSuccess = false;
          state.categories =  []
        })
        .addCase(updateCategory.pending, (state) => {
          state.isLoading = true;
          state.isError = false;
          state.isSuccess = false;  
        })
        .addCase(updateCategory.fulfilled, (state) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
        })
        .addCase(updateCategory.rejected, (state) => {
          state.isLoading= false;
          state.isError = true;
        })
        ;
    }
}
);

export default categorySlice.reducer;