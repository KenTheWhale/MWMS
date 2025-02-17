import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

/* eslint-disable react/prop-types */
const ProtectedRoute = ({ children, allowedRoles}) => {
    const { isAuthenticated } = useSelector(state => state.authReducer);
    const role = localStorage.getItem("role");

    if(!isAuthenticated){
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
}

export default ProtectedRoute;