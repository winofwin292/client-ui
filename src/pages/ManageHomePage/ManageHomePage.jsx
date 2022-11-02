import React, { memo, useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import CollectionsIcon from "@mui/icons-material/Collections";
import RateReviewIcon from "@mui/icons-material/RateReview";
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
import ManageReview from "./components/ManageReview/ManageReview";

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
                                    icon={<RateReviewIcon />}
                                    iconPosition="start"
                                    label="Đánh giá"
                                    value="1"
                                />
                                <Tab
                                    icon={<CollectionsIcon />}
                                    iconPosition="start"
                                    label="Hình ảnh"
                                    value="2"
                                />
                            </TabList>
                            <TabPanel value="1">
                                <ManageReview />
                            </TabPanel>
                            <TabPanel value="2">
                                <ManagePoster />
                            </TabPanel>
                        </TabContext>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default memo(ManageHomePage);
