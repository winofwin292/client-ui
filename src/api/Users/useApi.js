import axiosClient from "api/axiosClient";

const userApi = {
    //Đăng kí
    // register(data) {
    //     const url = "/register";
    //     return axiosClient.post(url, data);
    // },
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
};

export default userApi;
