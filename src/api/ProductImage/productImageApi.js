import axiosClient from "api/axiosClient";

const productImageApi = {
    getAll(data) {
        const url = "/product-image/get-all";
        return axiosClient.post(url, data);
    },
    getAllAdmin(data) {
        const url = "/product-image/get-all-admin";
        return axiosClient.post(url, data);
    },
    add(data) {
        const url = "/product-image/add";
        return axiosClient.post(url, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    delete(data) {
        const url = "/product-image/delete";
        return axiosClient.post(url, data);
    },
};

export default productImageApi;
