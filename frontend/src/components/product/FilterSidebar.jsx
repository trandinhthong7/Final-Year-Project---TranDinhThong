import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

const FilterSidebar = ({ category = "BOOTS" }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    brand: [],
    typeOfoutsole: [],
    age: [],
    size: [],
    color: [],
    material: [],
    player: [],
    tags: [],
    accessoryType: [],
    minPrice: 17,
    maxPrice: 400,
  });

  const [priceRange, setPriceRange] = useState([17,400]);
  
  // Category-specific options
  const getBrandOptions = () => {
    if (category === "BOOTS") {
      return ["Nike", "Adidas", "Puma", "New Balance", "Mizuno", "Under Armour", "Uhlsport", "Thuong Dinh"];
    }
    if (category === "GLOVES") {
      return ["Adidas", "Nike", "Puma", "Uhlsport"];
    }
    if (category === "ACCESSORIES") {
      return ["Adidas", "Nike", "Puma", "Uhlsport", "Soka"];
    }
    return ["Adidas", "Nike", "Puma", "Thuong Dinh", "Under Armour", "New Balance"];
  };
  
  const brands = getBrandOptions();
  const typesOfOutsole = ["Firm Ground", "Artificial Grass", "Indoor"];
  const ages = ["Adult", "Kids"];
  const sizes = [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];
  const gloveSizes = ["7", "8", "8.5", "9", "9.5", "10", "10.5", "11"];
  const colors = ["Red", "Blue", "Green", "Black", "White", "Yellow", "Purple", "Orange", "Pink", "Gray"];
  const materials = ["Leather", "Synthetic"];
  const players = ["Cristiano Ronaldo", "Lionel Messi", "Neymar Jr.", "Kylian Mbappe", "Lamine Yamal"];
  const tags = ["New", "Deal", "Best Seller"];
  const accessoryTypes = ["Balls", "Socks", "Tape"];

  useEffect(()=>{
    const params = Object.fromEntries([...searchParams]);
    setFilters({
      brand: params.brand ? params.brand.split(",") : [],
      typeOfoutsole: params.typeOfoutsole ? params.typeOfoutsole.split(",") : [],
      age: params.age ? params.age.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      player: params.player ? params.player.split(",") : [],
      size: params.size ? params.size.split(",") : [],
      color: params.color ? params.color.split(",") : [],
      tags: params.tags ? params.tags.split(",") : [],
      accessoryType: params.accessoryType ? params.accessoryType.split(",") : [],
      minPrice: params.minPrice || 20,
      maxPrice: params.maxPrice || 500,
    });
    setPriceRange([0, params.maxPrice || 500]);
  }, [searchParams])

  const handleFilterChange = (e)=>{
    const{name, value, checked, type} = e.target;
    let newFilter={...filters};
    if(type === "checkbox"){
      if(checked){
        newFilter[name] = [...(newFilter[name] || []), value];
      } else{
        newFilter[name] = (newFilter[name] || []).filter((item) => item !== value);
      }
    }else{
      newFilter[name] = value;
    };
    setFilters(newFilter);
    updateURLParams(newFilter);
  }
  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        params.set(key, newFilters[key]);
      }
    });
    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPriceRange([20, newPrice]);
    const newfilters = {...filters, minPrice:0, maxPrice:newPrice};
    updateURLParams(newfilters);
  }

  const handleResetFilters = () => {
    setFilters({
      brand: [],
      typeOfoutsole: [],
      age: [],
      size: [],
      color: [],
      material: [],
      player: [],
      tags: [],
      accessoryType: [],
      minPrice: 17,
      maxPrice: 400,
    });
    setPriceRange([17, 400]);
    setSearchParams({});
    navigate('');
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-[#fffffe]">
          Filter
        </h3>
        <button
          onClick={handleResetFilters}
          className="text-sm text-[#f9bc60] hover:text-[#fffffe] transition-colors underline"
        >
          Reset All
        </button>
      </div>
        {/* Brand Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#fffffe] mb-2">Brand</label>
          {brands.map((brand)=>(
            <div key={brand} className="flex items-center mb-1">
              <input
                type="checkbox"
                name="brand"
                value={brand}
                checked={filters.brand.includes(brand)}
                onChange={handleFilterChange}
                className="mr-2 h-4 w-4 text-[#fffffe] accent-[#f9bc60]"
              />
              <span className="text-[#fffffe]">{brand}</span>
            </div>
          ))}
        </div>

        {/* Tags Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#fffffe] mb-2">Tags</label>
          {tags.map((tag)=>(
            <div key={tag} className="flex items-center mb-1">
              <input
                type="checkbox"
                name="tags"
                value={tag}
                checked={filters.tags.includes(tag)}
                onChange={handleFilterChange}
                className="mr-2 h-4 w-4 text-[#fffffe] accent-[#f9bc60]"
              />
              <span className="text-[#fffffe]">{tag}</span>
            </div>
          ))}
        </div>

        {/* Types Of Outsole Filter - Only for BOOTS */}
        {category === "BOOTS" && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#fffffe] mb-2">Types Of Outsole</label>
            {typesOfOutsole.map((typeOfoutsole)=>(
              <div key={typeOfoutsole} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  name="typeOfoutsole"
                  value={typeOfoutsole}
                  checked={filters.typeOfoutsole.includes(typeOfoutsole)}
                  onChange={handleFilterChange}
                  className="mr-2 h-4 w-4 text-[#fffffe] accent-[#f9bc60]"
                />
                <span className="text-[#fffffe]">{typeOfoutsole}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Age Filter - Only for BOOTS and GLOVES */}
        {(category === "BOOTS" || category === "GLOVES") && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#fffffe] mb-2">Age</label>
            {ages.map((age)=>(
              <div key={age} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  name="age"
                  value={age}
                  checked={filters.age.includes(age)}
                  onChange={handleFilterChange}
                  className="mr-2 h-4 w-4 text-[#fffffe] accent-[#f9bc60]"
                />
                <span className="text-[#fffffe]">{age}</span>
              </div>
            ))}
          </div>
        )}

        {/* Accessory Type Filter - Only for ACCESSORIES */}
        {category === "ACCESSORIES" && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#fffffe] mb-2">Type</label>
            {accessoryTypes.map((type)=>(
              <div key={type} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  name="accessoryType"
                  value={type}
                  checked={filters.accessoryType.includes(type)}
                  onChange={handleFilterChange}
                  className="mr-2 h-4 w-4 text-[#fffffe] accent-[#f9bc60]"
                />
                <span className="text-[#fffffe]">{type}</span>
              </div>
            ))}
          </div>
        )}

        {/* Color Filter */}
        <div className="mb-6">
          <label className="block font-medium text-[#fffffe] mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = filters.color.includes(color);
              return (
                <button
                  key={color}
                  type="button"
                  name="color"
                  value={color}
                  onClick={(e) => handleFilterChange({
                    target: { name: 'color', value: color, type: 'checkbox', checked: !isSelected }
                  })}
                  className={`h-8 w-8 rounded-full border text-[#fffffe] cursor-pointer transition hover:scale-105 ${
                    isSelected ? 'ring-2 ring-offset-2 ring-[#f9bc60] border-[#f9bc60]' : 'border-[#004643]'
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                ></button>
              );
            })}
          </div>
        </div>

        {/* Size Filter */}
        <div className="mb-6">
          <label className="block font-medium text-[#fffffe] mb-2">
            {category === "GLOVES" ? "Size - Glove Size" : "Size - EU Footwear"}
          </label>
          <div className="flex flex-wrap gap-2">
            {(category === "GLOVES" ? gloveSizes : sizes).map((size) => {
              const sizeStr = size.toString();
              const isSelected = filters.size.includes(sizeStr);
              return (
                <button
                  key={size}
                  type="button"
                  name="size"
                  value={sizeStr}
                  onClick={(e) => {
                    handleFilterChange({
                      target: { name: 'size', value: sizeStr, type: 'checkbox', checked: !isSelected }
                    });
                  }}
                  className={`h-8 w-8 rounded-lg border text-xs transition-all duration-200 transform hover:scale-105
                    ${isSelected 
                      ? "bg-[#f9bc60] border-[#f9bc60] text-[#001e1d] font-bold shadow-lg"
                      : "border-[#abd1c6] text-[#fffffe] hover:bg-[#abd1c6] hover:text-[#004643]"
                    }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
          {filters.size.length > 0 && (
            <p className="mt-2 text-xs text-[#abd1c6]">
              Size Selected: {filters.size.join(", ")}
            </p>
          )}
        </div>

        {/* Material Filter - Only for BOOTS */}
        {category === "BOOTS" && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#fffffe] mb-2">Material</label>
            {materials.map((material)=>(
              <div key={material} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  name="material"
                  value={material}
                  checked={filters.material.includes(material)}
                  onChange={handleFilterChange}
                  className="mr-2 h-4 w-4 text-[#fffffe] accent-[#f9bc60]"
                />
                <span className="text-[#fffffe]">{material}</span>
              </div>
            ))}
          </div>
        )}

        {/* Player Filter - Only for BOOTS */}
        {category === "BOOTS" && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#fffffe] mb-2">Player</label>
            {players.map((player)=>(
              <div key={player} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  name="player"
                  value={player}
                  checked={filters.player.includes(player)}
                  onChange={handleFilterChange}
                  className="mr-2 h-4 w-4 text-[#fffffe] accent-[#f9bc60]"
                />
                <span className="text-[#fffffe]">{player}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price Range Filter */}
        <div className="mb-8">
          <label className="block text-[#fffffe] font-medium mb-2">
            Price Range
          </label>
          <input
            type="range"
            name="maxPrice"
            min={20}
            max={500}
            value={priceRange[1]} 
            onChange={handlePriceChange} 
            className="w-full h-2 bg-[#abd1c6] rounded-lg appearance-none cursor-pointer accent-[#f9bc60]"
          />
          <div className="flex justify-between text-[#fffffe] mt-2">
            <span>20$</span>
            <span>{priceRange[1]}$</span>
          </div>
        </div>
    </div>
  )
}

export default FilterSidebar