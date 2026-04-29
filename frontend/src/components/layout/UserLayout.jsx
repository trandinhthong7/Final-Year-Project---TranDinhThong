import { Outlet } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import ChatWidget from "../../chat/ChatWidget";

const UserLayout = () => {
    return (<>
        {/* Header  */}
        <Header/>
        {/* main content */}
        <main>
            <Outlet/>
        </main>
        {/* Footer */}
        <Footer/>
        <ChatWidget />
    
    
    
    </>)
}

export default UserLayout;