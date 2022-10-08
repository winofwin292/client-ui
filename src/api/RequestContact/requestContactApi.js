import axiosClient from "api/axiosClient";

const requestContactApi = {
    getAll() {
        const url = "/contact/get-all";
        return axiosClient.get(url);
    },
    addRequestContact(data) {
        const url = "/contact/add";
        return axiosClient.post(url, data);
    },
};

export default requestContactApi;
