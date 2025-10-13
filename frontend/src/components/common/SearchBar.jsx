import { useState } from "react"
import { FaSearch, FaTimes } from "react-icons/fa"

const SearchBar = () => {

    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const handleSearchToggle = () => {
        setIsOpen(!isOpen);
    };
    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search logic here
        console.log("Searching for:", searchTerm);
        setSearchTerm("");
        setIsOpen(false);
    }
    return (
        <div className={`flex items-center justify-center w-full transition-all duration-300 
            ${isOpen ? "absolute top-0 left-0 w-full bg-[#004643] h-27 z-50" : "w-auto"}`}>

            {isOpen ? (
                <form onSubmit={handleSearch} className="relative flex items-center justify-center w-full">
                    <div className="relative w-1/2">
                        <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-[#abd1c6] px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-[#004643]"
                        />

                        {/* search icon */}
                        <button 
                        type="submit" 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#004643] hover:text-[#00948d]">
                            <FaSearch className="h-6 w-6"/>
                        </button>
                    </div>

                    {/* close icon */}
                    <button 
                    type="button" 
                    className="ml-2 text-[#abd1c6] hover:text-[#00948d]" onClick={handleSearchToggle}>
                        <FaTimes className="h-6 w-6"/>
                    </button>
                </form>
            ) : (
                <button onClick={handleSearchToggle} >
                    <FaSearch className="text-[#004643] hover:text-[#00948d] h-6 w-6"/>
                 </button> 
                )}
        </div>
    );
}

export default SearchBar