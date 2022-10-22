import axiosClient from "api/axiosClient";

const courseFormatApi = {
    getAllByCourseId(data) {
        const url = "/course-format/get-by-course";
        return axiosClient.post(url, data);
    },
    update(data) {
        const url = "/course-format/update";
        return axiosClient.post(url, data);
    },
};

export default courseFormatApi;
