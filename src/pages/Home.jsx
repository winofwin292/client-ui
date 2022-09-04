import React, { memo } from "react";
import { TopNav } from "../components/common";
import { BasicPage } from "../components/common";
import HomeIcon from "@mui/icons-material/Home";

const navOptions = [
    { title: "Home", path: "/home" },
    { title: "Shop", path: "/shop" },
    { title: "Login", path: "/login" },
];

function Home() {
    return (
        <div>
            <TopNav routes={navOptions} />
            <BasicPage title="Home Page" icon={<HomeIcon />} />
        </div>
    );
}

export default memo(Home);
