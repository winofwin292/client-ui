import axios from "axios";
// import StorageKeys from "~/constants/storage-keys";

//Cấu hình chung cho axios
const axiosClient = axios.create({
    //baseURL: 'http://192.168.2.176:8081/',
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
    function (error) {
        return error.response;
    }
);

export default axiosClient;
