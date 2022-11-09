import axiosClient from "api/axiosClient";

const overviewApi = {
    getData(data) {
        const url = "/overview/get-data";
        return axiosClient.post(url, data);
    },
};

export default overviewApi;
