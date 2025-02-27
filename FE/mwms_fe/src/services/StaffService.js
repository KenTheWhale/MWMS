import {axiosClient} from "../config/api";


export const getStaffList = async () => {
    const response = await axiosClient.get("/manager/staff/list")
    return response ? response.data : null
}

export const assignStaff = async (staffId, groupId, description, assignDate) => {
    const response = await axiosClient.post("/manager/staff/assign", {
        staffId: staffId,
        groupId: groupId,
        description: description,
        assignDate: assignDate
    })
    return response ? response.data : null;
}