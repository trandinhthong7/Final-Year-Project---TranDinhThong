import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Constants
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/checkout`;

// Helper function to get token
const getAuthToken = () => JSON.parse(localStorage.getItem("userToken"));

// Async thunk for processing checkout
export const processCheckout = createAsyncThunk(
    "checkout/processCheckout",
    async (checkoutData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                API_URL,
                checkoutData,
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

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        checkout: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCheckout: (state) => {
            state.checkout = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(processCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(processCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.checkout = action.payload;
            })
            .addCase(processCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to process checkout";
            });
    },
});

export const { clearCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
