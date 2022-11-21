import React, { memo, useEffect, useState, lazy, Suspense } from "react";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setLayout } from "context";

import Loading from "components/common/Loading/Loading";

//i18next translate
// import { useTranslation } from "react-i18next";

const TopNav = lazy(() => import("components/common/TopNav/TopNav"));
const CarouselImage = lazy(() =>
    import("components/common/CarouselImage/CarouselImage")
);
const SocialProof = lazy(() =>
    import("components/common/SocialProof/SocialProof")
);
const Feature = lazy(() => import("components/common/Feature/Feature"));
const TeacherSection = lazy(() =>
    import("components/common/TeacherSection/TeacherSection")
);
const CourseSection = lazy(() =>
    import("components/common/CourseSection/CourseSection")
);
const ReviewSection = lazy(() =>
    import("components/common/ReviewSection/ReviewSection")
);
const CallToAction = lazy(() =>
    import("components/common/CallToAction/CallToAction")
);
const Footer = lazy(() => import("components/common/Footer/Footer"));
const ContactDialog = lazy(() =>
    import("components/common/ContactDialog/ContactDialog")
);
const ScrollTopButton = lazy(() =>
    import("components/common/ScrollTopButton/ScrollTopButton")
);

function Home() {
    //controller có thể lấy layout phục vụ cho chức năng thêm
    // eslint-disable-next-line
    const [controller, dispatch] = useMaterialUIController();
    // const { direction, layout, openConfigurator, darkMode } = controller;
    const [cTDState, setCTDState] = useState({
        isOpen: false,
        subject: "",
    });

    // const { t } = useTranslation();

    useEffect(() => {
        setLayout(dispatch, "home");
    }, [dispatch]);

    useEffect(() => {
        document.title = "Trang chủ";
    }, []);

    return (
        <Suspense fallback={<Loading />}>
            <TopNav />
            <div className="relative overflow-hidden bg-white dark:bg-gray-900">
                <div className="mx-auto max-w-7xl bg-white dark:bg-gray-900">
                    <div className="relative bg-white dark:bg-gray-900 pb-8 sm:pb-8 md:pb-10 lg:w-full lg:max-w-2xl lg:pb-12 xl:pb-6">
                        <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">
                                        Chào mừng bạn đến với
                                    </span>{" "}
                                    <span className="block text-indigo-600 xl:inline">
                                        Trung tâm anh ngữ ABC
                                    </span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <a
                                            href="/introduction"
                                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-1 md:px-7 md:text-lg"
                                        >
                                            Giới thiệu vể trung tâm &rarr;
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
            <CallToAction setCTDState={setCTDState} />
            <Footer />
            <ContactDialog cTDState={cTDState} setCTDState={setCTDState} />
            <ScrollTopButton />
        </Suspense>
    );
}

export default memo(Home);
