import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { fetchAllUsers, createUser, updateUser, deleteUser } from '../../redux/slices/adminSlice';

const UserManagement = () => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.admin);
    
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "user",
    });

    const getStatusColor = (role) => {
        switch (role) {
            case "user":
                return "bg-[#004643] text-[#fffffe]";
            case "admin":
                return "bg-[#f9bc60] text-[#001e1d]";
            default:
                return "";
        }
    };

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createUser(formData)).unwrap();
            toast.success("User created successfully!");
            setFormData({
                username: "",
                email: "",
                password: "",
                role: "user",
            });
        } catch (error) {
            toast.error(error || "Failed to create user");
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await dispatch(updateUser({ userId, role: newRole })).unwrap();
            toast.success("User role updated successfully!");
        } catch (error) {
            toast.error(error || "Failed to update user role");
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (window.confirm(`Are you sure you want to delete ${username}?`)) {
            try {
                await dispatch(deleteUser(userId)).unwrap();
                toast.success("User deleted successfully!");
            } catch (error) {
                toast.error(error || "Failed to delete user");
            }
        }
    };

    if (loading && users.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-[#004643]">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4 text-[#001e1d]">User Management</h2>
            
            {/* Add New User Form */}
            <div className=" p-6 rounded-lg mb-6">
                <h3 className="text-lg font-bold mb-4 text-[#001e1d]">Add New User</h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-[#001e1d] mb-2 font-bold">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-[#001e1d] mb-2 font-bold">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-[#001e1d] mb-2 font-bold">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                autoComplete="new-password"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-[#001e1d] mb-2 font-bold">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#f9bc60] text-[#001e1d] font-bold py-2 px-6 rounded-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Adding..." : "Add User"}
                    </button>
                </form>
            </div>

            {/* User List */}
            <div className="overflow-x-auto sm:rounded-lg shadow-md">
                <table className="min-w-full text-left">
                    <thead className="bg-[#004643] text-xs uppercase text-[#fffffe]">
                        <tr>
                            <th scope="col" className="px-4 py-3">Username</th>
                            <th scope="col" className="px-4 py-3">Email</th>
                            <th scope="col" className="px-4 py-3">Role</th>
                            <th scope="col" className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr
                                    key={user._id}
                                    className="border-b hover:text-[#fffffe] hover:bg-[#004643] text-[#001e1d]"
                                >
                                    <td className="p-4 font-medium whitespace-nowrap">
                                        {user.username}
                                    </td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium border-1 border-[#abd1c6] focus:scale-105 cursor-pointer ${getStatusColor(
                                                    user.role
                                                )} disabled:opacity-50 disabled:cursor-not-allowed`}
                                            disabled={loading}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleDeleteUser(user._id, user.username)}
                                            disabled={loading}
                                            className="bg-[#e16162] text-[#fffffe] py-2 px-4 hover:scale-105 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-4 px-4 text-center text-[#001e1d]">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;