
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from './components/layout/UserLayout';


const App = () => {
  return (
    <BrowserRouter>
        <Routes >
            {/* user layout */}
            <Route path="/" element={<UserLayout/>}></Route>
            
        </Routes>
        
    </BrowserRouter>
  )
}
export default App