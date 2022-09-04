import React, { memo } from "react";
import { BasicPage } from "../components/common";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";

function Dashboard() {
    return (
        <BasicPage title="Dashboard Page" icon={<DashboardCustomizeIcon />} />
    );
}

export default memo(Dashboard);
