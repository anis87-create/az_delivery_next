import { CartItem, CartItemState } from "@/app/types/cartItems.types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartItemService } from "../services/cartItems";

const initialState: CartItemState = {
    cartItem: null,
    isLoading: false,
    isError: false,
}

export const getCartItem = createAsyncThunk<CartItem | null, void>(
    'cartItems/get',
    async (_, thunkAPI) => {
        try {
            const cartItem = await cartItemService.getCartItems();
            return cartItem ?? null;
        } catch (error: any) {
            const message =
                (error.response?.data?.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

interface AddCartItemPayload {
    id: string;
    restaurantId: string;
}

export const addCartItem = createAsyncThunk<CartItem, AddCartItemPayload>(
    'cartItems/add',
    async ({ id, restaurantId }, thunkAPI) => {
        try {
            const response = await cartItemService.addToCartItem(id, restaurantId);
            return response;
        } catch (error: any) {
            const message =
                (error.response?.data?.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const removeFromCartItem = createAsyncThunk<CartItem, string>(
    'cartItems/remove',
    async (id, thunkAPI) => {
        try {
            const response = await cartItemService.removeFromCartItem(id);
            return response;
        } catch (error: any) {
            const message =
                (error.response?.data?.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const cartItemSlice = createSlice({
    name: 'cartItems',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCartItem.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getCartItem.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.cartItem = payload;
            })
            .addCase(getCartItem.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(addCartItem.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(addCartItem.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.cartItem = payload;
            })
            .addCase(addCartItem.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(removeFromCartItem.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(removeFromCartItem.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.cartItem = payload;
            })
            .addCase(removeFromCartItem.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            });
    }
});

export const selectTotalQuantityOfCartItems = (state: { cartItem: CartItemState }) => {
    return state.cartItem.cartItem?.items.reduce((total, currentItem) => {
        return total + currentItem.quantity;
    }, 0) ?? 0;
};

export default cartItemSlice.reducer;
