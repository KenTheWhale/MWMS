import {axiosClient} from "../config/api.jsx";

export const getUnAssignedItemGroup = async () => {
    const response = await axiosClient.get("/manager/item/group/unassigned")
    return response ? response.data : null;
}