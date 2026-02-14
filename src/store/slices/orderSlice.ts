import { Order } from "@/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { client } from "@/../client";

interface OrdersState {
  items: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  currentOrder: null,
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk("order/fetchOrders", async () => {
  const orders = await client.fetch(`*[_type == "order"]`);
  return orders;
});

export const fetchOrderByNumber = createAsyncThunk<Order | null, string>(
  "order/fetchOrderByNumber",
  async (orderNumber, { rejectWithValue }) => {
    try {
      const order = await client.fetch(
        `*[_type == "order" && orderNumber == $orderNumber][0]`,
        { orderNumber },
      );
      return order ?? null;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch order");
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders";
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {} = orderSlice.actions;
export default orderSlice.reducer;
export type { OrdersState };