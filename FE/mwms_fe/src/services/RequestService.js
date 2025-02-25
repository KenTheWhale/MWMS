import {axiosClient} from "../config/api";

export const getImportRequest = async () => {
    const response = await axiosClient.get("/manager/request/import");
    return response && response.status === 200 ? response.data : null;
};

export const getExportRequest = async () => {
    const response = await axiosClient.get("/manager/request/export");
    return response && response.status === 200 ? response.data : null;
};

export const filterRequest = async () => {
    const response = await axiosClient.post("/manager/request/filter");
    return response && response.status === 200 ? response.data : null;
};


export const viewDetail = async (code) => {
    const response = await axiosClient.post("/manager/request/detail", {code});
    return response && response.status === 200 ? response.data : null;
}

export const getSupplierList = async () => {
    const response = await axiosClient.get("/manager/supplier");
    return response && response.status === 200 ? response.data : null;
};

export const getSupplierEquipment = async (id) => {
    const response = await axiosClient.post("/manager/equipment/supplier", {partnerId: id});
    return response && response.status === 200 ? response.data : null;
};


export const createRequestApplication = async (requestItems) => {
    const body = {requestItemList: requestItems};
    const response = await axiosClient.post("/manager/request/import", body);
    return response && response.status === 200 ? response.data : null;
}
