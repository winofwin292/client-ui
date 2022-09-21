import React, { memo } from "react";

const course = [
    {
        name: "Starter",
        desc: "Best option for personal use & for your next project.",
        price: "$29",
        unitPrice: "/month",
        attribute: [
            "Individual configuration",
            "No setup, or hidden fees",
            "Team size: 1 developer",
            "Premium support: 6 months",
            "Free updates: 6 months",
        ],
    },
    {
        name: "Company",
        desc: "Relevant for multiple users, extended & premium support.",
        price: "$99",
        unitPrice: "/month",
        attribute: [
            "Individual configuration",
            "No setup, or hidden fees",
            "Team size: 10 developers",
            "Premium support: 24 months",
            "Free updates: 24 months",
        ],
    },
    {
        name: "Enterprise",
        desc: "Best for large scale uses and extended redistribution rights.",
        price: "$499",
        unitPrice: "/month",
        attribute: [
            "Individual configuration",
            "No setup, or hidden fees",
            "Team size: 100+ developers",
            "Premium support: 36 months",
            "Free updates: 36 months",
        ],
    },
];

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

function CourseSection(props) {
    const handleOpenCTD = (e) => {
        const subject = e.target.parentNode.firstChild.innerText;
        props.setCTDState({
            isOpen: true,
            subject: subject,
        });
    };

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h2 className="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">
                        Các khóa học nổi bật
                    </h2>
                    <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
                        Here at Flowbite we focus on markets where technology,
                        innovation, and capital can unlock long-term value and
                        drive economic growth.
                    </p>
                </div>
                <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                    {course.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white"
                        >
                            <h3 className="mb-4 text-2xl font-semibold">
                                {item.name}
                            </h3>
                            <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                                {item.desc}
                            </p>
                            <div className="flex justify-center items-baseline my-8">
                                <span className="mr-2 text-5xl font-extrabold">
                                    {item.price}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">
                                    {item.unitPrice}
                                </span>
                            </div>
                            {/* <!-- List --> */}
                            <ul className="mb-8 space-y-4 text-left">
                                {item.attribute.map((itemA, indexA) => (
                                    <li
                                        key={indexA}
                                        className="flex items-center space-x-3"
                                    >
                                        {/* <!-- Icon --> */}
                                        <IconCheck />
                                        <span>{itemA}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                className="text-white  bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-indigo-900"
                                onClick={handleOpenCTD}
                            >
                                Tham gia ngay
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default memo(CourseSection);
