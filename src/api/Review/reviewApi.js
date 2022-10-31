import axiosClient from "api/axiosClient";

const reviewApi = {
    getAll() {
        const url = "/review/get-all";
        return axiosClient.get(url);
    },
    getAllAdmin() {
        const url = "/review/get-all-admin";
        return axiosClient.get(url);
    },
    add(data) {
        const url = "/review/add";
        return axiosClient.post(url, data);
    },
    edit(data) {
        const url = "/review/edit";
        return axiosClient.post(url, data);
    },
    delete(data) {
        const url = "/review/delete";
        return axiosClient.post(url, data);
    },
};

export default reviewApi;
