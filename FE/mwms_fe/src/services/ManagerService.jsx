import axiosClient from "../config/api.jsx";

//-----------------------------------------GROUP-----------------------------------------//
export const getUnassignedGroups = async () => {
    const response = await axiosClient.get("/manager/group/unassign");
    return response ? response.data : null;
}

//-----------------------------------------CATEGORY-----------------------------------------//
export const getCategoryList = async () => {
    const response = await axiosClient.get("/manager/category")
    return response.data;
}

export const addCategory = async (code, name, description) => {
    const data = {
        code: code,
        name: name,
        description: description
    }
    const response = await axiosClient.post("/manager/category", data)
    return response.data;
}

export const updateCategory = async (code, name, description) => {
    const response = await axiosClient.put("/manager/category", {
        code: code,
        name: name,
        description: description
    })
    return response.data;
}

export const deleteCategory = async (code) => {
    const response = await axiosClient.delete(`/manager/category/${code}`)
        return response.data;
}

//-----------------------------------------EQUIPMENT-----------------------------------------//
export const getEquipmentList = async () => {
    const response = await axiosClient.get("/manager/equipment")
    return response.data;
}

export const addEquipment = async (code, name, description, categoryId, unit) => {
    const response = await axiosClient.post("/manager/equipment", {
        code: code,
        name: name,
        description: description,
        categoryId: categoryId,
        unit: unit
    })
    return response.data;
}

export const updateEquipment = async (code, name, description, categoryId, unit) => {
    const response = await axiosClient.put("manager/equipment", {
        code: code,
        name: name,
        description: description,
        categoryId: categoryId,
        unit: unit
    })
    return response.data;
}

export const deleteEquipment = async (code) => {
    const response = await axiosClient.delete(`manager/equipment/${code}`)
    console.log(response.data)
    return response.data;
}

//-----------------------------------------STAFF-----------------------------------------//
export const getStaffs = async () => {
    const response = await axiosClient.get("/manager/staff/list");
    return response.data;
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

export const getAllBatches = async () => {
    const response = await axiosClient.get("/manager/batch/list");
    return response ? response.data : null;
}

//-----------------------------------------REQUEST-----------------------------------------//
export const getImportRequest = async () => {
    const response = await axiosClient.get("/manager/request/import");
    return response && response.status === 200 ? response.data : null;
};

export const getExportRequest = async () => {
    const response = await axiosClient.get("/manager/request/export");
    console.log(response)
    console.log(response.data.data)
    console.log(response.data.success)
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
    const response = await axiosClient.post("/manager/supplier/equipment", {eqId: id});
    return response && response.status === 200 ? response.data : null;
};

export const getEquipmentSupplier = async (id) => {
    const response = await axiosClient.post("/manager/equipment/supplier", {partnerId: id});
    return response && response.status === 200 ? response.data : null;
};


export const createRequestApplication = async (requestItems) => {
    const body = {requestItemList: requestItems};
    const response = await axiosClient.post("/manager/request/import", body);
    return response && response.status === 200 ? response.data : null;
}

export const updateRequestApplication = async (requestItemId, equipmentId, quantity) => {
    const body = {
        requestItemId,
        equipmentId,
        quantity
    }
    const response = await axiosClient.put("/manager/request/import", body);
    return response ? response.data : null;
}

export const cancelRequest = async (groupId) => {
    const response = await axiosClient.put("/manager/request/requestItem", groupId)
    return response && response.status === 200 ? response.data : null;
}

export const getHistoryImportList = async () => {
    const response = await axiosClient.get("/manager/request/history");
    return response ? response.data : null;
}

//-----------------------------------------DASHBOARD-----------------------------------------//
export const getDashboardData = async () => {
    const response = await axiosClient.get("/manager/data");
    return response ? response.data : null;
}