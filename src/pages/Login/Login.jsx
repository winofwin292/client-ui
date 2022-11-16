import React, { memo, useState, useEffect, useCallback } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDComponents/MDBox";
import MDTypography from "components/MDComponents/MDTypography";
import MDInput from "components/MDComponents/MDInput";
import MDButton from "components/MDComponents/MDButton";

// Authentication layout components
import BasicLayout from "pages/Login/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setLayout } from "context";

//i18next translate
import { useTranslation } from "react-i18next";

import { useSnackbar } from "notistack";

import userApi from "api/Users/useApi";

function Login() {
    // let navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    //controller có thể lấy layout phục vụ cho chức năng thêm
    // eslint-disable-next-line
    const [controller, dispatch] = useMaterialUIController();
    // const { direction, layout, openConfigurator, darkMode } = controller;

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const { t } = useTranslation();

    const showNoti = useCallback(
        (msg, type) => {
            enqueueSnackbar(msg, {
                variant: type,
                action: (key) => (
                    <IconButton
                        size="small"
                        onClick={() => closeSnackbar(key)}
                        style={{
                            color: "white",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ),
            });
        },
        [closeSnackbar, enqueueSnackbar]
    );

    useEffect(() => {
        setLayout(dispatch, "login");
    }, [dispatch]);

    useEffect(() => {
        document.title = "Đăng nhập";
    }, []);

    const handleSetRememberMe = async () => {
        // const response = await userApi.getNewAccessToken();
        // console.log(response);
        setRememberMe(!rememberMe);
    };

    const handleClick = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            showNoti("Vui lòng nhập tài khoản và mật khẩu", "error");
            return;
        }

        const response = await userApi.login({
            username,
            password,
        });

        if (response.status === 200) {
            if (
                response.data.role === "ADMIN" ||
                response.data.role === "STAFF"
            )
                window.location.href = "/dashboard/*";
            else window.location.href = "/";
        } else {
            showNoti(response.data, "error");
        }
    };

    return (
        <BasicLayout image={bgImage}>
            <Card>
                <MDBox
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                    mx={2}
                    mt={-3}
                    p={2}
                    mb={1}
                    textAlign="center"
                >
                    <MDTypography
                        variant="h4"
                        fontWeight="medium"
                        color="white"
                        mt={1}
                    >
                        {t("login.signIn")}
                    </MDTypography>
                    <Grid
                        container
                        spacing={3}
                        justifyContent="center"
                        sx={{ mt: 1, mb: 2 }}
                    >
                        <Grid item xs={2}>
                            <MDTypography
                                component={MuiLink}
                                href="#"
                                variant="body1"
                                color="white"
                            >
                                <FacebookIcon color="inherit" />
                            </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                            <MDTypography
                                component={MuiLink}
                                href="#"
                                variant="body1"
                                color="white"
                            >
                                <GitHubIcon color="inherit" />
                            </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                            <MDTypography
                                component={MuiLink}
                                href="#"
                                variant="body1"
                                color="white"
                            >
                                <GoogleIcon color="inherit" />
                            </MDTypography>
                        </Grid>
                    </Grid>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form">
                        <MDBox mb={2}>
                            <MDInput
                                label={t("login.signIn")}
                                fullWidth
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="password"
                                label={t("login.password")}
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </MDBox>
                        <MDBox display="flex" alignItems="center" ml={-1}>
                            <Switch
                                checked={rememberMe}
                                onChange={handleSetRememberMe}
                            />
                            <MDTypography
                                variant="button"
                                fontWeight="regular"
                                color="text"
                                onClick={handleSetRememberMe}
                                sx={{
                                    cursor: "pointer",
                                    userSelect: "none",
                                    ml: -1,
                                }}
                            >
                                &nbsp;&nbsp;{t("login.remember")}
                            </MDTypography>
                        </MDBox>
                        <MDBox mt={4} mb={1}>
                            <MDButton
                                onClick={(e) => handleClick(e)}
                                variant="gradient"
                                color="info"
                                fullWidth
                                type="button"
                            >
                                {t("login.signIn")}
                            </MDButton>
                        </MDBox>
                        <MDBox mt={3} mb={1} textAlign="center">
                            <MDTypography variant="button" color="text">
                                {t("login.haveAccount")}{" "}
                                <MDTypography
                                    component={Link}
                                    to="/authentication/sign-up"
                                    variant="button"
                                    color="info"
                                    fontWeight="medium"
                                    textGradient
                                >
                                    {t("login.signUp")}
                                </MDTypography>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </BasicLayout>
    );
}

export default memo(Login);
