import React, { memo, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDComponents/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "components/MDComponents/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/MDComponents/examples/Navbars/DashboardNavbar";
import Footer from "components/MDComponents/examples/Footer";

import UserDataGrid from "pages/ManagerUser/components/UserDataGrid/UserDataGrid";

// Data
import projectsTableData from "pages/ManagerUser/data/projectsTableData";

function ManagerRequestContact() {
    const { columns: pColumns, rows: pRows } = projectsTableData();

    useEffect(() => {
        document.title = "Yêu cầu liên hệ";
    }, []);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={2} pb={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card>Tool here</Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <UserDataGrid />
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default memo(ManagerRequestContact);
