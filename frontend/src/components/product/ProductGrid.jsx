
import { Link } from "react-router-dom";

const ProductGrid = ({ products = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Product Item */}
        {products.map((product, index) => (
            <Link key={product.id || index} to={`/product/${product.id}`} className="block">
                <div className="bg-[#004643] p-4 rounded-lg">
                  <div className="w-full h-96 mb-2 ">
                    <img
                      src={product.image?.[0]?.url || null}
                      alt={product.name || "Product"}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                    
                    <h3 className="mb-1 text-md font-bold text-[#abd1c6]">{product.name}</h3>
                    <p className="text-sm text-[#abd1c6] font-medium tracking-tighter">${product.price}</p>
                </div>
            </Link>
        ))}
    </div>
  )
}

export default ProductGrid