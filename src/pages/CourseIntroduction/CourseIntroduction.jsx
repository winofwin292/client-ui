import React, { memo, useEffect } from "react";
import { TopNav } from "components/common/TopNav";
import { Footer } from "components/common/Footer";
import { CourseList } from "components/common/CourseList";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setLayout } from "context";

//i18next translate
import { useTranslation } from "react-i18next";

function CourseIntroduction() {
    //controller có thể lấy layout phục vụ cho chức năng thêm
    // eslint-disable-next-line
    const [controller, dispatch] = useMaterialUIController();
    // const { direction, layout, openConfigurator, darkMode } = controller;

    const { t } = useTranslation();

    useEffect(() => {
        setLayout(dispatch, "courseIntroduction");
    }, [dispatch]);

    useEffect(() => {
        document.title = "Khóa học";
    }, []);

    return (
        <div className="bg-white dark:bg-gray-900">
            <TopNav />
            <CourseList />
            <Footer />
        </div>
    );
}

export default memo(CourseIntroduction);
