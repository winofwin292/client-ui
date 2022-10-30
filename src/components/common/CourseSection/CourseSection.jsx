import React, { memo } from "react";
import { courses } from "../CourseList/courseData";

import { formatterVND } from "utils";

function IconCheck() {
    return (
        <svg
            className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
            ></path>
        </svg>
    );
}

function CourseSection() {
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h2 className="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">
                        Các khóa học nổi bật
                    </h2>
                    <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
                        Trung tâm có rất nhiều khóa học với chất lượng được đảm
                        bảo ở mức cao nhất và dành cho nhiều đối tượng khác
                        nhau.
                    </p>
                </div>
                <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                    {courses.map((course, index) =>
                        course.showInLanding ? (
                            <div
                                key={index}
                                className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white"
                            >
                                <h3 className="mb-4 text-2xl font-semibold">
                                    {course.name}
                                </h3>
                                <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                                    Khai giảng: {course.startAt}
                                </p>
                                <div className="flex justify-center items-baseline my-8">
                                    <span className="mr-2 text-5xl font-extrabold">
                                        {formatterVND.format(course.price)}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        /khóa
                                    </span>
                                </div>
                                {/* <!-- List --> */}
                                <ul className="mb-8 space-y-4 text-left">
                                    {course.highlights.map(
                                        (highlight, indexHighlight) => (
                                            <li
                                                key={indexHighlight}
                                                className="flex items-center space-x-3"
                                            >
                                                {/* <!-- Icon --> */}
                                                <IconCheck />
                                                <span>{highlight}</span>
                                            </li>
                                        )
                                    )}
                                </ul>
                                <a
                                    href={"/course-introduction/" + course.id}
                                    className="text-white  bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-indigo-900"
                                >
                                    Xem chi tiết &rarr;
                                </a>
                            </div>
                        ) : (
                            ""
                        )
                    )}
                </div>
                <div className="mx-auto max-w-screen-md text-center mt-8 lg:mt-12">
                    <a
                        href="/course-introduction"
                        className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-indigo-900"
                    >
                        Xem thêm các khóa học khác &rarr;
                    </a>
                </div>
            </div>
        </section>
    );
}

export default memo(CourseSection);
