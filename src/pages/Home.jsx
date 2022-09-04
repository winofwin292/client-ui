import React, { memo } from "react";
import { TopNav } from "../components/common";
import { BasicPage } from "../components/common";
import HomeIcon from "@mui/icons-material/Home";
import { isLoggedIn } from "../utils";

const navOptions = [
    { title: "Home", path: "/" },
    { title: "Shop", path: "/shop" },
    { title: "Login", path: "/login" },
];

function Home() {
    return (
        <div>
            {!isLoggedIn() && <TopNav routes={navOptions} prefix={""} />}
            <BasicPage title="Home Page" icon={<HomeIcon />} />
        </div>
    );
}

export default memo(Home);
