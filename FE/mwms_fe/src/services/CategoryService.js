import {axiosClient} from "../config/api.jsx";

export const getCategoryList = async () => {
    try{
     const response = await axiosClient.get("/manager/category")
        if (response.status === 200) {
            const body = response.data;
            return body.data;
        }
    } catch (error) {
        console.log(error);
    }
}