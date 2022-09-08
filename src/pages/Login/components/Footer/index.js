/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";

// Material Dashboard 2 React components
import MDBox from "components/MDComponents/MDBox";
import MDTypography from "components/MDComponents/MDTypography";

// Material Dashboard 2 React base styles
import typography from "assets/theme/base/typography";

//i18next translate
import { useTranslation } from "react-i18next";

function Footer({ light }) {
    const { size } = typography;
    const { t } = useTranslation();

    return (
        <MDBox position="absolute" width="100%" bottom={0} py={4}>
            <Container>
                <MDBox
                    width="100%"
                    display="flex"
                    flexDirection={{ xs: "column", lg: "row" }}
                    justifyContent="space-between"
                    alignItems="center"
                    px={1.5}
                >
                    <MDBox
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexWrap="wrap"
                        color={light ? "white" : "text"}
                        fontSize={size.sm}
                    >
                        &copy; {new Date().getFullYear()},{" "}
                        {t("login.footer.makeBy")}
                        <Link
                            href="https://github.com/winofwin292"
                            target="_blank"
                        >
                            <MDTypography
                                variant="button"
                                fontWeight="medium"
                                color={light ? "white" : "dark"}
                            >
                                &nbsp;Quốc Thắng&nbsp;
                            </MDTypography>
                        </Link>
                    </MDBox>
                    <MDBox
                        component="ul"
                        sx={({ breakpoints }) => ({
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "center",
                            listStyle: "none",
                            mt: 3,
                            mb: 0,
                            p: 0,

                            [breakpoints.up("lg")]: {
                                mt: 0,
                            },
                        })}
                    >
                        <MDBox component="li" px={2} lineHeight={1}>
                            <Link
                                href="https://github.com/winofwin292"
                                target="_blank"
                            >
                                <MDTypography
                                    variant="button"
                                    fontWeight="regular"
                                    color={light ? "white" : "dark"}
                                >
                                    {t("login.footer.about")}
                                </MDTypography>
                            </Link>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Container>
        </MDBox>
    );
}

// Setting default props for the Footer
Footer.defaultProps = {
    light: false,
};

// Typechecking props for the Footer
Footer.propTypes = {
    light: PropTypes.bool,
};

export default Footer;
