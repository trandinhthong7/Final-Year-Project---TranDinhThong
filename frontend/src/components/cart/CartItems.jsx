
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
                </div>
                <div>
                    <h3 className="text-[#abd1c6]">
                        {product.name}
                    </h3>
                </div>
            </div>
        ))}
    </div>
  )
}

export default CartItems