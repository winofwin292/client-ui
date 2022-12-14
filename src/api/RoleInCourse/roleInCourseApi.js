import axiosClient from "api/axiosClient";

const roleInCourseApi = {
    add(data) {
        const url = "/role-in-course/add";
        return axiosClient.post(url, data);
    },
    delete(data) {
        const url = "/role-in-course/delete";
        return axiosClient.post(url, data);
    },
    getCourse(data) {
        const url = "/role-in-course/get-course-by-user";
        return axiosClient.post(url, data);
    },
};

export default roleInCourseApi;
