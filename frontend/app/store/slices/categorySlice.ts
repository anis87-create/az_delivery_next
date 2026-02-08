import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CategoryState, Category, CategoryForm } from "@/app/types/category.types";
import { categoryService } from "../services/category";

interface CategoryProps {
   id: string
   formData: CategoryForm,
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

export const getAllCategories = createAsyncThunk<Category[], void>(
  "categories/get",
  async () => {
   const response =  await categoryService.getAll();   
   return response.data;
  }
);

export const updateCategory = createAsyncThunk<Category, CategoryProps>('categories/put', async ({id, formData}, thunkAPI) => {  
  try {     
      const response = await categoryService.update(id, formData);
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

export const deleteCategory = createAsyncThunk<void, string>('categories/delete', async (id, thunkAPI) => {
   try {
     await categoryService.delete(id);
   } catch (error) {
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
            state.isSuccess = true,
            state.categories.push(payload);
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
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;          
          state.categories = payload;
        })
        .addCase(getAllCategories.rejected, (state, {payload}) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;
          state.categories =  []
        })
        .addCase(updateCategory.pending, (state) => {
          state.isLoading = true;
          state.isError = false;
          state.isSuccess = false;  
        })
        .addCase(updateCategory.fulfilled, (state, {payload}) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          const index = state.categories.findIndex(category => category._id === payload._id);
          state.categories[index] = payload;
        })
        .addCase(updateCategory.rejected, (state) => {
          state.isLoading= false;
          state.isError = true;
        })
        .addCase(deleteCategory.pending, (state) => {
          state.isLoading = true;
          state.isError = false;
          state.isSuccess = false;  
        })
        .addCase(deleteCategory.fulfilled, (state, {meta}) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.categories = state.categories.filter(category =>  category._id !== meta.arg)
        })
        .addCase(deleteCategory.rejected, (state) => {
          state.isLoading= false;
          state.isError = true; 
        })
        ;
    }
}
);

export default categorySlice.reducer;