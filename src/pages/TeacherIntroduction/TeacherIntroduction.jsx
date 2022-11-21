import React, { memo, useEffect, useState } from "react";
import { TopNav } from "components/common/TopNav";
import { TeacherSection } from "components/common/TeacherSection";
import { CallToAction } from "components/common/CallToAction";
import { Footer } from "components/common/Footer";
import { ContactDialog } from "components/common/ContactDialog";
import { HeroSection } from "components/common/HeroSection";
import { Content } from "components/common/Content";
import { ScrollTopButton } from "components/common/ScrollTopButton";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setLayout } from "context";

//i18next translate
// import { useTranslation } from "react-i18next";

function TeacherIntroduction() {
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
        document.title = "Giáo viên, Nhân viên";
    }, []);

    useEffect(() => {
        setLayout(dispatch, "teacherIntroduction");
    }, [dispatch]);

    return (
        <div className="bg-white dark:bg-gray-900">
            <TopNav />
            <HeroSection />
            <TeacherSection />
            <Content />
            <Content alignRight />
            <CallToAction setCTDState={setCTDState} />
            <Footer />
            <ContactDialog cTDState={cTDState} setCTDState={setCTDState} />
            <ScrollTopButton />
        </div>
    );
}

export default memo(TeacherIntroduction);
