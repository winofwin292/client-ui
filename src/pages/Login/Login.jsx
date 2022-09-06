import React, { memo, useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "../../components/MDComponents/MDBox";
import MDTypography from "../../components/MDComponents/MDTypography";
import MDInput from "../../components/MDComponents/MDInput";
import MDButton from "../../components/MDComponents/MDButton";

// Authentication layout components
import BasicLayout from "./components/BasicLayout";

// Images
import bgImage from "../../assets/images/bg-sign-in-basic.jpeg";

function Login() {
    // let navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);

    const handleSetRememberMe = () => setRememberMe(!rememberMe);

    function handleClick() {
        // localStorage.setItem("roles", JSON.stringify(selected));
        localStorage.setItem("roles", JSON.stringify(["ADMIN"]));
        // navigate("/app");
        window.location.href = "/app";
    }

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
                        Sign in
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
                            <MDInput type="email" label="Email" fullWidth />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="password"
                                label="Password"
                                fullWidth
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
                                &nbsp;&nbsp;Remember me
                            </MDTypography>
                        </MDBox>
                        <MDBox mt={4} mb={1}>
                            <MDButton
                                onClick={handleClick}
                                variant="gradient"
                                color="info"
                                fullWidth
                            >
                                sign in
                            </MDButton>
                        </MDBox>
                        <MDBox mt={3} mb={1} textAlign="center">
                            <MDTypography variant="button" color="text">
                                Don&apos;t have an account?{" "}
                                <MDTypography
                                    component={Link}
                                    to="/authentication/sign-up"
                                    variant="button"
                                    color="info"
                                    fontWeight="medium"
                                    textGradient
                                >
                                    Sign up
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
