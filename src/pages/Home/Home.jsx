import React, { memo, useEffect, useState } from "react";
import { TopNav } from "components/common/TopNav";
import { CarouselImage } from "components/common/CarouselImage";
import { SocialProof } from "components/common/SocialProof";
import { Feature } from "components/common/Feature";
import { TeacherSection } from "components/common/TeacherSection";
import { CourseSection } from "components/common/CourseSection";
import { ReviewSection } from "components/common/ReviewSection";
import { CallToAction } from "components/common/CallToAction";
import { Footer } from "components/common/Footer";
import { ContactDialog } from "components/common/ContactDialog";
import { CustomAlert } from "components/common/CustomAlert";

import { isLoggedIn, alertType } from "utils";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setLayout } from "context";

//i18next translate
import { useTranslation } from "react-i18next";

function Home() {
    //controller có thể lấy layout phục vụ cho chức năng thêm
    // eslint-disable-next-line
    const [controller, dispatch] = useMaterialUIController();
    // const { direction, layout, openConfigurator, darkMode } = controller;
    const [cTDState, setCTDState] = useState({
        isOpen: false,
        subject: "",
    });
    const [notify, setNotify] = React.useState({
        open: false,
        type: alertType.SUCCESS,
        msg: "",
    });

    const { t } = useTranslation();

    useEffect(() => {
        setLayout(dispatch, "home");
    }, [dispatch]);

    return (
        <>
            <TopNav />
            <div className="relative overflow-hidden bg-white dark:bg-gray-900">
                <div className="mx-auto max-w-7xl bg-white dark:bg-gray-900">
                    <div className="relative bg-white dark:bg-gray-900 pb-8 sm:pb-8 md:pb-10 lg:w-full lg:max-w-2xl lg:pb-12 xl:pb-16">
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
            <ContactDialog
                cTDState={cTDState}
                setCTDState={setCTDState}
                setNotify={setNotify}
            />
            <CustomAlert data={notify} onClose={setNotify} />
        </>
    );
}

export default memo(Home);
