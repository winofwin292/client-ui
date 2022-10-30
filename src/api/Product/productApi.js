import axiosClient from "api/axiosClient";

const productApi = {
    getAll() {
        const url = "/product/get-all";
        return axiosClient.get(url);
    },
    getAllAdmin() {
        const url = "/product/get-all-admin";
        return axiosClient.get(url);
    },
    getProduct(data) {
        const url = "/product/get-product";
        return axiosClient.post(url, data);
    },
    add(data) {
        const url = "/product/add";
        return axiosClient.post(url, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    edit(data) {
        const url = "/product/edit";
        return axiosClient.post(url, data);
    },
    delete(data) {
        const url = "/product/delete";
        return axiosClient.post(url, data);
    },
};

export default productApi;
