import { useState } from "react";
import Bell from "../../assets/Carousel/adidas_Belligham_predator25.jpg";
import nikeM from "../../assets/Carousel/nike_mbappe_mercurial1025_all-(2).webp";
import nikeQ4 from "../../assets/Carousel/nike_Q4_mad_voltage25.webp";
import puma from "../../assets/Carousel/puma_hot_pursuit25_Q4.jpg";
import Bellmb from "../../assets/Carousel/mobile/adidas_Belligham_predator25_MB.webp";
import nikeMmb from "../../assets/Carousel/mobile/nike_mbappe_mercurial1025_MB_ALL.webp";
import nikeQ4mb from "../../assets/Carousel/mobile/nike_Q4_mad_voltage25_MB.webp";
import pumaMb from "../../assets/Carousel/mobile/puma_hot_pursuit25_Q4_MB.webp";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const Carousel = () => {
  const slideImages = [
  { desktop: Bell, mobile: Bellmb, alt: "Adidas Bellingham Predator" },
  { desktop: nikeM, mobile: nikeMmb, alt: "Nike Mbappe Mercurial" },
  { desktop: nikeQ4, mobile: nikeQ4mb, alt: "Nike Q4 Mad Voltage" },
  { desktop: puma, mobile: pumaMb, alt: "Puma Hot Pursuit" },];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex(
      currentIndex === 0 ? slideImages.length - 1 : currentIndex - 1
    );
  };
  const nextSlide = () => {
    setCurrentIndex(
      currentIndex === slideImages.length - 1 ? 0 : currentIndex + 1
    );
  };
  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="overflow-hidden relative group object-cover">
      <div className="flex transition-transform ease-out duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {slideImages.map((slideImages, index) => (
          <div key={index} className="min-w-full">
      <picture>
        {/*Desktop*/}
        <source media="(min-width: 768px)" srcSet={slideImages.desktop} />
        
        {/*Mobile*/}
        <source media="(max-width: 767px)" srcSet={slideImages.mobile} />
        
        {/*fallback*/}
        <img
          src={slideImages.mobile}
          alt={slideImages.alt}
          className="w-full h-auto object-cover"
        />
      </picture>
    </div>
          ))}
      </div>

      <div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-between
                   px-4 md:px-10                        
                   opacity-100 md:opacity-0 md:group-hover:opacity-100 
                   transition-opacity duration-300"
      >
        <button
          onClick={prevSlide}
          className="text-3xl md:text-5xl text-[#f9bc60] hover:text-[#a47733] transition-colors
                     p-2 rounded-full bg-[#001e1d]/30 md:bg-transparent"
        >
          <FaAngleLeft />
        </button>

        <button
          onClick={nextSlide}
          className="text-3xl md:text-5xl text-[#f9bc60] hover:text-[#a47733] transition-colors
                     p-2 rounded-full bg-[#001e1d]/30 md:bg-transparent"
        >
          <FaAngleRight />
        </button>
      </div>
      {/* Circle Navigation  */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slideImages.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className="p-1 rounded-full"
          >
            <div
              className={`
                w-3 h-3 rounded-full transition-all
                ${
                  currentIndex === slideIndex
                    ? "bg-[#abd1c6] scale-110"
                    : "bg-[#001e1d]/40"
                }
              `}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
