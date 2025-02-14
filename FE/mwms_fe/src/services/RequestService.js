import axiosClient from "../config/api.jsx";

export const getImportRequest = async () => {
    try {
        const response = await axiosClient.get("/manager/request/import")
        if (response) {
            const body = response.data;
            return body.data;
        }
    } catch (error) {
        throw error;
    }
}

export const getExportRequest = async () => {
    try {
        const response = await axiosClient.get("/manager/request/export");

        if (response && response.status === 200) {
            const body = response.data;
            return  body.data;
        } else {
            throw new Error("Failed to fetch export requests");
        }
    } catch (error) {
        console.error("Error fetching export requests:", error);
        return { error: "Can not fetch export requests" };
    }
};

export const filterRequest = async () => {
    try {
        const response = await axiosClient.post("/manager/request/filter");
        if (response && response.status === 200) {
            const body = response.data;
            return body.data;
        }else {
            throw new Error("Failed to filter requests");
        }
    } catch (error) {
        console.error("Error filtering request:", error);
        return { error: "Can not filter requests" };
    }
}

export const viewRequestDetail = async (code) => {
    try{
        const data = { code: code };
        const response = await axiosClient.post("/manager/request/detail", data);
        const body = response.data;
        return body.data;
    } catch (error) {
        throw error;
    }
}