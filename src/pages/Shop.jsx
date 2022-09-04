import React, { memo } from "react";
import { BasicPage } from "../components/common";
import { TopNav } from "../components/common";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import { isLoggedIn } from "../utils";

const navOptions = [
    { title: "Home", path: "/" },
    { title: "Shop", path: "/shop" },
    { title: "Login", path: "/login" },
];

function Shop() {
    return (
        <div>
            {!isLoggedIn() && <TopNav routes={navOptions} prefix={""} />}
            <BasicPage title="Shop Page" icon={<LocalGroceryStoreIcon />} />
        </div>
    );
}

export default memo(Shop);
