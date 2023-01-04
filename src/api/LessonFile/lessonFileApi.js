import axiosClient from "api/axiosClient";

const lessonFileApi = {
    delete(data) {
        const url = "/lesson-file/delete";
        return axiosClient.post(url, data);
    },
};

export default lessonFileApi;
