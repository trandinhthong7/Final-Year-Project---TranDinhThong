import { useSearchParams } from "react-router-dom";

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    searchParams.set("sortBy", sortBy);
    setSearchParams(searchParams);
  }
  return (
    <div className="mb-4 flex items-center justify-center">
      <select id="sort" 
      onChange={handleSortChange}
      value={searchParams.get("sortBy") || ""}
      className="border border-[#004643] text-[#004643] rounded-md focus:outline-none">
        <option value="" className="">Default</option>
        <option value="priceAsc" className="">Price: Low to High</option>
        <option value="priceDesc" className="">Price: High to Low</option>
        <option value="popularity" className="">Popularity</option>
      </select>
    </div>
  )
}

export default SortOptions