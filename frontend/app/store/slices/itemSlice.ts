import { Item, ItemFormUpdate, ItemProps, itemState } from "@/app/types/item.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ItemService } from "../services/item";

const initialState: itemState = {
    isLoading: false,
    isError: false,
    message: '',
    items: []
}

export const getAllItems = createAsyncThunk<Item[], void, { rejectValue: string }>(
    'items/get',
    async (_, thunkAPI) => {
        try {
            return await ItemService.getAll();
        } catch (error) {
            const message =
                (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
                (error as Error).message ||
                String(error);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const createItem = createAsyncThunk<Item, ItemProps, { rejectValue: string }>(
    'items/post',
    async (form, thunkAPI) => {
        try {
            return await ItemService.create(form);
        } catch (error) {
            const message =
                (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
                (error as Error).message ||
                String(error);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteItem = createAsyncThunk<void, string, { rejectValue: string }>(
    'items/delete',
    async (id, thunkAPI) => {
        try {
            await ItemService.remove(id);
        } catch (error) {
            const message =
                (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
                (error as Error).message ||
                String(error);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateItem = createAsyncThunk<Item, ItemFormUpdate, { rejectValue: string }>(
    'items/put',
    async ({ itemForm, id }, thunkAPI) => {
        try {
            return await ItemService.update(itemForm, id);
        } catch (error) {
            const message =
                (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
                (error as Error).message ||
                String(error);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const itemSlice = createSlice({
    name: 'item',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getAllItems.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(getAllItems.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.isError = false;
            state.items = payload;
        })
        .addCase(getAllItems.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.items = [];
            state.message = payload ?? 'Une erreur est survenue';
        })
        .addCase(createItem.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(createItem.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.isError = false;
            state.items.push(payload);
        })
        .addCase(createItem.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.message = payload ?? 'Une erreur est survenue';
        })
        .addCase(updateItem.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(updateItem.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.isError = false;
            const index = state.items.findIndex(item => item._id === payload._id);
            state.items[index] = payload;
        })
        .addCase(updateItem.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.message = payload ?? 'Une erreur est survenue';
        })
        .addCase(deleteItem.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(deleteItem.fulfilled, (state, { meta }) => {
            state.isLoading = false;
            state.isError = false;
            state.items = state.items.filter(item => item._id !== meta.arg);
        })
        .addCase(deleteItem.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.message = payload ?? 'Une erreur est survenue';
        })
    }
});

export default itemSlice.reducer;
