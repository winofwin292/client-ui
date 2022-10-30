import React, { memo, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDComponents/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "components/MDComponents/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/MDComponents/examples/Navbars/DashboardNavbar";
import Footer from "components/MDComponents/examples/Footer";

import ManagerOrderDG from "pages/ManagerOrder/ManagerOrderDG";

function ManagerOrder() {
    useEffect(() => {
        document.title = "Quản lý đơn hàng";
    }, []);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={2} pb={3}>
                <Grid container spacing={2}>
                    <ManagerOrderDG />
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default memo(ManagerOrder);
