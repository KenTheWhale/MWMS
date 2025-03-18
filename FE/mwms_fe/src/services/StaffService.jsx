import axiosClient from "../config/api.jsx";

//-----------------------------------------TASK-----------------------------------------//

export const getAllTasks = async () => {
    const id = parseInt(JSON.parse(localStorage.getItem('user')).id);
    const response = await axiosClient.get(`/staff/task/${id}`)
    return response ? response.data : null;
}


export const getAllArea = async () => {
    const response = await axiosClient.get("/staff/area");
    return response ? response.data : null;
}

//-----------------------------------------BATCH-----------------------------------------//

export const createBatch = async (quantity, requestItemId, length, width, positionId) => {
    const response = await axiosClient.post(`/staff/batch`, {
        quantity: quantity,
        requestItemId: requestItemId,
        length: length,
        width: width,
        positionId: positionId,
    })

    return response ? response.data : null;
}