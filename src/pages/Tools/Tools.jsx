import React, { memo, useEffect } from "react";

// @mui material components
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Button } from "@mui/material";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

// Material Dashboard 2 React components
import MDBox from "components/MDComponents/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "components/MDComponents/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/MDComponents/examples/Navbars/DashboardNavbar";
import Footer from "components/MDComponents/examples/Footer";

import { getObjectFromCookieValue } from "utils";

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});
const Item = styled(Paper)(({ theme }) => ({
    // backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    // ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    // color: theme.palette.text.secondary,
}));

function ManagerStudent() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    useEffect(() => {
        document.title = "Công cụ";
    }, []);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={2} pb={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card>
                            <div
                                style={{
                                    height: 550,
                                    width: "100%",
                                }}
                            >
                                <ThemeProvider
                                    theme={darkMode ? themeD : theme}
                                >
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Item elevation={0}>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    onClick={(e) => {
                                                        console.log(
                                                            getObjectFromCookieValue(
                                                                "userData"
                                                            )
                                                        );
                                                    }}
                                                >
                                                    Đổi mật khẩu
                                                </Button>
                                            </Item>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Item elevation={0}>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                >
                                                    Đổi email thông báo đơn hàng
                                                </Button>
                                            </Item>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Item elevation={0}>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                >
                                                    Đang phát triển
                                                </Button>
                                            </Item>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Item elevation={0}>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                >
                                                    Đang phát triển
                                                </Button>
                                            </Item>
                                        </Grid>
                                    </Grid>
                                </ThemeProvider>
                            </div>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default memo(ManagerStudent);
