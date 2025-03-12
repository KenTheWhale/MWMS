import axiosClient from "../config/api.jsx";

//-----------------------------------------GROUP-----------------------------------------//
export const getUnassignedGroups = async () => {
    const response = await axiosClient.get("/manager/group/unassign");
    return response ? response.data : null;
}

//-----------------------------------------CATEGORY-----------------------------------------//
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

//-----------------------------------------EQUIPMENT-----------------------------------------//
export const getEquipmentList = async () => {
    const response = await axiosClient.get("/manager/equipment")
    if (response.status === 200) {
        const body = response.data;
        return body.data;
    }
}

export const addEquipment = async (code, name, description, categoryId, unit) => {
    const response = await axiosClient.post("/manager/equipment", {
        code: code,
        name: name,
        description: description,
        categoryId: categoryId,
        unit: unit
    })
    if (response.status === 200) {
        const body = response.data;
        return body.data;
    }
}

export const updateEquipment = async (code, name, description, category, unit) => {
    const response = await axiosClient.put("/manager/equipment", {
        code: code,
        name: name,
        description: description,
        category: category,
        unit: unit
    })
    if (response.status === 200) {
        const body = response.data;
        return body.data;
    }
}

export const deleteEquipment = async () => {
    const response = await axiosClient.delete("/manager/equipment")
    if (response.status === 200) {
        const body = response.data;
        return body.data;
    }
}

//-----------------------------------------STAFF-----------------------------------------//
export const getStaffs = async () => {
    const response = await axiosClient.get("/manager/staff/list");
    return response ? response.data : null;
}

//-----------------------------------------TASK-----------------------------------------//

export const getTasks = async () => {
    const response = await axiosClient.get("/manager/task/list");
    return response ? response.data : null;
}

export const deleteTask = async (id) => {
    const response = await axiosClient.delete(`/manager/task/${id}`);
    return response ? response.data : null;
}

export const addTask = async (staffId, description, groupId) => {
    const response = await axiosClient.post(`/manager/task`, {
        staffId: staffId,
        description: description,
        groupId: groupId,
    })
    return response ? response.data : null;
}

export const getTaskByCode = async (code) => {
    const response = await axiosClient.post("/manager/task/detail", {
        code: code,
    })
    return response ? response.data : null;
}

//-----------------------------------------REQUEST-----------------------------------------//
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
    const response = await axiosClient.post("/manager/supplier/equipment", {partnerId: id});
    return response && response.status === 200 ? response.data : null;
};


export const createRequestApplication = async (requestItems) => {
    const body = {requestItemList: requestItems};
    const response = await axiosClient.post("/manager/request/import", body);
    return response && response.status === 200 ? response.data : null;
}

export const getSupplierRequestList = async (username) => {
    const response = await axiosClient.post("/supplier/request/list", { username: username });
    return response && response.status === 200 ? response.data : null;
}

export const approveRequest = async (code, status, username, deliveryDetail, rejectionReason) => {
    const response = await axiosClient.put("/supplier/request/status", { code: code, status: status, username: username,
        deliveryDate: deliveryDetail.deliveryDate, carrierName: deliveryDetail.carrierName, carrierPhone: deliveryDetail.carrierPhone , rejectionReason: rejectionReason});
    return response && response.status === 200 ? response.data.data : null;
}

export const updateRequestApplication = async (requestItemId,equipmentId,quantity) => {
    const body = {
        requestItemId,
        equipmentId,
        quantity
    }
    const response = await axiosClient.put("/manager/request/import", body);
    return response ? response.data : null;
}

export const updateItemQuantity = async (id, quantity) => {
    const response = await axiosClient.put("/supplier/request/item", {id: id, quantity: quantity});
    return response ? response.data : null;
}

export const cancelRequest = async (groupId) => {
    const response = await axiosClient.put("/manager/request/requestItem", groupId)
    return response && response.status === 200 ? response.data : null;
}