import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CategoryState, Category, CategoryForm } from "@/app/types/category.types";
import { categoryService } from "../services/category";

interface CategoryProps {
   id: string
   formData: CategoryForm,
}

const initialState: CategoryState = {
    category: null,
    isLoading: false,
    isError: false,
    categories: [],
    message: ''
}

export const createCateogry = createAsyncThunk<Category, CategoryForm, { rejectValue: string }>(
    'categories/create',
    async (formData, thunkAPI) => {
        try {
            return await categoryService.create(formData);
        } catch (error) {
            const message =
                (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
                (error as Error).message ||
                String(error);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getAllCategories = createAsyncThunk<Category[], string | undefined, { rejectValue: string }>(
    "categories/get",
    async (restaurantId, thunkAPI) => {
        try {
            return await categoryService.getAll(restaurantId);
        } catch (error) {
            const message =
                (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
                (error as Error).message ||
                String(error);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateCategory = createAsyncThunk<Category, CategoryProps, { rejectValue: string }>(
    'categories/put',
    async ({ id, formData }, thunkAPI) => {
        try {
            return await categoryService.update(id, formData);
        } catch (error) {
            const message =
                (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
                (error as Error).message ||
                String(error);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteCategory = createAsyncThunk<void, string, { rejectValue: string }>(
    'categories/delete',
    async (id, thunkAPI) => {
        try {
            await categoryService.delete(id);
        } catch (error) {
            const message =
                (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
                (error as Error).message ||
                String(error);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createCateogry.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(createCateogry.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.isError = false;
            state.category = payload;
            state.categories.push(payload);
        })
        .addCase(createCateogry.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.message = payload ?? 'Une erreur est survenue';
        })
        .addCase(getAllCategories.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(getAllCategories.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.isError = false;
            state.categories = payload;
        })
        .addCase(getAllCategories.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.categories = [];
            state.message = payload ?? 'Une erreur est survenue';
        })
        .addCase(updateCategory.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(updateCategory.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.isError = false;
            const index = state.categories.findIndex(category => category._id === payload._id);
            state.categories[index] = payload;
        })
        .addCase(updateCategory.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.message = payload ?? 'Une erreur est survenue';
        })
        .addCase(deleteCategory.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(deleteCategory.fulfilled, (state, { meta }) => {
            state.isLoading = false;
            state.isError = false;
            state.categories = state.categories.filter(category => category._id !== meta.arg);
        })
        .addCase(deleteCategory.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.message = payload ?? 'Une erreur est survenue';
        });
    }
});

export default categorySlice.reducer;
