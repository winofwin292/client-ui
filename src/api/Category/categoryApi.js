import axiosClient from "api/axiosClient";

const categoryApi = {
    getAll() {
        const url = "/category/get-all";
        return axiosClient.get(url);
    },
    getAllAdmin() {
        const url = "/category/get-all-admin";
        return axiosClient.get(url);
    },
    add(data) {
        const url = "/category/add";
        return axiosClient.post(url, data);
    },
    edit(data) {
        const url = "/category/edit";
        return axiosClient.post(url, data);
    },
    delete(data) {
        const url = "/category/delete";
        return axiosClient.post(url, data);
    },
};

export default categoryApi;
