
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from './components/layout/UserLayout';
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";

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
            </Route>
            <Route>{/*Admin Layout*/}</Route>
        </Routes>
        
    </BrowserRouter>
  )
}
export default App