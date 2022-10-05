import React, { memo, useEffect, useState } from "react";
import { TopNav } from "components/common/TopNav";
import { Feature } from "components/common/Feature";
import { CallToAction } from "components/common/CallToAction";
import { Footer } from "components/common/Footer";
import { ContactDialog } from "components/common/ContactDialog";
import { FAQ } from "components/common/FAQ";
import { HeroSection } from "components/common/HeroSection";
import { CustomAlert } from "components/common/CustomAlert";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setLayout } from "context";

import { alertType } from "utils";

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
    const [notify, setNotify] = React.useState({
        open: false,
        type: alertType.SUCCESS,
        msg: "",
    });

    const { t } = useTranslation();

    useEffect(() => {
        document.title = "Câu hỏi thường gặp";
    }, []);

    useEffect(() => {
        setLayout(dispatch, "needToKnow");
    }, [dispatch]);

    return (
        <div className="bg-white dark:bg-gray-900">
            <TopNav />
            <HeroSection />
            <Feature />
            <FAQ />
            <CallToAction setCTDState={setCTDState} />
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

export default memo(NeedToKnow);
