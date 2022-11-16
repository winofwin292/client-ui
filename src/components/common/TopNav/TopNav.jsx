import React, { memo } from "react";

/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
    Bars3Icon,
    XMarkIcon,
    BuildingLibraryIcon,
    AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { useLocation } from "react-router-dom";

import { isLoggedIn } from "utils";

const solutions = [
    {
        name: "Giới thiệu chung",
        description:
            "Giới thiệu chung về chung trung tâm và các thông tin liên quan.",
        href: "/introduction",
        icon: BuildingLibraryIcon,
    },
    {
        name: "Đội ngũ giáo viên, nhân viên",
        description: "Thông tin về giáo viên, nhân viên của trung tâm.",
        href: "/teacher-introduction",
        icon: AcademicCapIcon,
    },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function TopNav() {
    const location = useLocation();
    const path = location.pathname;

    return (
        <Popover className="relative bg-white dark:bg-gray-900">
            <div className="mx-auto max-w-8xl px-4 sm:px-6">
                <div className="flex items-center justify-between border-b-2 border-gray-100 dark:border-gray-900 py-6 md:justify-start md:space-x-10 ">
                    <div className="flex justify-start lg:w-0 lg:flex-1">
                        <a href="/">
                            <span className="sr-only">Trung tâm ABC</span>
                            <img
                                className="h-8 w-auto sm:h-10"
                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                alt=""
                            />
                        </a>
                    </div>
                    <div className="-my-2 -mr-2 md:hidden">
                        <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white dark:bg-gray-900 p-2 text-gray-400 dark:hover:text-white hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Menu</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                    </div>
                    <Popover.Group
                        as="nav"
                        className="hidden space-x-10 md:flex"
                    >
                        <a
                            href="/"
                            className={classNames(
                                path === "/" ? "underline" : "",
                                "text-base font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                        >
                            Trang chủ
                        </a>
                        <Popover className="relative">
                            {({ open }) => (
                                <>
                                    <Popover.Button
                                        className={classNames(
                                            open
                                                ? "text-gray-900"
                                                : "text-gray-500",
                                            "group inline-flex items-center rounded-md bg-white dark:bg-gray-900 text-base font-medium hover:text-gray-900 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-indigo-50 dark:focus:ring-offset-0 dark:focus:text-gray-100"
                                        )}
                                    >
                                        <span
                                            className={classNames(
                                                path === "/introduction"
                                                    ? "underline"
                                                    : "",
                                                path === "/teacher-introduction"
                                                    ? "underline"
                                                    : ""
                                            )}
                                        >
                                            Giới thiệu
                                        </span>
                                        <ChevronDownIcon
                                            className={classNames(
                                                open
                                                    ? "text-gray-600"
                                                    : "text-gray-400",
                                                "ml-2 h-5 w-5 group-hover:text-gray-500 dark:hover:text-gray-200"
                                            )}
                                            aria-hidden="true"
                                        />
                                    </Popover.Button>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel className="absolute z-10 -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
                                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                                <div className="relative grid gap-6 bg-white dark:bg-gray-800  px-5 py-6 sm:gap-8 sm:p-8">
                                                    {solutions.map((item) => (
                                                        <a
                                                            key={item.name}
                                                            href={item.href}
                                                            className="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                        >
                                                            <item.icon
                                                                className="h-6 w-6 flex-shrink-0 text-indigo-600"
                                                                aria-hidden="true"
                                                            />
                                                            <div className="ml-4">
                                                                <p
                                                                    className={classNames(
                                                                        path ===
                                                                            item.href
                                                                            ? "underline"
                                                                            : "",
                                                                        "text-base font-medium text-gray-900 dark:text-gray-200 "
                                                                    )}
                                                                >
                                                                    {item.name}
                                                                </p>
                                                                <p className="mt-1 text-sm text-gray-500">
                                                                    {
                                                                        item.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>

                        <a
                            href="/course-introduction"
                            className={classNames(
                                path === "/course-introduction"
                                    ? "underline"
                                    : "",
                                "text-base font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                        >
                            Khóa học
                        </a>
                        <a
                            href="/need-to-know"
                            className={classNames(
                                path === "/need-to-know" ? "underline" : "",
                                "text-base font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                        >
                            Học viên cần biết
                        </a>
                        <a
                            href="/shop"
                            className={classNames(
                                path === "/shop" ? "underline" : "",
                                "text-base font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                        >
                            Cửa hàng tài liệu
                        </a>
                    </Popover.Group>
                    <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
                        <a
                            href={isLoggedIn() ? "/dashboard/*" : "/login"}
                            className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                            {isLoggedIn() ? "Hệ thống quản lý" : "Đăng nhập"}
                        </a>
                    </div>
                </div>
            </div>

            <Transition
                as={Fragment}
                enter="duration-200 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="duration-100 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <Popover.Panel
                    focus
                    className="absolute inset-x-0 z-10 top-0 origin-top-right transform p-2 transition md:hidden"
                >
                    <div className="divide-y-2 divide-gray-50 rounded-lg bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="px-5 pt-5 pb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <img
                                        className="h-8 w-auto"
                                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                        alt="Your Company"
                                    />
                                </div>
                                <div className="-mr-2">
                                    <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white dark:bg-gray-900 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                        <span className="sr-only">Đóng</span>
                                        <XMarkIcon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    </Popover.Button>
                                </div>
                            </div>
                            <div className="mt-6">
                                <nav className="grid gap-y-8">
                                    {solutions.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50"
                                        >
                                            <item.icon
                                                className="h-6 w-6 flex-shrink-0 text-indigo-600"
                                                aria-hidden="true"
                                            />
                                            <span
                                                className={classNames(
                                                    path === item.href
                                                        ? "underline"
                                                        : "",
                                                    "ml-3 text-base font-medium text-gray-900 dark:text-white"
                                                )}
                                            >
                                                {item.name}
                                            </span>
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </div>
                        <div className="space-y-6 py-6 px-5 bg-white dark:bg-gray-900">
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                <a
                                    href="/"
                                    className={classNames(
                                        location.pathname === "/"
                                            ? "underline"
                                            : "",
                                        "text-base font-medium dark:text-white text-gray-900 hover:text-gray-700"
                                    )}
                                >
                                    Trang chủ
                                </a>
                                <a
                                    href="/course-introduction"
                                    className={classNames(
                                        path.includes("course-introduction")
                                            ? "underline"
                                            : "",
                                        "text-base font-medium dark:text-white text-gray-900 hover:text-gray-700"
                                    )}
                                >
                                    Khóa học
                                </a>

                                <a
                                    href="/need-to-know"
                                    className={classNames(
                                        path === "/need-to-know"
                                            ? "underline"
                                            : "",
                                        "text-base font-medium dark:text-white text-gray-900 hover:text-gray-700"
                                    )}
                                >
                                    Học viên cần biết
                                </a>
                                <a
                                    href="/shop"
                                    className={classNames(
                                        path.includes("/shop")
                                            ? "underline"
                                            : "",
                                        "text-base font-medium dark:text-white text-gray-900 hover:text-gray-700"
                                    )}
                                >
                                    Cửa hàng tài liệu
                                </a>
                            </div>
                            <div>
                                <a
                                    href={
                                        isLoggedIn() ? "/dashboard/*" : "/login"
                                    }
                                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                >
                                    {isLoggedIn()
                                        ? "Hệ thống quản lý"
                                        : "Đăng nhập"}
                                </a>
                            </div>
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
}

export default memo(TopNav);
