import React from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDComponents/MDBox";
import MDTypography from "components/MDComponents/MDTypography";

// Material Dashboard 2 React example components
import DataTable from "components/MDComponents/examples/Tables/DataTable";

// Data
import authorsTableData from "pages/ManagerUser/data/authorsTableData";

function ManagePoster() {
    const { columns, rows } = authorsTableData();

    return (
        <MDBox pt={2} pb={1}>
            <Grid container spacing={6}>
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
                                Authors Table
                            </MDTypography>
                        </MDBox>
                        <MDBox pt={2}>
                            <DataTable
                                table={{ columns, rows }}
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
    );
}

export default ManagePoster;
