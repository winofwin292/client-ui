import axiosClient from "api/axiosClient";

const userApi = {
    //Đăng kí
    register(data) {
        const url = "/auth/register";
        return axiosClient.post(url, data);
    },
    //Đăng nhập
    login(data) {
        const url = "/auth/login";
        return axiosClient.post(url, data);
    },
    logout() {
        const url = "/auth/logout";
        return axiosClient.get(url);
    },
    getNewAccessToken() {
        const url = "/auth/refresh";
        return axiosClient.get(url);
    },
    //Lấy thông tin của user id được truyền vào
    getProfile(data) {
        const url = "/users/profile";
        return axiosClient.post(url, data);
    },
    getProfileUpdate(data) {
        const url = "/users/profile-update";
        return axiosClient.post(url, data);
    },
    getAllStaff(data) {
        const url = "/users/staff/get-all";
        return axiosClient.get(url, data);
    },
    getAllTeacher(data) {
        const url = "/users/teacher/get-all";
        return axiosClient.get(url, data);
    },
    getAllStudent(data) {
        const url = "/users/student/get-all";
        return axiosClient.get(url, data);
    },
    editUserInfo(data) {
        const url = "/users/edit";
        return axiosClient.post(url, data);
    },
    resetPassword(data) {
        const url = "/users/reset-password";
        return axiosClient.post(url, data);
    },
    changeState(data) {
        const url = "/users/change-state";
        return axiosClient.post(url, data);
    },
    changePassword(data) {
        const url = "/users/change-password";
        return axiosClient.post(url, data);
    },
    deleteUser(data) {
        const url = "/users/delete";
        return axiosClient.post(url, data);
    },
};

export default userApi;
