import React, { memo, useEffect, useState } from "react";

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

import ChangePassword from "components/common/ChangePassword/ChangePassword";
import ChangeInfo from "./components/ChangeInfo/ChangeInfo";

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});
const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: "center",
}));

function ToolsStaff() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    const [changePassState, setChangePassState] = useState(false);
    const [changeInfoState, setChangeInfoState] = useState(false);

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
                                                    onClick={(e) =>
                                                        setChangePassState(true)
                                                    }
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
                                                    onClick={(e) =>
                                                        setChangeInfoState(true)
                                                    }
                                                >
                                                    Đổi thông tin cá nhân
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
                                    <ChangePassword
                                        open={changePassState}
                                        setOpen={setChangePassState}
                                    />
                                    <ChangeInfo
                                        open={changeInfoState}
                                        setOpen={setChangeInfoState}
                                    />
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

export default memo(ToolsStaff);
