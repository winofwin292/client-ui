import React, { memo, useEffect, useState } from "react";
import { TopNav } from "components/common/TopNav";
import { Feature } from "components/common/Feature";
import { CallToAction } from "components/common/CallToAction";
import { Footer } from "components/common/Footer";
import { ContactDialog } from "components/common/ContactDialog";
import { FAQ } from "components/common/FAQ";
import { HeroSection } from "components/common/HeroSection";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setLayout } from "context";

//i18next translate
import { useTranslation } from "react-i18next";

function NeedToKnow() {
    //controller có thể lấy layout phục vụ cho chức năng thêm
    // eslint-disable-next-line
    const [controller, dispatch] = useMaterialUIController();
    // const { direction, layout, openConfigurator, darkMode } = controller;
    const [cTDState, setCTDState] = useState({
        isOpen: false,
        subject: "",
    });

    const { t } = useTranslation();

    useEffect(() => {
        setLayout(dispatch, "courseIntroduction");
    }, [dispatch]);

    return (
        <div className="bg-white dark:bg-gray-900">
            <TopNav />
            <HeroSection />
            <Feature />
            <FAQ />
            <CallToAction setCTDState={setCTDState} />
            <Footer />
            <ContactDialog cTDState={cTDState} setCTDState={setCTDState} />
        </div>
    );
}

export default memo(NeedToKnow);
