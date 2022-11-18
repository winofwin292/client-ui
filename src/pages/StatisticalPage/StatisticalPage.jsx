import React, { memo, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDComponents/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "components/MDComponents/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/MDComponents/examples/Navbars/DashboardNavbar";
import Footer from "components/MDComponents/examples/Footer";

import StatisticalPageDG from "pages/StatisticalPage/StatisticalPageDG";

function StatisticalPage() {
    useEffect(() => {
        document.title = "Thống kê";
    }, []);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={2} pb={3}>
                <Grid container spacing={2}>
                    <StatisticalPageDG />
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default memo(StatisticalPage);
