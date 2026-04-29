import { useState } from 'react';
import { TiTick } from "react-icons/ti";
import { FaQuestion } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";



const SizeGuidePage = () => {
  const [activeTab, setActiveTab] = useState('boots');

  // Boot Size Conversion Chart
  const bootSizes = [
    { us: '6', uk: '5.5', eu: '38', cm: '24' },
    { us: '6.5', uk: '6', eu: '39', cm: '24.5' },
    { us: '7', uk: '6.5', eu: '40', cm: '25' },
    { us: '7.5', uk: '7', eu: '40.5', cm: '25.5' },
    { us: '8', uk: '7.5', eu: '41', cm: '26' },
    { us: '8.5', uk: '8', eu: '42', cm: '26.5' },
    { us: '9', uk: '8.5', eu: '42.5', cm: '27' },
    { us: '9.5', uk: '9', eu: '43', cm: '27.5' },
    { us: '10', uk: '9.5', eu: '44', cm: '28' },
    { us: '10.5', uk: '10', eu: '44.5', cm: '28.5' },
    { us: '11', uk: '10.5', eu: '45', cm: '29' },
    { us: '11.5', uk: '11', eu: '45.5', cm: '29.5' },
    { us: '12', uk: '11.5', eu: '46', cm: '30' },
    { us: '12.5', uk: '12', eu: '47', cm: '30.5' },
    { us: '13', uk: '12.5', eu: '47.5', cm: '31' },
  ];

  // Glove Size Chart
  const gloveSizes = [
    { size: '4', width: '6-6.5', length: '14-15' },
    { size: '5', width: '6.5-7', length: '15-16' },
    { size: '6', width: '7-7.5', length: '16-17' },
    { size: '7', width: '7.5-8', length: '17-18' },
    { size: '8', width: '8-8.5', length: '18-19' },
    { size: '9', width: '8.5-9', length: '19-20' },
    { size: '10', width: '9-9.5', length: '20-21' },
    { size: '11', width: '9.5-10', length: '21-22' },
    { size: '12', width: '10-10.5', length: '22-23' },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#001e1d] mb-4">Size Guide</h1>
          <p className="text-lg text-[#004643]">
            Find your perfect fit with our comprehensive size conversion charts
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-[#004643] p-1">
            <button
              onClick={() => setActiveTab('boots')}
              className={`px-6 py-3 rounded-md font-semibold transition-colors m-2 ${
                activeTab === 'boots'
                  ? 'bg-[#abd1c6] text-[#001e1d]'
                  : 'text-[#abd1c6]'
              }`}
            >
              Football Boots
            </button>
            <button
              onClick={() => setActiveTab('gloves')}
              className={`px-6 py-3 rounded-md font-semibold transition-colors m-2 ${
                activeTab === 'gloves'
                  ? 'bg-[#abd1c6] text-[#001e1d]'
                  : 'text-[#abd1c6]'
              }`}
            >
              Goalkeeper Gloves
            </button>
          </div>
        </div>

        {/* Boot Size Chart */}
        {activeTab === 'boots' && (
          <div className="space-y-8">
            {/* How to Measure */}
            <div className="bg-[#004643] rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-[#fffffe] mb-6">How to Measure Your Foot</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-[#fffffe] mb-3">Step 1: Prepare</h3>
                  <ul className="space-y-2 text-[#abd1c6]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#abd1c6] font-bold">•</span>
                      <span>Wear the socks you'll use with your boots</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#abd1c6] font-bold">•</span>
                      <span>Measure your feet in the evening (feet expand during the day)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#abd1c6] font-bold">•</span>
                      <span>Stand on a piece of paper against a wall</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-[#fffffe] mb-3">Step 2: Measure</h3>
                  <ul className="space-y-2 text-[#abd1c6]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#abd1c6] font-bold">•</span>
                      <span>Mark the longest point of your foot</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#abd1c6] font-bold">•</span>
                      <span>Measure from the wall to the mark in centimeters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#abd1c6] font-bold">•</span>
                      <span>Measure both feet and use the larger measurement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Size Conversion Table */}
            <div className=" rounded-lg p-8">
              <h2 className="text-2xl font-bold text-[#001e1d] mb-6">Boot Size Conversion Chart</h2>
              <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="w-full">
                  <thead >
                    <tr className="bg-[#004643] text-[#fffffe]">
                      <th className="px-4 py-3 text-left  font-semibold">US</th>
                      <th className="px-4 py-3 text-left font-semibold">UK</th>
                      <th className="px-4 py-3 text-left font-semibold">EU</th>
                      <th className="px-4 py-3 text-left font-semibold">Length (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bootSizes.map((size, index) => (
                      <tr
                        key={index}
                        className="text-[#001e1d] even:bg-[#fffffe]"
                      >
                        <td className="px-4 py-3 ">{size.us}</td>
                        <td className="px-4 py-3 ">{size.uk}</td>
                        <td className="px-4 py-3 ">{size.eu}</td>
                        <td className="px-4 py-3 ">{size.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fitting Tips */}
            <div className="bg-[#004643] rounded-lg p-8">
              <h2 className="text-2xl font-bold text-[#fffffe] mb-6">Fitting Tips</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#abd1c6] p-6 rounded-md">
                  <div className="w-12 h-12 bg-[#004643] rounded-full flex items-center justify-center mb-4">
                    <TiTick className="w-6 h-6 text-[#fffffe]" />
                  </div>
                  <h3 className="font-semibold text-[#001e1d] mb-2">Snug Fit</h3>
                  <p className="text-[#004643] text-sm">
                    Football boots should fit snugly but not painfully tight. Your toes should just touch the end.
                  </p>
                </div>
                <div className="bg-[#abd1c6] p-6 rounded-md">
                  <div className="w-12 h-12 bg-[#004643] rounded-full flex items-center justify-center mb-4">
                    <FaSearch className="w-6 h-6 text-[#fffffe]" />
                  </div>
                  <h3 className="font-semibold text-[#001e1d] mb-2">Break-In Period</h3>
                  <p className="text-[#004643] text-sm">
                    New boots may feel tight initially. Wear them indoors for short periods to break them in.
                  </p>
                </div>
                <div className="bg-[#abd1c6] p-6 rounded-md">
                  <div className="w-12 h-12 bg-[#004643] rounded-full flex items-center justify-center mb-4">
                    <FaQuestion className="w-6 h-6 text-[#fffffe]" />
                  </div>
                  <h3 className="font-semibold text-[#001e1d] mb-2">Between Sizes?</h3>
                  <p className="text-[#004643] text-sm">
                    If you're between sizes, go up half a size for leather boots, down for synthetic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Glove Size Chart */}
        {activeTab === 'gloves' && (
          <div className="space-y-8">
            {/* How to Measure */}
            <div className="bg-[#004643] rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-[#fffffe] mb-6">How to Measure Your Hand</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-[#fffffe] mb-3">Hand Width</h3>
                  <ul className="space-y-2 text-[#abd1c6]">
                    <li className="flex items-start gap-2">
                      <span className=" font-bold">•</span>
                      <span>Measure around the widest part of your palm</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className=" font-bold">•</span>
                      <span>Exclude your thumb from the measurement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className=" font-bold">•</span>
                      <span>Use a flexible measuring tape</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-[#fffffe] mb-3">Hand Length</h3>
                  <ul className="space-y-2 text-[#abd1c6]">
                    <li className="flex items-start gap-2">
                      <span className=" font-bold">•</span>
                      <span>Measure from the base of your palm to the tip of your middle finger</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className=" font-bold">•</span>
                      <span>Keep your hand flat and fingers extended</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className=" font-bold">•</span>
                      <span>Measure your dominant hand (the one you catch with)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Size Conversion Table */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-[#001e1d] mb-6">Glove Size Chart</h2>
              <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#004643] text-[#fffffe]">
                      <th className="px-4 py-3 text-left font-semibold">Size</th>
                      <th className="px-4 py-3 text-left font-semibold">Width (cm)</th>
                      <th className="px-4 py-3 text-left font-semibold">Length (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gloveSizes.map((size, index) => (
                      <tr
                        key={index}
                        className="text-[#001e1d] even:bg-[#fffffe]"
                      >
                        <td className="px-4 py-3 font-semibold">{size.size}</td>
                        <td className="px-4 py-3">{size.width}</td>
                        <td className="px-4 py-3">{size.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fitting Tips */}
            <div className="bg-[#004643] rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-[#fffffe] mb-6">Fitting Tips</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#abd1c6] p-6 rounded-md">
                  <div className="w-12 h-12 bg-[#004643] rounded-full flex items-center justify-center mb-4">
                    <TiTick className="w-6 h-6 text-[#fffffe]" />
                  </div>
                  <h3 className="font-semibold text-[#001e1d] mb-2">Proper Fit</h3>
                  <p className="text-[#004643] text-sm">
                    Gloves should fit snugly without restricting movement. Fingers should reach the end of the glove.
                  </p>
                </div>
                <div className="bg-[#abd1c6] p-6 rounded-md">
                  <div className="w-12 h-12 bg-[#004643] rounded-full flex items-center justify-center mb-4">
                    < FaSearch className="w-6 h-6 text-[#fffffe]" />
                  </div>
                  <h3 className="font-semibold text-[#001e1d] mb-2">Check Wrist</h3>
                  <p className="text-[#004643] text-sm">
                    The wrist strap should be secure but not too tight. You should be able to make a fist comfortably.
                  </p>
                </div>
                <div className="bg-[#abd1c6] p-6 rounded-md">
                  <div className="w-12 h-12 bg-[#004643] rounded-full flex items-center justify-center mb-4">
                    <FaQuestion className="w-6 h-6 text-[#fffffe]" />
                  </div>
                  <h3 className="font-semibold text-[#001e1d] mb-2">Between Sizes?</h3>
                  <p className="text-[#004643] text-sm">
                    If between sizes, choose the larger size for better comfort and grip performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeGuidePage;
