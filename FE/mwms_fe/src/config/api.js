import axios from "axios"
axios.defaults.baseURL = "http://localhost:8080/api/v1"

const axiosClient = axios.create({
    baseURL: axios.defaults.baseURL,
    headers: {
        "Content-Type" : "application/json"
    },
})

const authClient = axios.create({
    baseURL: axios.defaults.baseURL + "/auth",
    headers:{
        "Content-Type" : "application/json"
    }
})

axiosClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

export {axiosClient, authClient};