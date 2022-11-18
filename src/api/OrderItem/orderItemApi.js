import axiosClient from "api/axiosClient";

const orderItemApi = {
    getStatistical(data) {
        const url = "/order-item/get-statistical";
        return axiosClient.post(url, data);
    },
};

export default orderItemApi;
