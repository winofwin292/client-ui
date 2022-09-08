import React, { memo, useEffect } from "react";
import { TopNav } from "../components/common";
import { BasicPage } from "../components/common";
import HomeIcon from "@mui/icons-material/Home";
import { isLoggedIn } from "../utils";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setLayout } from "context";

//i18next translate
import { useTranslation } from "react-i18next";

const navOptions = [
    { title: "Home", path: "/" },
    { title: "Shop", path: "/shop" },
    { title: "Login", path: "/login" },
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
        <div>
            {!isLoggedIn() && <TopNav routes={navOptions} prefix={""} />}
            <BasicPage title={t("home.name")} icon={<HomeIcon />} />
        </div>
    );
}

export default memo(Home);
