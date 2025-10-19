import adidas_yamal from "../../assets/New Collection/0912_adidas_yamal_icons25_colecc.jpg";
import adidas_coral from "../../assets/New Collection/0923_adidas_coral_blaze25_colecc.jpg";
import wc26 from "../../assets/New Collection/1759738639adidas_trionda_wc26.jpg";
import nike_max from "../../assets/New Collection/nike_max_voltage25.jpg";
import puma_hot from "../../assets/New Collection/puma_hot_pursuit25.jpg";


const NewCollection = () => {
  return (
    <section className="py-8 px-4 lg:px-0">
        <h1 className="text-center pb-4 text-5xl text-[#001e1d] font-bold ">NEW COLLECTIONS</h1>
        <div className="container mx-auto flex flex-row gap-8 overflow-x-auto 
                        lg:grid lg:grid-cols-5 lg:overflow-visible">
            <div className="relative flex-shrink-0 w-3/4 sm:w-1/2 md:w-1/3 lg:w-auto">
                <img src={adidas_yamal} alt="Adidas Yamal Icons" className="w-full h-auto object-cover rounded-lg"/>
            </div>
            <div className="relative flex-shrink-0 w-3/4 sm:w-1/2 md:w-1/3 lg:w-auto">
                <img src={adidas_coral} alt="Adidas Coral Blaze" className="w-full h-auto object-cover rounded-lg"/>
            </div>
            <div className="relative flex-shrink-0 w-3/4 sm:w-1/2 md:w-1/3 lg:w-auto">
                <img src={wc26} alt="Adidas Trionda WC26" className="w-full h-auto object-cover rounded-lg"/>
            </div>
            <div className="relative flex-shrink-0 w-3/4 sm:w-1/2 md:w-1/3 lg:w-auto">
                <img src={nike_max} alt="Nike Max Voltage" className="w-full h-auto object-cover rounded-lg"/>
            </div>
            <div className="relative flex-shrink-0 w-3/4 sm:w-1/2 md:w-1/3 lg:w-auto">
                <img src={puma_hot} alt="Puma Hot Pursuit" className="w-full h-auto object-cover rounded-lg"/>
            </div>
        </div>
    </section>
  )
}

export default NewCollection