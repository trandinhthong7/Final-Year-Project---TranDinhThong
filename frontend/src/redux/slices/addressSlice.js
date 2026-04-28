import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Constants
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/addresses`;

// Helper function to get token
const getAuthToken = () => JSON.parse(localStorage.getItem("userToken"));

// Fetch all addresses
export const fetchAddresses = createAsyncThunk(
    "address/fetchAddresses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`
                }
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

// Create new address
export const createAddress = createAsyncThunk(
    "address/createAddress",
    async (addressData, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, addressData, {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                    "Content-Type": "application/json"
                }
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

// Update address
export const updateAddress = createAsyncThunk(
    "address/updateAddress",
    async ({ id, addressData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, addressData, {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                    "Content-Type": "application/json"
                }
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

// Delete address
export const deleteAddress = createAsyncThunk(
    "address/deleteAddress",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`
                }
            });
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

// Set default address
export const setDefaultAddress = createAsyncThunk(
    "address/setDefaultAddress",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/${id}/set-default`, {}, {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`
                }
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

const addressSlice = createSlice({
    name: "address",
    initialState: {
        addresses: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch addresses
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch addresses";
            })
            // Create address
            .addCase(createAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses.push(action.payload);
            })
            .addCase(createAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create address";
            })
            // Update address
            .addCase(updateAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.addresses.findIndex(addr => addr._id === action.payload._id);
                if (index !== -1) {
                    state.addresses[index] = action.payload;
                }
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update address";
            })
            // Delete address
            .addCase(deleteAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = state.addresses.filter(addr => addr._id !== action.payload);
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete address";
            })
            // Set default address
            .addCase(setDefaultAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(setDefaultAddress.fulfilled, (state, action) => {
                state.loading = false;
                // Unset all defaults
                state.addresses.forEach(addr => {
                    addr.isDefault = false;
                });
                // Set the new default
                const index = state.addresses.findIndex(addr => addr._id === action.payload._id);
                if (index !== -1) {
                    state.addresses[index] = action.payload;
                }
            })
            .addCase(setDefaultAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to set default address";
            });
    },
});

export const { clearError } = addressSlice.actions;
export default addressSlice.reducer;
