import axiosClient from "../config/api.jsx";

export const getCategoryList = async () => {
    try{
     const response = await axiosClient.get("/manager/category")
        if (response) {
            const body = response.data;
            return body.data;
        }
    } catch (error) {
        console.log(error);
    }
}