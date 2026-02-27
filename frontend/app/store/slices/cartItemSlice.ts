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

export const addCartItem = createAsyncThunk<CartItem, string>(
    'cartItems/add',
    async (id, thunkAPI) => {
        try {
            const response = await cartItemService.addToCartItem(id);
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
export const clearItems = createAsyncThunk<CartItem, string>('cartItems/clearItems', async(userId, thunkAPI) => {
     try {
        const response = await cartItemService.clearItems(userId);
        return response; 
     } catch (error) {
        const message =
                (error.response?.data?.message) ||
                error.message ||
                error.toString();
            console.log(message);
            
            return thunkAPI.rejectWithValue(message);
     }
});


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
            })
            .addCase(clearItems.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(clearItems.fulfilled, (state, {payload}) => {
                state.isLoading = false;
                state.isError = false;
                state.cartItem = payload;
            })
            .addCase(clearItems.rejected, (state, {payload}) => {
                state.isLoading = false;
                state.isError = false;
            });
    }
});

export const selectCartItems = (state: {cartItem: CartItemState}) =>  state.cartItem.cartItem?.items ??  [];

export const selectTotalQuantityOfCartItems = (state: { cartItem: CartItemState }) => {
    return state.cartItem.cartItem?.items.reduce((total, currentItem) => {
        return total + currentItem.quantity;
    }, 0) ?? 0;
};
export const getSubTotalPrice = (state: {cartItem: CartItemState}) => {
    return state?.cartItem?.cartItem?.items?.reduce((total, currentItem) => total + ((currentItem.price*currentItem.quantity) + currentItem.baseFee), 0) ?? 0;
}

export const getDeliveryFees = (state: { cartItem: CartItemState }): { restaurantName: string; baseFee: number }[] => {
    const items = state.cartItem.cartItem?.items ?? [];
    const seen = new Map<string, { restaurantName: string; baseFee: number }>();
    for (const item of items) {
        const key = item.restaurantId ?? item.restaurantName ?? 'unknown';
        if (!seen.has(key)) {
            seen.set(key, { restaurantName: item.restaurantName ?? '', baseFee: item.baseFee ?? 0 });
        }
    }
    return Array.from(seen.values());
};
export default cartItemSlice.reducer;
