import axiosClient from "api/axiosClient";

const deliveryMethodApi = {
    getAll() {
        const url = "/delivery/get-all";
        return axiosClient.get(url);
    },
};

export default deliveryMethodApi;
