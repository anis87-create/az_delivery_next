import { Order, OrderProps, OrderState, OrderStatus } from "@/app/types/order.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { OrderService } from "../services/order";

const initialState:OrderState = {
    orders: [],
    order: null,
    isLoading: false,
    isError: false,
    message: ''
}

export const getAllOrders =  createAsyncThunk<Order[],void, {rejectValue: string}>('orders/getAll', async (_, thunkAPI) => {
    try {
        return await OrderService.getAllOrders();
    } catch (error) {
         const message =
          (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
          (error as Error).message ||
          String(error);
      return thunkAPI.rejectWithValue(message);
    }
});

export const getOrderByUserId = createAsyncThunk<Order[], void, {rejectValue: string}>('orders/getOneOrderByUserId', async(_, thunkAPI) => {
  try {
    return await OrderService.getOrderByUserId();
  } catch (error) {
    const message =
          (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
          (error as Error).message ||
          String(error);
      return thunkAPI.rejectWithValue(message);
  }
});

export const getOneOrder = createAsyncThunk<Order, string, {rejectValue: string} >('orders/getOne', async(id, thunkAPI) => {
    try {
        return await OrderService.getOneOrder(id);
    } catch (error) {
         const message =
          (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
          (error as Error).message ||
          String(error);
      return thunkAPI.rejectWithValue(message);
    }
});

export const addOrder = createAsyncThunk<Order, OrderProps,{rejectValue: string}>('orders/create', async(orderData, thunkAPI)=> {
    try {
        return await OrderService.submitOrder(orderData);
    } catch (error) {
        const message =
          (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
          (error as Error).message ||
          String(error);
      return thunkAPI.rejectWithValue(message);
    }
});

export const updateOrder = createAsyncThunk<Order, {id: string; status: OrderStatus}, {rejectValue: string}>('orders/updateStatus', async({id, status}, thunkAPI) => {
    try {
        return await OrderService.updateStatus(id, status);
    } catch (error) {
        const message =
          (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
          (error as Error).message ||
          String(error);
      return thunkAPI.rejectWithValue(message);
    }
});

export const deleteOrder = createAsyncThunk<void, string, {rejectValue: string}>('orders/delete', async(id, thunkAPI) => {
    try {
        return await OrderService.removeOrder(id);
    } catch (error) {
        const message =
          (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ||
          (error as Error).message ||
          String(error);
      return thunkAPI.rejectWithValue(message);
    }
});

const orderSlice = createSlice({
    name:'order',
    initialState,
    reducers: {},
    extraReducers:(builder)=> {
      builder.addCase(getAllOrders.pending, (state)=> {
        state.orders = [];
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllOrders.fulfilled, (state, {payload}) => {
        state.orders = payload;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(getAllOrders.rejected, (state, {payload}) => {
        state.orders = [];
        state.isLoading = false;
        state.isError = true;
        state.message = payload ?? 'Une erreur est survenue';
      })
      .addCase(getOrderByUserId.pending, (state, {payload}) => {
        state.order = payload;
        state.isLoading = true;
        state.isError  = false;
      })
      .addCase(getOrderByUserId.fulfilled, (state, {payload}) => {
        state.orders  = payload;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(getOrderByUserId.rejected, (state) => {
        state.order = null;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(getOneOrder.pending, (state) => {
        state.order = null;
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getOneOrder.fulfilled, (state, {payload}) => {
        state.order = payload;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(getOneOrder.rejected, (state, {payload}) => {
        state.order = null;
        state.isLoading = false;
        state.isError = true;
        state.message = payload ?? 'Une erreur est survenue';
      })
      .addCase(addOrder.pending, (state) => {
        state.order = null;
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(addOrder.fulfilled, (state, {payload}) => {
        state.order = payload;
        state.orders.push(payload);
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(addOrder.rejected, (state, {payload}) => {
        state.order = null;
        state.isLoading = false;
        state.isError = true;
        state.message = payload ?? 'Une erreur est survenue';
      })
      .addCase(updateOrder.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateOrder.fulfilled, (state, {payload}) => {
        state.order = payload;
        state.orders = state.orders.map(o => o._id === payload._id ? payload : o);
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(updateOrder.rejected, (state, {payload}) => {
        state.isLoading = false;
        state.isError = true;
        state.message = payload ?? 'Une erreur est survenue';
      })
      .addCase(deleteOrder.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteOrder.fulfilled, (state, {meta}) => {
        state.orders = state.orders.filter(o => o._id!== meta.arg);
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(deleteOrder.rejected, (state, {payload}) => {
        state.isLoading = false;
        state.isError = true;
        state.message = payload ?? 'Une erreur est survenue';
      })
    }
});



export default orderSlice.reducer;