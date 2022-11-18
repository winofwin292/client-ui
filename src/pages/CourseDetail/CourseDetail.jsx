import React, { memo, useState, useEffect, useCallback } from "react";

import CircularProgress from "@mui/material/CircularProgress";

import { useParams, useNavigate } from "react-router-dom";

import { TopNav } from "components/common/TopNav";
import { Footer } from "components/common/Footer";
import { ContactDialog } from "components/common/ContactDialog";

import { formatterVND } from "utils";

import { CheckCircleIcon } from "@heroicons/react/24/outline";

import courseApi from "api/Course/courseApi";

function CourseDetail() {
    const [cTDState, setCTDState] = useState({
        isOpen: false,
        subject: "",
    });

    let { id } = useParams();
    const [course, setCourse] = useState(null);
    const navigate = useNavigate();

    const getData = useCallback(
        async (courseId) => {
            const data = {
                courseId: parseInt(courseId),
            };
            const response = await courseApi.getCourse(data);
            if (response.status === 200) {
                setCourse(response.data);
                document.title = response.data.name;
            } else {
                navigate("/404");
            }
        },
        [navigate]
    );

    useEffect(() => {
        getData(id);
    }, [getData, id]);

    const handleOpenCTD = () => {
        setCTDState({
            isOpen: true,
            subject: "Đăng ký khóa " + course.name,
        });
    };

    return (
        <div className="bg-white dark:bg-gray-900">
            <TopNav />
            <div className="pt-6">
                {course ? (
                    <>
                        <nav aria-label="Breadcrumb">
                            <ol className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                                <li>
                                    <div className="flex items-center">
                                        <a
                                            href="/course-introduction"
                                            className="mr-2 text-sm font-medium text-gray-900 dark:text-white hover:text-gray-500 dark:hover:text-gray-300"
                                        >
                                            Khóa học
                                        </a>
                                        <svg
                                            width={16}
                                            height={20}
                                            viewBox="0 0 16 20"
                                            fill="currentColor"
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                            className="h-5 w-4 text-gray-300 dark:text-white"
                                        >
                                            <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                                        </svg>
                                    </div>
                                </li>
                                <li className="text-sm">
                                    <a
                                        href={
                                            "/course-introduction/" + course.id
                                        }
                                        aria-current="page"
                                        className="font-medium text-gray-500 hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                                    >
                                        {course.name}
                                    </a>
                                </li>
                            </ol>
                        </nav>

                        {/* Image gallery */}
                        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
                            <div className="aspect-w-3 aspect-h-4 hidden overflow-hidden rounded-lg lg:block">
                                <img
                                    src={
                                        course.CourseImage[0]
                                            ? course.CourseImage[0].url
                                            : "https://st.ielts-fighter.com/src/ielts-fighter/2021/07/15/ebook-30-ngay-chinh-phuc-6-5-ielts-1.jpg"
                                    }
                                    alt="Ảnh 1"
                                    className="h-full w-full object-cover object-center"
                                />
                            </div>
                            <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
                                <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg">
                                    <img
                                        src={
                                            course.CourseImage[1]
                                                ? course.CourseImage[1].url
                                                : "https://www.ieltsasia.org/vn/sites/www.ieltsasia.org.vn/files/ielts-registration-39516.jpg"
                                        }
                                        alt="Ảnh 2"
                                        className="h-full w-full object-cover object-center"
                                    />
                                </div>
                                <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg">
                                    <img
                                        src={
                                            course.CourseImage[2]
                                                ? course.CourseImage[2].url
                                                : "https://jolo.edu.vn/images/jolo-articles/4_bai_viet/exams-ielts-banner.jpg"
                                        }
                                        alt="Ảnh 3"
                                        className="h-full w-full object-cover object-center"
                                    />
                                </div>
                            </div>
                            <div className="aspect-w-4 aspect-h-5 sm:overflow-hidden sm:rounded-lg lg:aspect-w-3 lg:aspect-h-4">
                                <img
                                    src={
                                        course.CourseImage[3]
                                            ? course.CourseImage[3].url
                                            : "https://www.aitutorsanta.com/vn/wp-content/uploads/sites/9/2021/08/paraphrasing.png"
                                    }
                                    alt="Ảnh 4"
                                    className="h-full w-full object-cover object-center"
                                />
                            </div>
                        </div>

                        {/* Product info */}
                        <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
                            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
                                    {course.name}
                                </h1>
                            </div>

                            {/* Options */}
                            <div className="mt-4 lg:row-span-3 lg:mt-0">
                                <h2 className="sr-only dark:text-white">
                                    Thông tin khóa học
                                </h2>
                                <p className="text-3xl tracking-tight text-gray-900 dark:text-white">
                                    {formatterVND.format(course.price)}
                                </p>

                                <div className="mt-10">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                            Thông tin cơ bản:
                                        </h3>
                                        <div className="mt-4">
                                            <ul className="list-disc space-y-2 pl-4 text-sm">
                                                <li className="text-gray-600 dark:text-white">
                                                    Loại:&nbsp;
                                                    <span className="text-gray-800 font-bold dark:text-white">
                                                        {
                                                            course
                                                                ?.TypeOfContent
                                                                .description
                                                        }
                                                    </span>
                                                </li>
                                                <li className="text-gray-600 dark:text-white">
                                                    Số lượng học viên:&nbsp;
                                                    <span className="text-gray-800 font-bold dark:text-white">
                                                        {course?.student_number}
                                                    </span>
                                                </li>
                                                <li className="text-gray-600 dark:text-white">
                                                    Nội dung:&nbsp;
                                                    <span className="text-gray-800 font-bold dark:text-white">
                                                        {course.content}
                                                    </span>
                                                    &nbsp;
                                                    {course.TypeOfContent.id ===
                                                    1
                                                        ? "buổi"
                                                        : "chuyên đề"}
                                                </li>
                                                <li className="text-gray-600 dark:text-white">
                                                    Thời lượng:&nbsp;
                                                    <span className="text-gray-800 font-bold dark:text-white">
                                                        {course.time}
                                                    </span>
                                                    &nbsp;giờ/
                                                    {course.TypeOfContent.id ===
                                                    1
                                                        ? "buổi"
                                                        : "chuyên đề"}
                                                </li>

                                                <li className="text-gray-600 dark:text-white">
                                                    Tổ chức lớp:&nbsp;
                                                    {course.CourseFormat.map(
                                                        (item, index) => (
                                                            <span
                                                                key={index}
                                                                className="text-gray-800 font-bold dark:text-white"
                                                            >
                                                                {index === 0
                                                                    ? ""
                                                                    : " - "}
                                                                {
                                                                    item.Formats
                                                                        .description
                                                                }
                                                            </span>
                                                        )
                                                    )}
                                                </li>
                                                {course.other_info ? (
                                                    <li className="text-gray-600 dark:text-white">
                                                        Thông tin khác:&nbsp;
                                                        <span className="text-gray-800 dark:text-white">
                                                            {course.other_info}
                                                        </span>
                                                    </li>
                                                ) : (
                                                    ""
                                                )}
                                            </ul>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleOpenCTD}
                                        className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Đăng ký
                                    </button>
                                </div>
                            </div>

                            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pb-16 lg:pr-8">
                                {course?.PurposeOfCourse.length > 0 ? (
                                    <div className="mt-2">
                                        <h3 className="flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                                            <CheckCircleIcon className="h-4 pr-2" />
                                            <span className="elf-center whitespace-nowrap dark:text-white">
                                                Mục tiêu chính của khóa học:
                                            </span>
                                        </h3>

                                        <div className="mt-4 ml-2">
                                            <ul className="list-disc space-y-2 pl-4 text-sm">
                                                {course.PurposeOfCourse.map(
                                                    (item, index) => (
                                                        <li
                                                            key={index}
                                                            className="text-gray-400 dark:text-gray-400"
                                                        >
                                                            <span className="text-gray-600 dark:text-gray-400">
                                                                {item.content}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}

                                {course?.PracticalContent.length > 0 ? (
                                    <div className="mt-8">
                                        <h3 className="flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                                            <CheckCircleIcon className="h-4 pr-2" />
                                            <span className="elf-center whitespace-nowrap dark:text-white">
                                                Các nội dung thực hành:
                                            </span>
                                        </h3>

                                        <div className="mt-4 ml-2">
                                            <ul className="list-disc space-y-2 pl-4 text-sm">
                                                {course.PracticalContent.map(
                                                    (item, index) => (
                                                        <li
                                                            key={index}
                                                            className="text-gray-400 dark:text-gray-400"
                                                        >
                                                            <span className="text-gray-600 dark:text-gray-400">
                                                                {item.content}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <CircularProgress />
                )}
            </div>
            <Footer />
            <ContactDialog cTDState={cTDState} setCTDState={setCTDState} />
        </div>
    );
}
export default memo(CourseDetail);
