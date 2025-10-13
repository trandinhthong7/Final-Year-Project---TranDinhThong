import { RiDeleteBin5Line } from "react-icons/ri"

const CartItems = () => {
    const cartProducts = [
        {
            productId:1 ,
            name: "Nike Mercurial Vapor 14 Elite FG",
            size: 41,
            color: "Red",
            price: 250,
            quantity: 1,
            imageUrl: "https://www.futbolemotion.com/imagesarticulos/248189/750/bota-adidas-predator-elite-ft-fg-lucid-red-white-core-black-0.webp"
        },
        {
            productId:2 ,
            name: "Nike Mercurial Vapor 14 Elite FG",
            size: 41,
            color: "Blue",
            price: 250,
            quantity: 1,
            imageUrl: "https://www.futbolemotion.com/imagesarticulos/248189/750/bota-adidas-predator-elite-ft-fg-lucid-red-white-core-black-0.webp"
        }
    ]

  return (
    <div>
        {cartProducts.map((product, index)=>(
            <div key={index} className="flex items-start justify-between py-4 border-b">
                <div className="flex items-start">
                    <img src={product.image} alt={product.name} className="w-20 h-24 text-[#abd1c6] object-cover mr-4 rounded"/>
                    <div className="text-[#abd1c6]">
                        <h3> {product.name}</h3>
                        <p className="text-sm text-[#93aaa3]">
                            Size: {product.size} | Color: {product.color}
                        </p>
                        <div className="flex items-center mt-2">
                            <button className="border rounded px-2 py-1 text-xl font-medium">-</button>
                            <span className="mx-4 text-lg">{product.quantity}</span>
                            <button className="border rounded px-2 py-1 text-xl font-medium">+</button>
                        </div> 
                    </div>
                </div>
                <div>
                    <p className="font-medium text-[#abd1c6]">
                        ${product.price.toLocaleString() * product.quantity}
                    </p>
                    <button><RiDeleteBin5Line className="h-6 w-6 mt-2 text-[#e16162]"/></button>
                </div>
            </div>
        ))}
    </div>
  )
}

export default CartItems