import React, { memo, useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import PhoneIcon from "@mui/icons-material/Phone";
import FavoriteIcon from "@mui/icons-material/Favorite";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

// Material Dashboard 2 React components
import MDBox from "components/MDComponents/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "components/MDComponents/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/MDComponents/examples/Navbars/DashboardNavbar";
import Footer from "components/MDComponents/examples/Footer";

import ManagePoster from "./components/ManagePoster/ManagePoster";

function ManageHomePage() {
    const [value, setValue] = useState("1");

    useEffect(() => {
        document.title = "Quản lý trang chủ";
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={1}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <TabContext value={value}>
                            <TabList
                                value={value}
                                onChange={handleChange}
                                aria-label="icon position tabs example"
                            >
                                <Tab
                                    icon={<PhoneIcon />}
                                    iconPosition="start"
                                    label="end"
                                    value="1"
                                />
                                <Tab
                                    icon={<FavoriteIcon />}
                                    iconPosition="start"
                                    label="end"
                                    value="2"
                                />
                            </TabList>
                            <TabPanel value="1">
                                <ManagePoster />
                            </TabPanel>
                            <TabPanel value="2">Item Two</TabPanel>
                        </TabContext>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default memo(ManageHomePage);
