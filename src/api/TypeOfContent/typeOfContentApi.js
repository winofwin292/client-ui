import axiosClient from "api/axiosClient";

const typeOfContentApi = {
    getAll() {
        const url = "/type/get-all";
        return axiosClient.get(url);
    },
};

export default typeOfContentApi;
