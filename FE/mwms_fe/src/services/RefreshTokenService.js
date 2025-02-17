import { axiosClient } from "../config/api";

export const refreshTokenService = async (token) => {

    if (token) {
        try {
            const response = await axiosClient().post("/user/refresh", { token: token });

            const data = response.data;

            if (data && data.token) {
                localStorage.setItem("accessToken", data.token);
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