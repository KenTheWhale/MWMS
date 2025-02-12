import {url} from "../config/AxiosConfig.js";

export const refreshTokenService = async (token) => {

    if (token) {
        try {
            const response = await url.post("/user/refresh", { token: token }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = response.data;

            if (data && data.token) {
                localStorage.setItem("access", data.token);
            } else {
                console.error("Invalid token data received when refreshing.");
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            throw error;
        }
    } else {
        console.error("No access token available for refreshing.");
    }
};