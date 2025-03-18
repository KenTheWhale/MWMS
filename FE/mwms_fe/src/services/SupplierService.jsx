import axiosClient from "../config/api.jsx";

export const getSupplierRequestList = async (username) => {
    const response = await axiosClient.post("/supplier/request/list", {username: username});
    return response.data;
}

export const approveRequest = async (code, status, username, deliveryDetail, rejectionReason) => {
    const response = await axiosClient.put("/supplier/request/status", {
        code: code,
        status: status,
        username: username,
        deliveryDate: deliveryDetail.deliveryDate,
        carrierName: deliveryDetail.carrierName,
        carrierPhone: deliveryDetail.carrierPhone,
        rejectionReason: rejectionReason
    });
    return response.data;
}