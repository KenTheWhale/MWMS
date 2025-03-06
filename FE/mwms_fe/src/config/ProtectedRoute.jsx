import {enqueueSnackbar} from "notistack";
import {Navigate} from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    if(user && allowedRoles === user.role) {
        return children;
    }else{
        enqueueSnackbar("You do not have permission to use this function", {variant:"warning"});
        return <Navigate to={"/login"} />;
    }

};

export default ProtectedRoute;
