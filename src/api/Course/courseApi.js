import axiosClient from "api/axiosClient";

const courseApi = {
    getAll() {
        const url = "/course/get-all";
        return axiosClient.get(url);
    },
    getCourse(data) {
        const url = "/course/get-course";
        return axiosClient.post(url, data);
    },
};

export default courseApi;
