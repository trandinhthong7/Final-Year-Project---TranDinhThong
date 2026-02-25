
import { Link } from "react-router-dom";

const ProductGrid = ({ products = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Product Item */}
        {products.map((product, index) => (
            <Link key={product.id || index} to={`/product/${product.id}`} className="block">
                <div className="bg-amber-50 p-4 rounded-lg">
                    <img
                      src={product.image?.[0]?.url || null}
                      alt={product.name || "Product"}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    <h3 className="mt-2 text-sm font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600">${product.price}</p>
                </div>
            </Link>
        ))}
    </div>
  )
}

export default ProductGrid