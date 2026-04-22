import { useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri"
import adidasF50 from '../../assets/Most Popular/boots/bota-adidas-f50-elite-ag-purple.jpg';

const CartItems = () => {
    const [cartProducts, setCartProducts] = useState([
        {
            productId:1 ,
            name: "Nike Mercurial Vapor 14 Elite FG",
            size: 41,
            color: "Red",
            price: 250,
            quantity: 1,
            image: adidasF50
        },
        {
            productId:2 ,
            name: "Nike Mercurial Vapor 14 Elite FG",
            size: 41,
            color: "Blue",
            price: 250,
            quantity: 1,
            image: adidasF50
        }
    ]);

    const updateQuantity = (id, delta) => {
        setCartProducts((prev) =>
            prev.map((item) =>
                item.productId === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setCartProducts((prev) => prev.filter((item) => item.productId !== id));
    };

  return (
    <div>
        {cartProducts.map((product, index)=>(
            <div key={index} className="flex items-start justify-between py-4 border-b">
                <div className="flex items-start">
                    <img src={product.image} alt={product.name} className="w-20 h-24 object-cover mr-4 rounded"/>
                    <div className="text-[#fffffe]">
                        <h3> {product.name}</h3>
                        <p className="text-sm text-[#93aaa3]">
                            Size: {product.size} | Color: {product.color}
                        </p>
                        <div className="flex items-center mt-2">
                            <button onClick={() => updateQuantity(product.productId, -1)} className="border rounded px-2 py-1 text-xl font-medium">-</button>
                            <span className="mx-4 text-lg">{product.quantity}</span>
                            <button onClick={() => updateQuantity(product.productId, 1)} className="border rounded px-2 py-1 text-xl font-medium">+</button>
                        </div> 
                    </div>
                </div>
                <div>
                    <p className="font-medium text-[#fffffe]">
                        ${(product.price * product.quantity).toLocaleString()}
                    </p>
                    <button onClick={() => removeItem(product.productId)}>
                        <RiDeleteBin5Line className="h-6 w-6 mt-4 text-[#e16162] hover:text-red-500"/>
                    </button>
                </div>
            </div>
        ))}
    </div>
  )
}

export default CartItems