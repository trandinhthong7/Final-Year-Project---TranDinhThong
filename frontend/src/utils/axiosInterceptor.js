import axios from "axios";
import { logout } from "../redux/slices/authSlice";
import { toast } from "sonner";

let store;

// Initialize the interceptor with the Redux store
export const setupAxiosInterceptors = (reduxStore) => {
    store = reduxStore;

    // Response interceptor to handle token expiration
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            // Check if error is due to token expiration
            if (error.response?.status === 401) {
                const errorMessage = error.response?.data?.message;
                const isExpired = error.response?.data?.expired;

                if (isExpired || errorMessage === "Token expired") {
                    console.log("Token expired, logging out user");
                    
                    // Dispatch logout action
                    if (store) {
                        store.dispatch(logout());
                    }
                    
                    // Show notification
                    toast.error("Your session has expired. Please login again.");
                    
                    // Redirect to login page
                    window.location.href = "/auth";
                }
            }
            
            return Promise.reject(error);
        }
    );
};
