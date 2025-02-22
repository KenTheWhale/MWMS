import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/* eslint-disable react/prop-types */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated } = useSelector(state => state.authReducer);
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        } else if (!allowedRoles.includes(role)) {
            navigate("/unauthorized");
        }
    }, [isAuthenticated, role, navigate, allowedRoles]);

    if (!isAuthenticated || !allowedRoles.includes(role)) {
        return null; // Tránh render component nếu điều kiện không đúng
    }

    return children;
};

export default ProtectedRoute;
