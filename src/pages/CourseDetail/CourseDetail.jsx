import React, { memo, useState } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { useParams } from "react-router-dom";
import { TopNav } from "components/common/TopNav";
import { Footer } from "components/common/Footer";
import { ContactDialog } from "components/common/ContactDialog";
import { CustomAlert } from "components/common/CustomAlert";

import { formatterVND, alertType } from "utils";

//example data
import { courses } from "../../components/common/CourseList/courseData";

const product = {
    images: [
        {
            src: "https://st.ielts-fighter.com/src/ielts-fighter/2021/07/15/ebook-30-ngay-chinh-phuc-6-5-ielts-1.jpg",
            alt: "Two each of gray, white, and black shirts laying flat.",
        },
        {
            src: "https://www.ieltsasia.org/vn/sites/www.ieltsasia.org.vn/files/ielts-registration-39516.jpg",
            alt: "Model wearing plain black basic tee.",
        },
        {
            src: "https://jolo.edu.vn/images/jolo-articles/4_bai_viet/exams-ielts-banner.jpg",
            alt: "Model wearing plain gray basic tee.",
        },
        {
            src: "https://www.aitutorsanta.com/vn/wp-content/uploads/sites/9/2021/08/paraphrasing.png",
            alt: "Model wearing plain white basic tee.",
        },
    ],
};
const reviews = { href: "#", average: 4, totalCount: 117 };

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function CourseDetail() {
    const [cTDState, setCTDState] = useState({
        isOpen: false,
        subject: "",
    });
    const [notify, setNotify] = React.useState({
        open: false,
        type: alertType.SUCCESS,
        msg: "",
    });

    let { id } = useParams();
    const course = courses.find((item) => item.id.toString() === id);

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
                                href={"/course-introduction/" + course.id}
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
                            src={product.images[0].src}
                            alt={product.images[0].alt}
                            className="h-full w-full object-cover object-center"
                        />
                    </div>
                    <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
                        <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg">
                            <img
                                src={product.images[1].src}
                                alt={product.images[1].alt}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                        <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg">
                            <img
                                src={product.images[2].src}
                                alt={product.images[2].alt}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                    </div>
                    <div className="aspect-w-4 aspect-h-5 sm:overflow-hidden sm:rounded-lg lg:aspect-w-3 lg:aspect-h-4">
                        <img
                            src={product.images[3].src}
                            alt={product.images[3].alt}
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

                        {/* Reviews */}
                        <div className="mt-6">
                            <h3 className="sr-only">Reviews</h3>
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {[0, 1, 2, 3, 4].map((rating) => (
                                        <StarIcon
                                            key={rating}
                                            className={classNames(
                                                reviews.average > rating
                                                    ? "text-gray-900  dark:text-white"
                                                    : "text-gray-200  dark:text-gray-500",
                                                "h-5 w-5 flex-shrink-0"
                                            )}
                                            aria-hidden="true"
                                        />
                                    ))}
                                </div>
                                <p className="sr-only">
                                    {reviews.average} out of 5 stars
                                </p>
                                <a
                                    href={reviews.href}
                                    className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-white"
                                >
                                    {reviews.totalCount} đánh giá
                                </a>
                            </div>
                        </div>

                        <div className="mt-10">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                    Thông tin cơ bản:
                                </h3>
                                <div className="mt-4">
                                    <ul className="list-disc space-y-2 pl-4 text-sm">
                                        <li className="text-gray-600 dark:text-white">
                                            Thời gian bắt đầu:&nbsp;
                                            <span className="text-gray-800 font-bold dark:text-white">
                                                {course.startAt}
                                            </span>
                                        </li>
                                        <li className="text-gray-600 dark:text-white">
                                            Số buổi:&nbsp;
                                            <span className="text-gray-800 font-bold dark:text-white">
                                                {course.trainingTime}
                                            </span>
                                            &nbsp;buổi
                                        </li>
                                        <li className="text-gray-600 dark:text-white">
                                            Số buổi mỗi tuần:&nbsp;
                                            <span className="text-gray-800 font-bold dark:text-white">
                                                {course.lessonPerWeek}
                                            </span>
                                            &nbsp;buổi
                                        </li>
                                        <li className="text-gray-600 dark:text-white">
                                            Số lượng học viên:&nbsp;
                                            <span className="text-gray-800 font-bold dark:text-white">
                                                {course.studentNumber}
                                            </span>
                                            &nbsp;người
                                        </li>
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
                        {/* Description and details */}
                        <div>
                            <h3 className="sr-only">Mô tả</h3>

                            <div className="space-y-6">
                                <p className="text-base text-gray-900 dark:text-white">
                                    {course.desc}
                                </p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                Điểm nổi bật của khóa học:
                            </h3>

                            <div className="mt-4">
                                <ul className="list-disc space-y-2 pl-4 text-sm">
                                    {course.highlights.map((highlight) => (
                                        <li
                                            key={highlight}
                                            className="text-gray-400 dark:text-gray-400"
                                        >
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {highlight}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <ContactDialog
                cTDState={cTDState}
                setCTDState={setCTDState}
                setNotify={setNotify}
            />
            <CustomAlert data={notify} onClose={setNotify} />
        </div>
    );
}
export default memo(CourseDetail);
