import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { 
    fetchAddresses, 
    createAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress 
} from "../../redux/slices/addressSlice";
import { FaEdit, FaTrash, FaStar, FaRegStar } from "react-icons/fa";

const AddressManagement = () => {
    const dispatch = useDispatch();
    const { addresses, loading } = useSelector((state) => state.address);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        label: "Home",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
        isDefault: false
    });

    useEffect(() => {
        dispatch(fetchAddresses());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editingId) {
                await dispatch(updateAddress({ id: editingId, addressData: formData })).unwrap();
                toast.success("Address updated successfully");
            } else {
                await dispatch(createAddress(formData)).unwrap();
                toast.success("Address created successfully");
            }
            resetForm();
        } catch (error) {
            toast.error(error || "Failed to save address");
        }
    };

    const handleEdit = (address) => {
        setEditingId(address._id);
        setFormData({
            label: address.label,
            firstName: address.firstName,
            lastName: address.lastName,
            address: address.address,
            city: address.city,
            postalCode: address.postalCode,
            country: address.country,
            phone: address.phone,
            isDefault: address.isDefault
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                await dispatch(deleteAddress(id)).unwrap();
                toast.success("Address deleted successfully");
            } catch (error) {
                toast.error(error || "Failed to delete address");
            }
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await dispatch(setDefaultAddress(id)).unwrap();
            toast.success("Default address updated");
        } catch (error) {
            toast.error(error || "Failed to set default address");
        }
    };

    const resetForm = () => {
        setFormData({
            label: "Home",
            firstName: "",
            lastName: "",
            address: "",
            city: "",
            postalCode: "",
            country: "",
            phone: "",
            isDefault: false
        });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#001e1d]">My Addresses</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#f9bc60] text-[#001e1d] px-4 py-2 rounded-lg hover:scale-110 transition-transform font-medium"
                >
                    {showForm ? "Cancel" : "+ New Address"}
                </button>
            </div>

            {/* Address Form */}
            {showForm && (
                <div className="bg-[#abd1c6] p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-bold text-[#001e1d] mb-4">
                        {editingId ? "Edit Address" : "New Address"}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[#001e1d] font-medium mb-2">Label</label>
                            <select
                                name="label"
                                value={formData.label}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="Home">Home</option>
                                <option value="Work">Work</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[#001e1d] font-medium mb-2">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[#001e1d] font-medium mb-2">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[#001e1d] font-medium mb-2">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[#001e1d] font-medium mb-2">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[#001e1d] font-medium mb-2">Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[#001e1d] font-medium mb-2">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[#001e1d] font-medium mb-2">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isDefault"
                                checked={formData.isDefault}
                                onChange={handleInputChange}
                                className="mr-2 h-4 w-4"
                            />
                            <label className="text-[#001e1d] font-medium">Set as default address</label>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#f9bc60] text-[#001e1d] px-4 py-2 rounded-lg hover:scale-110 transition-transform font-medium"
                            >
                                {loading ? "Saving..." : editingId ? "Update Address" : "Save Address"}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-[#e16162] text-[#001e1d] px-4 py-2 rounded-lg hover:scale-110 transition-transform font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Address List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading && addresses.length === 0 ? (
                    <div className="col-span-2 text-center py-8 text-[#004643]">Loading addresses...</div>
                ) : addresses.length === 0 ? (
                    <div className="col-span-2 text-center py-8 text-[#004643]">
                        No addresses saved. Add your first address!
                    </div>
                ) : (
                    addresses.map((address) => (
                        <div
                            key={address._id}
                            className={`bg-[#004643] p-4 rounded-lg border-2 ${
                                address.isDefault ? "border-[#f9bc60]" : "border-transparent"
                            } relative`}
                        >
                            {address.isDefault && (
                                <span className="absolute top-2 right-2 bg-[#abd1c6] text-[#001e1d] text-xs px-2 py-1 rounded-lg font-bold">
                                    DEFAULT
                                </span>
                            )}
                            
                            <div className="mb-2">
                                <span className="inline-block bg-[#abd1c6] text-[#001e1d] text-xs px-2 py-1 rounded font-medium">
                                    {address.label}
                                </span>
                            </div>
                            
                            <h3 className="font-bold text-[#fffffe] mb-2">
                                {address.firstName} {address.lastName}
                            </h3>
                            <p className="text-[#abd1c6] text-sm mb-1">{address.address}</p>
                            <p className="text-[#abd1c6] text-sm mb-1">
                                {address.city}, {address.postalCode}
                            </p>
                            <p className="text-[#abd1c6] text-sm mb-1">{address.country}</p>
                            <p className="text-[#abd1c6] text-sm mb-4">Phone: {address.phone}</p>

                            <div className="flex gap-2">
                                {!address.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(address._id)}
                                        className="flex items-center gap-1 text-[#f9bc60] hover:text-[#004643] transition-colors text-sm"
                                        title="Set as default"
                                    >
                                        <FaRegStar /> Set Default
                                    </button>
                                )}
                                <button
                                    onClick={() => handleEdit(address)}
                                    className="flex items-center gap-1 text-[#fffffe] hover:scale-110 transition-transform text-sm"
                                >
                                    <FaEdit /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(address._id)}
                                    className="flex items-center gap-1 text-[#e16162] hover:scale-110 transition-transform text-sm"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AddressManagement;
