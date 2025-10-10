import Topbar from "../layout/Topbar"
import NavBar from "./NavBar"

const Header = () => {
  return (
    <header className="border-b border-[#004643]">
    {/* topbar */}
    <Topbar/>
    {/* NavBar */}
    <NavBar/>
    {/* cart drawer */}
    </header>
    
  )
}

export default Header