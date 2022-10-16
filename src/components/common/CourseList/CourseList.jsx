import React, { memo, useEffect, useState, useCallback } from "react";
import { useSnackbar } from "notistack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { formatterVND } from "utils";

import courseApi from "api/Course/courseApi";

function CourseList(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [courses, setCourses] = useState([]);

    const getData = useCallback(async () => {
        const response = await courseApi.getAll();
        if (response.status === 200) {
            setCourses(response.data);
        } else {
            enqueueSnackbar(response.data, {
                variant: "error",
                action: (key) => (
                    <IconButton
                        size="small"
                        onClick={() => closeSnackbar(key)}
                        style={{
                            color: "white",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ),
            });
        }
    }, [closeSnackbar, enqueueSnackbar]);

    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8 lg:py-12">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Danh sách khóa học
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {courses.map((course) => (
                        <div key={course.id} className="group relative">
                            <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80 ">
                                <a href={"/course-introduction/" + course.id}>
                                    <img
                                        src="https://www.ieltsasia.org/vn/sites/www.ieltsasia.org.vn/files/ielts-registration-39516.jpg"
                                        alt={course.name}
                                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                    />
                                </a>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-white">
                                        <a
                                            href={
                                                "/course-introduction/" +
                                                course.id
                                            }
                                            className="font-bold"
                                        >
                                            {/* <span
                                                aria-hidden="true"
                                                className="absolute inset-0"
                                            /> */}
                                            {course.name}
                                        </a>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-white">
                                        Loại: {course.TypeOfContent.description}
                                    </p>
                                </div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {formatterVND.format(course.price)}
                                </p>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <a
                                    href={"/course-introduction/" + course.id}
                                    className="text-white text-center w-full bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800"
                                >
                                    Chi tiết
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default memo(CourseList);
