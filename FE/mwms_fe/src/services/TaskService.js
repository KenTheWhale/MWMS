import {axiosClient} from "../config/api";

export const getTaskList = async () => {
    const response = await axiosClient.get("/manager/task/list")
    return response && response.status === 200 ? response.data : null;
}