import { IoStorefrontOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import { FaTags } from "react-icons/fa6";
import { FaCalendar } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaMoneyBill } from "react-icons/fa";
import { MdDesignServices } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";



const AboutPage = () => {
  return (
    <div className="min-h-scree py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#001e1d] mb-4">About TDT Stadium</h1>
          <p className="text-lg text-[#004643]">
            Your Premier Destination for Football Equipment and Sports Facilities
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Established & Operation */}
          <div className="bg-[#004643] rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-[#f9bc60] mb-4 flex items-center gap-3">
              <IoStorefrontOutline className="w-8 h-8 text-[#f9bc60]" />
              Established & Operation
            </h2>
            <p className="text-[#abd1c6] leading-relaxed">
              TDT Stadium is an integrated sports enterprise that specializes in both high-quality football equipment retail and sports facility management. We are committed to providing the best products and services for football enthusiasts at all levels.
            </p>
          </div>

          {/* Retail Operations */}
          <div className="bg-[#004643] rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-[#f9bc60] mb-4 flex items-center gap-3">
              <IoStorefrontOutline className="w-8 h-8 text-[#f9bc60]" />
              Retail Operations
            </h2>
            <p className="text-[#abd1c6] leading-relaxed mb-4">
              The store sells a wide range of professional football gear, including:
            </p>
            <ul className="space-y-2 text-[#abd1c6]">
              <li className="flex items-start gap-2">
                <TiTick className="w-5 h-5 text-[#f9bc60] mt-0.5" />
                <span><strong>Football Boots:</strong> Specializing in FG (Firm Ground), AG (Artificial Grass), and Indoor outsoles</span>
              </li>
              <li className="flex items-start gap-2">
                <TiTick className="w-5 h-5 text-[#f9bc60] mt-0.5" />
                <span><strong>Goalkeeper Gloves:</strong> Professional-grade gloves for all skill levels</span>
              </li>
              <li className="flex items-start gap-2">
                <TiTick className="w-5 h-5 text-[#f9bc60] mt-0.5" />
                <span><strong>Accessories:</strong> Balls, socks, tape, and other essential football equipment</span>
              </li>
            </ul>
          </div>

          {/* Major Brands */}
          <div className="bg-[#004643] rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-[#f9bc60] mb-4 flex items-center gap-3">
              <FaTags className="w-8 h-8 text-[#f9bc60]" />
              Major Brands
            </h2>
            <p className="text-[#abd1c6] leading-relaxed mb-4">
              The shop features top-tier brands including:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#abd1c6] p-4 rounded-md text-center font-semibold text-[#001e1d]">Nike</div>
              <div className="bg-[#abd1c6] p-4 rounded-md text-center font-semibold text-[#001e1d]">Adidas</div>
              <div className="bg-[#abd1c6] p-4 rounded-md text-center font-semibold text-[#001e1d]">Puma</div>
              <div className="bg-[#abd1c6] p-4 rounded-md text-center font-semibold text-[#001e1d]">Uhlsport</div>
              <div className="bg-[#abd1c6] p-4 rounded-md text-center font-semibold text-[#001e1d]">Mizuno</div>
              <div className="bg-[#abd1c6] p-4 rounded-md text-center font-semibold text-[#001e1d]">New Balance</div>
              <div className="bg-[#abd1c6] p-4 rounded-md text-center font-semibold text-[#001e1d]">Under Armour</div>
              <div className="bg-[#abd1c6] p-4 rounded-md text-center font-semibold text-[#001e1d]">Thuong Dinh</div>
            </div>
          </div>

          {/* Stadium Booking */}
          <div className="bg-[#004643] rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-[#f9bc60] mb-4 flex items-center gap-3">
              <FaCalendar className="w-8 h-8 text-[#f9bc60]" />
              Stadium Booking
            </h2>
            <p className="text-[#abd1c6] leading-relaxed mb-4">
              The facility offers outdoor football pitches available for public booking. The stadium is known for hosting community matches and corporate tournaments, such as the internal TDT football club matches and regional tech-industry cups.
            </p>

            {/* Booking Details */}
            <div className="bg-[#abd1c6] p-6 rounded-md space-y-4">
              <h3 className="font-bold text-[#001e1d] text-lg mb-3">Booking Details</h3>
              
              {/* Operating Hours */}
              <div className="flex items-start gap-3">
                <FaClock className="w-6 h-6 text-[#001e1d]" />
                <div>
                  <p className="font-semibold text-[#001e1d]">Operating Hours</p>
                  <p className="text-[#004643]">Daily: 06:00 - 23:00</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex items-start gap-3">
                <FaMoneyBill className="w-6 h-6 text-[#001e1d]" />
                <div>
                  <p className="font-semibold text-[#001e1d]">Pricing</p>
                  <p className="text-[#004643]">Daytime (05:00 - 17:00): 6.00 USD/hour</p>
                  <p className="text-[#004643]">Evening (17:00 - 24:00): 11.00 USD/hour</p>
                </div>
              </div>

              {/* Services */}
              <div className="flex items-start gap-3">
                <MdDesignServices className="w-6 h-6 text-[#001e1d]" />
                <div>
                  <p className="font-semibold text-[#001e1d]">Services</p>
                  <p className="text-[#004643]">Parking and equipment rental available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-[#004643] rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-[#f9bc60] mb-4 flex items-center gap-3">
              <FaMapMarkerAlt className="w-8 h-8 text-[#f9bc60]" />
              Address
            </h2>
            <div className="bg-[#abd1c6] p-6 rounded-md">
              <p className="text-[#001e1d] font-semibold mb-2">Location</p>
              <p className="text-[#004643] leading-relaxed">
                74 Định Công, Phường Định Công<br />
                Quận Hoàng Mai, Thành phố Hà Nội<br />
                Vietnam
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
