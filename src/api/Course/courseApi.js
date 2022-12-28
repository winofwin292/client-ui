import axiosClient from "api/axiosClient";

const courseApi = {
    getAll() {
        const url = "/course/get-all";
        return axiosClient.get(url);
    },
    getAllAdmin() {
        const url = "/course/get-all-admin";
        return axiosClient.get(url);
    },
    getAllLanding() {
        const url = "/course/get-all-landing";
        return axiosClient.get(url);
    },
    getAllLandingAdmin() {
        const url = "/course/get-all-landing-admin";
        return axiosClient.get(url);
    },
    getCourse(data) {
        const url = "/course/get-course";
        return axiosClient.post(url, data);
    },
    getCourseForAssign() {
        const url = "/course/get-for-assign";
        return axiosClient.get(url);
    },
    addCourse(data) {
        const url = "/course/add";
        return axiosClient.post(url, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    editCourse(data) {
        const url = "/course/edit";
        return axiosClient.post(url, data);
    },
    deleteCourse(data) {
        const url = "/course/delete";
        return axiosClient.post(url, data);
    },
    changeShowLanding(data) {
        const url = "/course/change-show-landing";
        return axiosClient.post(url, data);
    },
    getAnnouncement(data) {
        const url = "/course/get-announcement";
        return axiosClient.post(url, data);
    },
};

export default courseApi;
