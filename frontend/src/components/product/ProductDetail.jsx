import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import adidasF50 from '../../assets/Most Popular/boots/bota-adidas-f50-elite-ag-purple.jpg';
import nikeMercurial from '../../assets/Most Popular/boots/bota-nike-air-zoom-mercurial-vap.jpg';

const testProduct = {
  name: "Sample Product",
  price: 49.99,
  originalPrice: 69.99,
  discount: 20,
  description: "This is a sample product used for demonstration purposes.",
  brand: "Sample Brand",
  category: "Boots",
  sizes: ["39", "40", "41", "42", "43"],
  color: ["Black", "Brown"],
  image: [
    {
      url: adidasF50,
      alt: "Sample Product Image",
    },
    {
      url: nikeMercurial,
      alt: "Sample Product Image 2",
    },
  ],
};

const similarProducts = [
  {
    id: 1,
    name: "adidas F50 Elite AG Football Boots",
    price: 49.99,
    originalPrice: 69.99,
    discount: 18,
    category: "BOOTS",
    tags: ["deal", "new"],
    sizes: [39, 40, 41, 42, 43, 44],
    colorVariants: [adidasF50, nikeMercurial],
    images: adidasF50,
  },
  {
    id: 2,
    name: "Nike Air Zoom Mercurial Vapor 16",
    price: 49.99,
    originalPrice: 69.99,
    discount: 18,
    category: "BOOTS",
    tags: ["deal", "new"],
    sizes: [39, 40, 41, 42, 43, 44],
    colorVariants: [nikeMercurial, adidasF50],
    images: nikeMercurial,
  },
  {
    id: 3,
    name: "Adidas F50 Elite AG",
    price: 49.99,
    originalPrice: 69.99,
    discount: 18,
    category: "BOOTS",
    tags: ["deal", "new"],
    sizes: [39, 40, 41, 42, 43, 44],
    colorVariants: [],
    images: adidasF50,
  },
  {
    id: 4,
    name: "Nike Air Zoom Mercurial",
    price: 49.99,
    originalPrice: 69.99,
    discount: 18,
    category: "BOOTS",
    tags: ["deal", "new"],
    sizes: [39, 40, 41, 42, 43, 44],
    colorVariants: [],
    images: nikeMercurial,
  },
];

const ProductDetail = () => {
  const [mainImage, setMainImage] = useState(testProduct?.image?.[0]?.url || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [Quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if(testProduct?.image?.length >0){
      setMainImage(testProduct.image[0].url);
    }
  }, []);

  // Check if button should be disabled based on selections
  const isButtonDisabled = !selectedSize || !selectedColor || isAddingToCart;

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev)=> prev + 1);
    if (action === "minus" && Quantity > 1) setQuantity((prev)=> prev - 1)};

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select both size and color before adding to cart.",{
        duration: 1000,
      });
      return;
      }
      setIsAddingToCart(true);
      setTimeout(() => {
        toast.success("Product added to cart!",{ duration: 1000,

        });
        setIsAddingToCart(false);
      },500)
    };
    
  return (
    <div className="p-4">
      {/*Best Seller*/}
      <h2 className='text-center text-3xl pb-4 text-[#001e1d] font-bold'>BEST SELLER</h2>
      <div className="max-w-6xl mx-auto bg-[#004643] p-8 rounded-lg">
        <div className="flex flex-col md:flex-row">
          {/* left thumbnail */}
          <div className="hidden md:flex flex-col space-y-4 mr-6">
            {testProduct.image.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.alt}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? 'border-4 border-[#f9bc60]' : ''}`}
                onClick={()=> setMainImage(image.url)}
              />
            ))}
          </div>
          {/* main image */}
          <div className="md:w-1/2">
            <div className="mb-4">
              <img
                src={mainImage}
                alt="test"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
          {/* mobile thumbnail */}
          <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4">
            {testProduct.image.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.alt}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? 'border-4 border-[#abd1c6]' : ''}` }
                onClick={()=>setMainImage(image.url)}
              />
            ))}
          </div>

          {/* right side */}
          <div className="md:w-1/2 md:ml-10">
            <h1 className="text-2xl text-[#fffffe] font-bold">
              {testProduct.name}
            </h1>
            <p className="text-lg  font-light text-[#abd1c6] mb-1 line-through">
              {testProduct.originalPrice && `$${testProduct.originalPrice}`}
            </p>
            <p className="text-xl font-bold text-[#f9bc60] mb-2">
              {testProduct.price && `$${testProduct.price}`}
            </p>
            <p className="mb-4 text-[#abd1c6]">{testProduct.description}</p>
            <div className="mb-4">
              <div className=" flex gap-2 mt-2">
                {testProduct.color.map((color) => (
                  <button
                    onClick={()=>setSelectedColor(color)}
                    key={color}
                    className={`w-8 h-8 rounded-full ${selectedColor===color ? 'border-4 border-[#abd1c6]' : ''}`}
                    style={{
                      backgroundColor: color.toLowerCase(),
                      filter: "brightness(0.5)",
                    }}
                  ></button>
                ))}
              </div>
            </div>
            <div className="text-[#abd1c6]">
              <p>Size:</p>
              <div className="flex gap-2 mt-2">
                {testProduct.sizes.map((size) => (
                  <button 
                    key={size} className={`px-2 py-1 md:px-4 md:py-2 rounded border mb-4 ${selectedSize===size ? "bg-[#abd1c6] text-[#001e1d]" : ""}`}
                    onClick={()=>setSelectedSize(size)}
                    >{size}
                  </button>
                ))}
              </div>
              <div className="mb-6">
                <p>Quantity:</p>
                <div className="flex items-center space-x-4 mt-2">
                  <button onClick={()=>handleQuantityChange("minus")} className="bg-[#abd1c6] px-2 py-1 rounded text-[#001e1d]">-</button>
                  <span className="text-lg">{Quantity}</span>
                  <button onClick={()=>handleQuantityChange("plus")}  className="bg-[#abd1c6] px-2 py-1 rounded text-[#001e1d]">+</button>
                </div>
              </div>

              <button 
              onClick={handleAddToCart} 
              disabled={isButtonDisabled}
              className={`bg-[#abd1c6] text-[#001e1d] py-2 px-6 rounded w-full mb-4 font-semibold transition-opacity ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}>
                {isAddingToCart ? "Adding...": "ADD TO CART"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-20">
        <h2 className="text-center text-3xl text-[#001e1d] font-bold mb-4">
              YOU MAY ALSO LIKE
          </h2>
          <ProductGrid products={similarProducts} horizontal={true}/>
          
        </div>
    </div>
    
  );
};

export default ProductDetail;
