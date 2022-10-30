import axiosClient from "api/axiosClient";

const formatApi = {
    getAll() {
        const url = "/format/get-all";
        return axiosClient.get(url);
    },
};

export default formatApi;
