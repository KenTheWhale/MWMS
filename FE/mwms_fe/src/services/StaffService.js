import {axiosClient} from "../config/api.jsx";


export const getStaffList = async () => {
    const response = await axiosClient.get("/manager/staff/list")
    if(response.status === 200) {
        return response.data.data
    }
    return response.status
}