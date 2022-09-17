import React, { memo, useEffect, useState } from "react";

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

// Material Dashboard 2 React context
import { useMaterialUIController, setDarkMode } from "context";

//i18next translate
import { useTranslation } from "react-i18next";
import i18n from "translation/i18n";

function Footer({ light }) {
    const { size } = typography;
    const [controller, dispatch] = useMaterialUIController();
    const { darkMode } = controller;
    const [lang, setLang] = useState(false);

    const { t } = useTranslation();

    useEffect(() => {
        const currLang = localStorage.getItem("lang");
        setLang(currLang);
    }, []);

    const handleChangeLang = (e) => {
        const newLang = e.target.value;
        setLang(newLang);
        i18n.changeLanguage(newLang);
        localStorage.setItem("lang", newLang);
    };

    const handleChangeTheme = () => {
        setDarkMode(dispatch, !darkMode);
        localStorage.setItem("darkTheme", !darkMode);
    };

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
                        <MDBox component="li" px={1} lineHeight={1}>
                            <select
                                name="lang"
                                id="lang"
                                onChange={(e) => handleChangeLang(e)}
                                value={lang}
                            >
                                <option value="vi">Tiếng Việt</option>
                                <option value="en">English</option>
                            </select>
                        </MDBox>
                        <MDBox component="li" px={1} lineHeight={1}>
                            <select
                                name="theme"
                                id="theme"
                                value={darkMode}
                                onChange={handleChangeTheme}
                            >
                                <option value="false">
                                    {t("login.footer.lightTheme")}
                                </option>
                                <option value="true">
                                    {t("login.footer.darkTheme")}
                                </option>
                            </select>
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

export default memo(Footer);
