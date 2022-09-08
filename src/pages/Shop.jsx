import React, { memo, useEffect } from "react";
import { BasicPage } from "../components/common";
import { TopNav } from "../components/common";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import { isLoggedIn } from "../utils";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setLayout } from "context";

const navOptions = [
    { title: "Home", path: "/" },
    { title: "Shop", path: "/shop" },
    { title: "Login", path: "/login" },
];

function Shop() {
    //controller có thể lấy layout phục vụ cho chức năng thêm
    // eslint-disable-next-line
    const [controller, dispatch] = useMaterialUIController();
    // const { direction, layout, openConfigurator, darkMode } = controller;

    useEffect(() => {
        setLayout(dispatch, "shop");
    }, [dispatch]);

    return (
        <div>
            {!isLoggedIn() && <TopNav routes={navOptions} prefix={""} />}
            <BasicPage title="Shop Page" icon={<LocalGroceryStoreIcon />} />
        </div>
    );
}

export default memo(Shop);
