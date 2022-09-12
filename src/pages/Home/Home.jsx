import React, { memo, useEffect } from "react";
import { TopNav } from "pages/Home/components/TopNav";
import { Feature } from "pages/Home/components/Feature";
import { CallToAction } from "pages/Home/components/CallToAction";
import { TeacherSection } from "pages/Home/components/TeacherSection";
import { Footer } from "pages/Home/components/Footer";
import { CourseSection } from "pages/Home/components/CourseSection";
import { ReviewSection } from "pages/Home/components/ReviewSection";

import { isLoggedIn } from "utils";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setLayout } from "context";

//i18next translate
import { useTranslation } from "react-i18next";

const navOptions = [
    { title: "Trang chủ", path: "/" },
    {
        title: "Giới thiệu",
        path: "/",
        children: [
            { title: "Giới thiệu chung", path: "/" },
            { title: "Đội ngũ giáo viên", path: "/" },
        ],
    },
    {
        title: "Chương trình đào tạo",
        path: "/",
        children: [
            { title: "Trẻ em", path: "/" },
            { title: "Người lớn", path: "/" },
            { title: "Doanh nghiệp", path: "/" },
        ],
    },
    { title: "Cửa hàng", path: "/shop" },
    { title: "Hệ thống quản lý", path: "/login" },
];

const navigation = [
    { name: "Product", href: "#" },
    { name: "Features", href: "#" },
    { name: "Marketplace", href: "#" },
    { name: "Company", href: "#" },
];

function Home() {
    //controller có thể lấy layout phục vụ cho chức năng thêm
    // eslint-disable-next-line
    const [controller, dispatch] = useMaterialUIController();
    // const { direction, layout, openConfigurator, darkMode } = controller;

    const { t } = useTranslation();

    useEffect(() => {
        setLayout(dispatch, "home");
    }, [dispatch]);

    return (
        <div style={{ backgroundColor: "white" }}>
            {!isLoggedIn() && <TopNav routes={navOptions} prefix={""} />}
            {/* <BasicPage title={t("home.name")} icon={<HomeIcon />} /> */}
            {/* <h1>Home Page</h1>
            <div style={{ height: "1000px" }}></div> */}
            <div className="relative overflow-hidden bg-white">
                <div className="mx-auto max-w-7xl">
                    <div className="relative bg-white pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
                        <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">
                                        Data to enrich your
                                    </span>{" "}
                                    <span className="block text-indigo-600 xl:inline">
                                        online business
                                    </span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                                    Anim aute id magna aliqua ad ad non deserunt
                                    sunt. Qui irure qui lorem cupidatat commodo.
                                    Elit sunt amet fugiat veniam occaecat fugiat
                                    aliqua.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <a
                                            href="/"
                                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg"
                                        >
                                            Get started
                                        </a>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <a
                                            href="/"
                                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-100 px-8 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-200 md:py-4 md:px-10 md:text-lg"
                                        >
                                            Live demo
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img
                        className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"
                        src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
                        alt=""
                    />
                </div>
            </div>
            <Feature />
            <TeacherSection />
            <CourseSection />
            <ReviewSection />
            <CallToAction />
            <Footer />
        </div>
    );
}

export default memo(Home);
