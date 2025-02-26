import {axiosClient} from "../config/api";

export const getEquipmentList = async () => {
        const response = await axiosClient.get("/manager/equipment")
        if (response.status === 200) {
            const body = response.data;
            return body.data;
        }
}


export const addEquipment = async (code, name, description, categoryId, unit, price) => {
    const response = await axiosClient.post("/manager/equipment", {
        code: code,
        name: name,
        description: description,
        categoryId: categoryId,
        unit: unit,
        price: price
    })
    if (response.status === 200) {
        const body = response.data;
        return body.data;
    }
}

export const updateEquipment = async () => {
    const response = await axiosClient.put("/manager/equipment")
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
