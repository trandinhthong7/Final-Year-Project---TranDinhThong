import { HiArrowPathRoundedSquare, HiOutlineCreditCard, HiShoppingBag } from "react-icons/hi2"

const FeaturesSection = () => {
  return (
    <section className="py-14 px-4 border-t border-[#004643] mt-6">
        <div className="container mx-auto grid grid-cols-3 md:grid-cols-3 gap-8 text-center">
            {/* Feature 1*/}
            <div className="flex flex-col items-center text-[#004643]">
                <div className="p-4 rounded-full mb-2">
                    <HiShoppingBag className=" text-xl"/>
                </div>
                <h4 className="tracking-tighter mb-2 font-bold"> FREE NATIONWIDE SHIPPING</h4>
                <p className="text-sm tracking-tighter"> On all oders over $100.00</p>
            </div>
            {/* Feature 2*/}
            <div className="flex flex-col items-center text-[#004643]">
                <div className="p-4 rounded-full mb-2">
                    <HiArrowPathRoundedSquare className=" text-xl"/>
                </div>
                <h4 className="tracking-tighter mb-2 font-bold"> 30 DAYS RETURN</h4>
                <p className="text-sm tracking-tighter"> Money back guarantee</p>
            </div>
            {/* Feature 3*/}
            <div className="flex flex-col items-center text-[#004643]">
                <div className="p-4 rounded-full mb-2">
                    <HiOutlineCreditCard className=" text-xl"/>
                </div>
                <h4 className=" tracking-tighter mb-2 font-bold"> SECURE CHECKOUT</h4>
                <p className=" text-sm tracking-tighter"> 100% secure checkout process</p>
            </div>
        </div>
    </section>
    );
}

export default FeaturesSection