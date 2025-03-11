import axiosClient from "../config/api.jsx";

//-----------------------------------------TASK-----------------------------------------//

export const getAllTasks = async () => {
    const id = parseInt(JSON.parse(localStorage.getItem('user')).id);
    const response = await axiosClient.get(`/staff/task/${id}`)
    return response ? response.data : null;
}