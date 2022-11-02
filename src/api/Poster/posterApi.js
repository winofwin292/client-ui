import axiosClient from "api/axiosClient";

const posterApi = {
    getAll() {
        const url = "/poster/get-all";
        return axiosClient.get(url);
    },
    getAllAdmin() {
        const url = "/poster/get-all-admin";
        return axiosClient.get(url);
    },
    add(data) {
        const url = "/poster/add";
        return axiosClient.post(url, data);
    },
    changeImage(data) {
        const url = "/poster/change-image";
        return axiosClient.post(url, data);
    },
    edit(data) {
        const url = "/poster/edit";
        return axiosClient.post(url, data);
    },
    delete(data) {
        const url = "/poster/delete";
        return axiosClient.post(url, data);
    },
};

export default posterApi;
