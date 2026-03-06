import { CartItem, CartItemState } from "@/app/types/cartItems.types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartItemService } from "../services/cartItems";

const initialState: CartItemState = {
    cartItem: null,
    isLoading: false,
    isError: false,
    message:''
}

export const getCartItem = createAsyncThunk<CartItem | null, void, {rejectValue: string}>(
    'cartItems/get',
    async (_, thunkAPI) => {
        try {
            return await cartItemService.getCartItem() ?? null;
        } catch (error: any) {
             const message =
          (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
          (error as Error).message ||
          String(error);
         return thunkAPI.rejectWithValue(message);
        }
    }
);

export const addCartItem = createAsyncThunk<CartItem, string, {rejectValue: string}>(
    'cartItems/add',
    async (id, thunkAPI) => {
        try {
            return await cartItemService.addToCartItem(id);
        } catch (error: any) {
             const message =
          (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
          (error as Error).message ||
          String(error);
      return thunkAPI.rejectWithValue(message);
        }
    }
);

export const removeFromCartItem = createAsyncThunk<CartItem, string, {rejectValue: string}>(
    'cartItems/remove',
    async (id, thunkAPI) => {
        try {
            return await cartItemService.removeFromCartItem(id);
        } catch (error: any) {
            const message =
          (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
          (error as Error).message ||
          String(error);
      return thunkAPI.rejectWithValue(message);
        }
    }
);
export const clearItems = createAsyncThunk<CartItem, string, {rejectValue: string}>('cartItems/clearItems', async(userId, thunkAPI) => {
     try {
     return await cartItemService.clearItems(userId);
    
     } catch (error: any) {
        const message =
          (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
          (error as Error).message ||
          String(error);
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
            .addCase(getCartItem.rejected, (state,{payload} ) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload ?? 'Une erreur est survenue';
            })
            .addCase(addCartItem.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(addCartItem.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.cartItem = payload;
            })
            .addCase(addCartItem.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload ?? 'Une erreur est survenue';
            })
            .addCase(removeFromCartItem.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(removeFromCartItem.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.cartItem = payload;
            })
            .addCase(removeFromCartItem.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload ?? 'Une erreur est survenue';
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
                state.isError = true;
                state.message = payload ?? 'Une erreur est survenue';
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
