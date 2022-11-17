import axiosClient from "api/axiosClient";

const courseImageApi = {
    getAll(data) {
        const url = "/course-image/get-all";
        return axiosClient.post(url, data);
    },
    getAllAdmin(data) {
        const url = "/course-image/get-all-admin";
        return axiosClient.post(url, data);
    },
    add(data) {
        const url = "/course-image/add";
        return axiosClient.post(url, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    delete(data) {
        const url = "/course-image/delete";
        return axiosClient.post(url, data);
    },
    count(data) {
        const url = "/course-image/count";
        return axiosClient.post(url, data);
    },
};

export default courseImageApi;
