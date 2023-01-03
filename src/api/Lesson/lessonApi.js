import axiosClient from "api/axiosClient";

const lessonApi = {
    add(data) {
        const url = "/lesson/add";
        return axiosClient.post(url, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    edit(data) {
        const url = "/lesson/edit";
        return axiosClient.post(url, data);
    },
    delete(data) {
        const url = "/lesson/delete";
        return axiosClient.post(url, data);
    },
};

export default lessonApi;
