import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";

// Constants
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`;

// Helper function to get token
const getAuthToken = () => JSON.parse(localStorage.getItem("userToken"));

// Fetch all orders (admin)
export const fetchAllOrders = createAsyncThunk(
    "adminOrders/fetchAllOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

// Update order status (admin)
export const updateOrderStatus = createAsyncThunk(
    "adminOrders/updateOrderStatus",
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL}/${orderId}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

// Delete order (admin)
export const deleteOrder = createAsyncThunk(
    "adminOrders/deleteOrder",
    async (orderId, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            });
            return orderId;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

// Initial state
const initialState = {
    orders: [],
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    loading: false,
    error: null,
};

// Slice
const adminOrderSlice = createSlice({
    name: "adminOrders",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all orders
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                
                // Calculate statistics
                state.totalOrders = action.payload.length;
                state.totalRevenue = action.payload.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
                state.pendingOrders = action.payload.filter(order => order.status === "Pending").length;
                state.processingOrders = action.payload.filter(order => order.status === "Processing").length;
                state.shippedOrders = action.payload.filter(order => order.status === "Shipped").length;
                state.deliveredOrders = action.payload.filter(order => order.status === "Delivered").length;
                state.cancelledOrders = action.payload.filter(order => order.status === "Cancelled").length;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch orders";
            })
            // Update order status
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.orders.findIndex(order => order._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                    
                    // Recalculate statistics after update
                    state.totalRevenue = state.orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
                    state.pendingOrders = state.orders.filter(order => order.status === "Pending").length;
                    state.processingOrders = state.orders.filter(order => order.status === "Processing").length;
                    state.shippedOrders = state.orders.filter(order => order.status === "Shipped").length;
                    state.deliveredOrders = state.orders.filter(order => order.status === "Delivered").length;
                    state.cancelledOrders = state.orders.filter(order => order.status === "Cancelled").length;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update order status";
            })
            // Delete order
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.filter(order => order._id !== action.payload);
                
                // Recalculate statistics after delete
                state.totalOrders = state.orders.length;
                state.totalRevenue = state.orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
                state.pendingOrders = state.orders.filter(order => order.status === "Pending").length;
                state.processingOrders = state.orders.filter(order => order.status === "Processing").length;
                state.shippedOrders = state.orders.filter(order => order.status === "Shipped").length;
                state.deliveredOrders = state.orders.filter(order => order.status === "Delivered").length;
                state.cancelledOrders = state.orders.filter(order => order.status === "Cancelled").length;
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete order";
            });
    },
});

export const { clearError } = adminOrderSlice.actions;

// Memoized Selectors
const selectAllOrders = (state) => state.adminOrders.orders;

export const selectRecentOrders = createSelector(
    [selectAllOrders],
    (orders) => orders.slice(0, 5) // Get 5 most recent orders
);

export default adminOrderSlice.reducer;
