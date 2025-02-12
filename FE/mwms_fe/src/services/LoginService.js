import {auth} from "../config/AxiosConfig.js";

export const loginService = async (username, password) => {
    const request = {
        username: username,
        password: password
    }

    try{
        const response = await auth.post("/login", request, {
            headers:{
                "Content-Type": "application/json"
            }
        });
        return response.data
    }catch (err){
        console.log(err)
        throw err
    }
}