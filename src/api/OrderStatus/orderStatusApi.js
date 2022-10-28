import axiosClient from "api/axiosClient";

const orderStatusApi = {
    getAll() {
        const url = "/order-status/get-all";
        return axiosClient.get(url);
    },
};

export default orderStatusApi;
