import MyOrderPage from "./MyOrderPage"

const Profile = () => {
  return (
    <div className="min-h-screen flex flex-col">
        <div className="flex-grow container mx-auto p-4 md:p-6">
            <div className="flex flex-col md:flex-row space-y-6 md:space-x-6 md:space-y-0 ">
                {/* Left Section */}
                <div className="w-full md:w-1/3 lg:w-1/4 rounded-lg p-6 text-[#fffffe] bg-[#004643]">
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">Text name</h1>
                    <p className="text-lg mb-4">textemail@gmail.com</p>
                    <button className="w-full bg-[#e16162] py-2 px-4 rounded  hover:bg-[#e16162]/80 ">Logout</button>
                </div>
                {/* Right Section: Order table */}
                <div className="w-full md:w-2/3 lg:w-3/4">
                    <MyOrderPage/>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Profile