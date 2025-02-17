import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

/* eslint-disable react/prop-types */
const ProtectedRoute = ({ children, allowedRoles}) => {
    const { isAuthenticated } = useSelector(state => state.authReducer);
    const role = localStorage.getItem("role");

    if(!isAuthenticated){
        return;
    }

    if (!allowedRoles.includes(role)) {
        return ;
    }

    return children;
}

export default ProtectedRoute;