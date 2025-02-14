import Signin from "../view/auth/signin/SignIn.jsx";

export default function LoginPage() {
    if(localStorage.length !== 0){
        localStorage.clear()
    }

    return (
        <>
            <Signin/>
        </>
    )
}