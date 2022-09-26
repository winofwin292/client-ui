import axios from "axios";
import Cookies from "js-cookie";

//Cấu hình chung cho axios
const axiosClient = axios.create({
    // baseURL: "http://127.0.0.1:8081/",
    headers: {
        "content-type": "application/json",
    },
});

//Tự động thêm token khi gởi request
// axiosClient.interceptors.request.use(
//     function (config) {
//         const customHeaders = {};

//         const accessToken = localStorage.getItem(StorageKeys.access);
//         if (accessToken) {
//             customHeaders.Authorization = `Bearer ${accessToken}`;
//         }
//         return {
//             ...config,
//             headers: {
//                 ...customHeaders,
//                 ...config.headers,
//             },
//         };
//     },
//     function (error) {
//         return Promise.reject(error);
//     }
// );

//Xử lý response trả về
axiosClient.interceptors.response.use(
    function (response) {
        return response;
    },
    //kiểm tra lỗi xác thực
    function (error) {
        const { status } = error.response;
        if (status === 401 || status === 403) {
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            Cookies.remove("userData");
            window.location.href = "/login";
        }
        return error.response;
    }
);

export default axiosClient;
