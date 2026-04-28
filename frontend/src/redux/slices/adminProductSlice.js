import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Constants
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/admin/products`;

// Helper function to get token (called each time to get fresh token)
const getAuthToken = () => JSON.parse(localStorage.getItem("userToken"));

// Async thunk to fetch all products (Admin)
export const fetchAllProducts = createAsyncThunk(
    "adminProducts/fetchAllProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                API_URL,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`
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

// Async thunk to fetch a single product by ID (Admin)
export const fetchProductById = createAsyncThunk(
    "adminProducts/fetchProductById",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`
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

// Async thunk to create a new product (Admin)
export const createProduct = createAsyncThunk(
    "adminProducts/createProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                API_URL,
                productData,
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

// Async thunk to update a product (Admin)
export const updateProduct = createAsyncThunk(
    "adminProducts/updateProduct",
    async ({ productId, productData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL}/${productId}`,
                productData,
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

// Async thunk to delete a product (Admin)
export const deleteProduct = createAsyncThunk(
    "adminProducts/deleteProduct",
    async (productId, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${API_URL}/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`
                    }
                }
            );
            return productId;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

// Async thunk to update product stock (Admin)
export const updateProductStock = createAsyncThunk(
    "adminProducts/updateProductStock",
    async ({ productId, stockData }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${API_URL}/${productId}/stock`,
                stockData,
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

// Initial state
const initialState = {
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
};

// Slice
const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all products
            .addCase(fetchAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch products";
            })
            // Fetch product by ID
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch product";
            })
            // Create product
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create product";
            })
            // Update product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update product";
            })
            // Delete product
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete product";
            })
            // Update product stock
            .addCase(updateProductStock.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProductStock.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateProductStock.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update stock";
            });
    },
});

export const { clearError } = adminProductSlice.actions;
export default adminProductSlice.reducer;
