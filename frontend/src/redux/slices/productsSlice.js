import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Constants
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/products`;

// Async thunk to fetch products with filters
export const fetchProductsByFilter = createAsyncThunk(
    "products/fetchProductsByFilter",
    async ({
        category,
        brand,
        size,
        color,
        age,
        maxPrice,
        minPrice,
        material,
        player,
        outsole,
        accessoryType,
        gloveSize,
        tags,
        isNewCollection,
        isBestSeller,
        isDeal,
        sortBy,
        order,
        searchQuery,
        page = 1,
        limit = 8
    }, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL, {
                params: {
                    category,
                    brand,
                    size,
                    color,
                    age,
                    maxPrice,
                    minPrice,
                    material,
                    player,
                    outsole,
                    accessoryType,
                    gloveSize,
                    tags,
                    isNewCollection,
                    isBestSeller,
                    isDeal,
                    sortBy,
                    order,
                    searchQuery,
                    page,
                    limit
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

// Async thunk to fetch single product by ID
export const fetchProductById = createAsyncThunk(
    "products/fetchProductById",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/${productId}`);
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

// Async thunk to fetch related products
export const fetchRelatedProducts = createAsyncThunk(
    "products/fetchRelatedProducts",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/${productId}/related`);
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

// Async thunk to fetch featured products (deals, new, bestsellers)
export const fetchFeaturedProducts = createAsyncThunk(
    "products/fetchFeaturedProducts",
    async (type, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/featured/${type}`);
            return { type, products: response.data };
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

// Async thunk to fetch most popular products based on sales
export const fetchMostPopularProducts = createAsyncThunk(
    "products/fetchMostPopularProducts",
    async (limit = 6, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/most-popular`, {
                params: { limit }
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

// Initial state
const initialState = {
    products: [],
    currentProduct: null,
    relatedProducts: [],
    mostPopularProducts: [],
    featuredProducts: {
        deals: [],
        new: [],
        bestsellers: []
    },
    totalPages: 1,
    currentPage: 1,
    totalProducts: 0,
    loading: false,
    error: null,
};

// Slice
const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearProducts: (state) => {
            state.products = [];
            state.totalPages = 1;
            state.currentPage = 1;
            state.totalProducts = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch products by filter
            .addCase(fetchProductsByFilter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsByFilter.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products || action.payload;
                state.totalPages = action.payload.totalPages || 1;
                state.currentPage = action.payload.currentPage || 1;
                state.totalProducts = action.payload.totalProducts || 0;
            })
            .addCase(fetchProductsByFilter.rejected, (state, action) => {
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
            // Fetch related products
            .addCase(fetchRelatedProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.relatedProducts = action.payload;
            })
            .addCase(fetchRelatedProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch related products";
            })
            // Fetch featured products
            .addCase(fetchFeaturedProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
                state.loading = false;
                const { type, products } = action.payload;
                state.featuredProducts[type] = products;
            })
            .addCase(fetchFeaturedProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch featured products";
            })
            // Fetch most popular products
            .addCase(fetchMostPopularProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMostPopularProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.mostPopularProducts = action.payload;
            })
            .addCase(fetchMostPopularProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch most popular products";
            });
    },
});

export const { clearCurrentProduct, clearError, clearProducts } = productsSlice.actions;
export default productsSlice.reducer;