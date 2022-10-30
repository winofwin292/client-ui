import axiosClient from "api/axiosClient";

const purposeOfCourseApi = {
    getByCourseId(data) {
        const url = "/purpose-of-course/get-by-course";
        return axiosClient.post(url, data);
    },
    add(data) {
        const url = "/purpose-of-course/add";
        return axiosClient.post(url, data);
    },
    edit(data) {
        const url = "/purpose-of-course/edit";
        return axiosClient.post(url, data);
    },
    delete(data) {
        const url = "/purpose-of-course/delete";
        return axiosClient.post(url, data);
    },
};

export default purposeOfCourseApi;
