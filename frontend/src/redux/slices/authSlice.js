import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

// Retrieves user info from localStorage if available
const userFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

// Check for an existing guestId in localStorage or generate a new one
const initialGuestId = localStorage.getItem("guestId") ||`guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

// Helper function to check if token is expired
const isTokenExpired = () => {
    const token = localStorage.getItem("userToken");
    if (!token) return true;
    
    try {
        const parsedToken = JSON.parse(token);
        const decoded = jwtDecode(parsedToken);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        console.error("Error decoding token:", error);
        return true;
    }
};

// Check if token is expired on initialization
if (userFromStorage && isTokenExpired()) {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userToken");
}

// Inital state
const initialState = {
    userInfo: isTokenExpired() ? null : userFromStorage,
    guestId: initialGuestId,
    loading: false,
    error: null,
};

// Async thunk for user login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, userData);
            localStorage.setItem("userToken", JSON.stringify(response.data.token));
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
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

// Async thunk for user registration
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, userData);
            localStorage.setItem("userToken", JSON.stringify(response.data.token));
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
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

// Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.userInfo = null;
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userToken");
            localStorage.setItem("guestId", state.guestId);
        },
        generateNewGuestId: (state) => {
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId", state.guestId);
        },
        checkTokenExpiration: (state) => {
            if (isTokenExpired()) {
                state.userInfo = null;
                localStorage.removeItem("userInfo");
                localStorage.removeItem("userToken");
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload.user;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Registration failed";
            });
    },
});

export const { logout, generateNewGuestId, checkTokenExpiration } = authSlice.actions;
export default authSlice.reducer;