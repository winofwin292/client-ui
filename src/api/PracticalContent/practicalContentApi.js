import axiosClient from "api/axiosClient";

const practicalContentApi = {
    getByCourseId(data) {
        const url = "/practical-content/get-by-course";
        return axiosClient.post(url, data);
    },
    add(data) {
        const url = "/practical-content/add";
        return axiosClient.post(url, data);
    },
    edit(data) {
        const url = "/practical-content/edit";
        return axiosClient.post(url, data);
    },
    delete(data) {
        const url = "/practical-content/delete";
        return axiosClient.post(url, data);
    },
};

export default practicalContentApi;
