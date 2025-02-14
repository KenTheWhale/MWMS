import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, role } = useSelector(state => state.authReducer);
        
    if(!isAuthenticated){
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
}

export default ProtectedRoute;