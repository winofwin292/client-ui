import axiosClient from "api/axiosClient";

const requestContactApi = {
    getAll() {
        const url = "/contact/get-all";
        return axiosClient.get(url);
    },
    addRequestContact(data) {
        const url = "/contact/add";
        return axiosClient.post(url, data);
    },
    changeStatus(data) {
        const url = "/contact/change-status";
        return axiosClient.post(url, data);
    },
    cancelChangeStatus(data) {
        const url = "/contact/cancel-change-status";
        return axiosClient.post(url, data);
    },
};

export default requestContactApi;
