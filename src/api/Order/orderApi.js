import axiosClient from "api/axiosClient";

const orderApi = {
    getAllAdmin() {
        const url = "/order/get-all-admin";
        return axiosClient.get(url);
    },
    add(data) {
        const url = "/order/add";
        return axiosClient.post(url, data);
    },
    getByIdAdmin(data) {
        const url = "/order/get-by-id-admin";
        return axiosClient.post(url, data);
    },
    getById(data) {
        const url = "/order/get-by-id";
        return axiosClient.post(url, data);
    },
    getByPhone(data) {
        const url = "/order/get-by-phone";
        return axiosClient.post(url, data);
    },
    changeStatus(data) {
        const url = "/order/change-status";
        return axiosClient.post(url, data);
    },
};

export default orderApi;
