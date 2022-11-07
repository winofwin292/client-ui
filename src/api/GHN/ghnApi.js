import axiosClient from "api/axiosClient";

const ghnApi = {
    getProvince() {
        const url = "/ghn/get-province";
        return axiosClient.get(url);
    },
    getDistrict(data) {
        const url = "/ghn/get-district";
        return axiosClient.post(url, data);
    },
    getWard(data) {
        const url = "/ghn/get-ward";
        return axiosClient.post(url, data);
    },
    getTokenPrint(data) {
        const url = "/ghn/get-token-print";
        return axiosClient.post(url, data);
    },
};

export default ghnApi;
