import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { fetchAllProducts, deleteProduct } from '../../redux/slices/adminProductSlice';

const ProductManagement = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.adminProducts);

    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await dispatch(deleteProduct(id)).unwrap();
                toast.success("Product deleted successfully!");
                // Refresh products list
                dispatch(fetchAllProducts());
            } catch (error) {
                toast.error(error || "Failed to delete product");
            }
        }
    };

    if (loading && products.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-[#004643]">Loading products...</div>
            </div>
        );
    }

    return (
        <div className="max-w-full mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl text-[#001e1d] font-bold">Product Management</h2>
                <Link
                    to="/admin/products/new"
                    className="bg-[#004643] text-[#fffffe] px-6 py-2 rounded-lg hover:scale-105 font-semibold"
                >
                    + Add New Product
                </Link>
            </div>

            <div className="overflow-x-auto sm:rounded-lg shadow-md">
                <table className="min-w-full text-left">
                    <thead className="text-xs uppercase bg-[#004643] text-[#fffffe]">
                        <tr>
                            <th className="py-3 px-4">Image</th>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Brand</th>
                            <th className="py-3 px-4">Price</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Stock</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr
                                    key={product._id}
                                    className="border-b border-[#004643] text-[#001e1d] hover:text-[#fffffe] hover:bg-[#004643] cursor-pointer whitespace-nowrap"
                                >
                                    <td className="py-2 px-4">
                                        <img
                                            src={product.images?.[0] || '/placeholder-product.jpg'}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </td>
                                    <td className="py-2 px-4 font-medium">{product.name}</td>
                                    <td className="py-2 px-4">{product.brand}</td>
                                    <td className="py-2 px-4">${product.price.toFixed(2)}</td>
                                    <td className="py-2 px-4">{product.category}</td>
                                    <td className="py-2 px-4">
                                        {product.countInStock || 0}
                                    </td>
                                    <td className="py-2 px-4">
                                        <Link
                                            to={`/admin/products/${product._id}/edit`}
                                            className="bg-[#f9bc60] text-[#001e1d] py-1 px-3 rounded-lg inline-block hover:scale-105 mr-2"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id, product.name)}
                                            disabled={loading}
                                            className="bg-[#e16162] text-[#fffffe] py-1 px-3 rounded-lg inline-block hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="py-4 px-4 text-center text-[#001e1d]">
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductManagement;