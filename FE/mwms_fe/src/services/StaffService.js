import {axiosClient} from "../config/api";


export const getStaffList = async () => {
    const response = await axiosClient.get("/manager/staff/list")
    return response ? response.data : null
}