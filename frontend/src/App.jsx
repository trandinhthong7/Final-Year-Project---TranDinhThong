
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from './components/layout/UserLayout';
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import ProductDetail from "./components/product/ProductDetail";
import Checkout from "./components/cart/CheckOut";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import MyOrderPage from "./pages/MyOrderPage";
import AdminLayout from "./components/admin/AdminLayout";

const App = () => {
  return (
    <BrowserRouter future={{v7_startTransition: true, v7_relativePath: true}}>
    <Toaster position="top-right"/>
        <Routes >
            {/* user layout */}
            <Route path="/" element={<UserLayout/>}>
              <Route index element={<Home/>}/>
              <Route path="auth" element={<Auth/>}/>
              <Route path="profile" element={<Profile/>}/>
              <Route path="collections/:collection" element={<CollectionPage/>}/>
              <Route path="product/:id" element={<ProductDetail/>}/>
              <Route path="checkout" element={<Checkout/>}/>
              <Route path="order-confirmation" element={<OrderConfirmationPage/>}/>
              <Route path="order/:id" element={<OrderDetailPage/>}/>
              <Route path="my-orders" element={<MyOrderPage/>}/>
            </Route>
            <Route path="/admin" element={<AdminLayout/>}>{/*Admin Layout*/}

            </Route>
        </Routes>
        
    </BrowserRouter>
  )
}
export default App