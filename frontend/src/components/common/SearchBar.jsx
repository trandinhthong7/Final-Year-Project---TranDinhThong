import { useState } from "react"
import { FaSearch } from "react-icons/fa"

const SearchBar = () => {

    const [searchTerm, setSearchTerm] =useState("");
    const[isOpen, setIsOpen] = useState(false);
    return (
        <div>
            {isOpen ? (
                <form>
                </form>
            ) : (<button type="submit" >
                        <FaSearch className="text-[#004643] h-6 w-6"/>
                    </button> )}
        </div>
    );
}

export default SearchBar