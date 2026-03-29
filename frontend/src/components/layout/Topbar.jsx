import {TbBrandMeta} from "react-icons/tb"
import {IoLogoInstagram} from "react-icons/io5"
import {RiTwitterXLine} from "react-icons/ri"
const Topbar = () => {
  return (
  <div className="bg-[#004643] text-[#abd1c6]">
    <div className="container mx-auto flex justify-between items-center py-1 px-4">
      <div className="hidden md:flex items-center space-x-4">
        <a href="#" className="hover:text-[#00948d]"> <TbBrandMeta className="h-5 w-5"/></a>
        <a href="#" className="hover:text-[#00948d]"> <IoLogoInstagram className="h-5 w-5"/></a>
        <a href="#" className="hover:text-[#00948d]"> <RiTwitterXLine className="h-5 w-5"/></a>

      </div>
      <div className='text-center text-sm flex-grow'>
        <span >Your Pleasure Is Our Quality</span>
      </div>
      <div className="text-sm hidden md:block">
        <a href="tel:+123456789" className="hover:text-[#00948d]"> +1(234) 567 89</a>
      </div>
    </div>
  </div>
  )
}
export default Topbar