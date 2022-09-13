import React, { memo, useEffect } from "react";
import { TopNav } from "pages/Home/components/TopNav";
import { CarouselImage } from "pages/Home/components/CarouselImage";
import { SocialProof } from "pages/Home/components/SocialProof";
import { Feature } from "pages/Home/components/Feature";
import { TeacherSection } from "pages/Home/components/TeacherSection";
import { CourseSection } from "pages/Home/components/CourseSection";
import { ReviewSection } from "pages/Home/components/ReviewSection";
import { CallToAction } from "pages/Home/components/CallToAction";
import { Footer } from "pages/Home/components/Footer";

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
                    <div className="relative bg-white pb-8 sm:pb-8 md:pb-10 lg:w-full lg:max-w-2xl lg:pb-12 xl:pb-16">
                        <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">
                                        Chào mừng bạn đến với
                                    </span>{" "}
                                    <span className="block text-indigo-600 xl:inline">
                                        Trung tâm ngoại ngữ ABC
                                    </span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <a
                                            href="/"
                                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-1 md:px-7 md:text-lg"
                                        >
                                            Giới thiệu &gt;&gt;&gt;
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <CarouselImage />
                </div>
            </div>
            <Feature />
            <SocialProof />
            <TeacherSection />
            <CourseSection />
            <ReviewSection />
            <CallToAction />
            <Footer />
        </div>
    );
}

export default memo(Home);
