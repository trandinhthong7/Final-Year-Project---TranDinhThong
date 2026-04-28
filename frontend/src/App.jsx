import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import UserLayout from './components/layout/UserLayout';
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import GlovePage from "./pages/GlovePage";
import AccessoriesPage from "./pages/AccessoriesPage";
import ProductDetail from "./components/product/ProductDetail";
import Checkout from "./components/cart/CheckOut";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import MyOrderPage from "./pages/MyOrderPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import UserManagement from "./components/admin/UserManagement";
import ProductManagement from "./components/admin/ProductManagement";
import EditProductPage from "./components/admin/EditProductPage";
import OrderManagement from "./components/admin/OrderManagement";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AddressPage from "./pages/AddressPage";

import {Provider} from "react-redux";
import store from "./redux/store";
import { setupAxiosInterceptors } from "./utils/axiosInterceptor";
import { checkTokenExpiration } from "./redux/slices/authSlice";

// Setup axios interceptors
setupAxiosInterceptors(store);

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// Token expiration checker component
function TokenExpirationChecker() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Check token expiration every 5 minutes
    const interval = setInterval(() => {
      dispatch(checkTokenExpiration());
    }, 5 * 60 * 1000); // 5 minutes
    
    // Check immediately on mount
    dispatch(checkTokenExpiration());
    
    return () => clearInterval(interval);
  }, [dispatch]);
  
  return null;
}

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter future={{v7_startTransition: true, v7_relativePath: true}}>
        <ScrollToTop />
        <TokenExpirationChecker />
        <Toaster position="top-right"/>
        <Routes >
            {/* user layout */}
            <Route path="/" element={<UserLayout/>}>
              <Route index element={<Home/>}/>
              <Route path="auth" element={<Auth/>}/>
              <Route path="profile" element={<Profile/>}/>
              <Route path="collections/boots" element={<CollectionPage/>}/>
              <Route path="collections/gloves" element={<GlovePage/>}/>
              <Route path="collections/accessories" element={<AccessoriesPage/>}/>
              <Route path="product/:id" element={<ProductDetail/>}/>
              <Route path="checkout" element={<ProtectedRoute><Checkout/></ProtectedRoute>}/>
              <Route path="order-confirmation/:id" element={<ProtectedRoute><OrderConfirmationPage/></ProtectedRoute>}/>
              <Route path="order/:id" element={<ProtectedRoute><OrderDetailPage/></ProtectedRoute>}/>
              <Route path="my-orders" element={<ProtectedRoute><MyOrderPage/></ProtectedRoute>}/>
              <Route path="my-addresses" element={<ProtectedRoute><AddressPage/></ProtectedRoute>}/>
            </Route>
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminLayout/></ProtectedRoute>}>{/*Admin Layout*/}
              <Route index element={<AdminHomePage/>}/>
              <Route path="users" element={<UserManagement/>}/>
              <Route path="products" element={<ProductManagement/>}/>
              <Route path="products/new" element={<EditProductPage/>}/>
              <Route path="products/:id/edit" element={<EditProductPage/>}/>
              <Route path="orders" element={<OrderManagement/>}/>
              <Route path="orders/:id" element={<OrderDetailPage/>}/>
            </Route>
        </Routes>
        
    </BrowserRouter>
    </Provider>
  );
} 
export default App