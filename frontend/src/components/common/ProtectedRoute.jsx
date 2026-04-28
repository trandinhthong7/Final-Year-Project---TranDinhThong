import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { userInfo } = useSelector((state) => state.auth);

    // Check if user is logged in
    if (!userInfo) {
        toast.error("Please login to access this page");
        return <Navigate to="/auth" replace />;
    }

    // Check if admin access is required
    if (adminOnly && userInfo.role !== "admin") {
        toast.error("Access denied. Admin privileges required.");
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
