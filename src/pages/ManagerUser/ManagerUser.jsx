import React, { memo, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDComponents/MDBox";
import MDTypography from "components/MDComponents/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "components/MDComponents/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/MDComponents/examples/Navbars/DashboardNavbar";
import Footer from "components/MDComponents/examples/Footer";
import DataTable from "components/MDComponents/examples/Tables/DataTable";

import UserDataGrid from "pages/ManagerUser/components/UserDataGrid/UserDataGrid";

// Data
import projectsTableData from "pages/ManagerUser/data/projectsTableData";

function ManagerUser() {
    const { columns: pColumns, rows: pRows } = projectsTableData();

    useEffect(() => {
        document.title = "Quản lý người dùng";
    }, []);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={2} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <UserDataGrid />
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                            >
                                <MDTypography variant="h6" color="white">
                                    Projects Table
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{ columns: pColumns, rows: pRows }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default memo(ManagerUser);
