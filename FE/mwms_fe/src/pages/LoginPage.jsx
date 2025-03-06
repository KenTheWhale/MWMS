import Signin from "../view/auth/signin/SignIn.jsx";
import {logout} from "../services/AuthService.jsx";
import {enqueueSnackbar} from "notistack";

async function logoutFunc(){
    const response = await logout()
    if(response && response.success){
        enqueueSnackbar(response.message, {variant: "success"});
    }
}

export default function LoginPage() {
    if(localStorage.length !== 0){
        localStorage.clear()
        logoutFunc()
    }

    return (
        <>
            <Signin/>
        </>
    )
}