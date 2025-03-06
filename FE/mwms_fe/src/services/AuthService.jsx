import axiosClient from "../config/api.jsx";

export const login = async (username, password) => {
    const response = await axiosClient.post("/auth/login", {username: username, password: password});
    return response ? response.data : null;
}

export const logout = async () => {
    const response = await axiosClient.post("/auth/logout");
    return response ? response.data : null;
}