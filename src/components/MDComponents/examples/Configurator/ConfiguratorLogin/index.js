import React, { useState, useEffect } from "react";

// @mui material components
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDComponents/MDBox";
import MDTypography from "components/MDComponents/MDTypography";

// Custom styles for the Configurator
import ConfiguratorRoot from "components/MDComponents/examples/Configurator/ConfiguratorRoot";

// Material Dashboard 2 React context
import {
    useMaterialUIController,
    setOpenConfigurator,
    setDarkMode,
} from "context";

//i18next translate
import { useTranslation } from "react-i18next";
import i18n from "translation/i18n";

function ConfiguratorLogin() {
    const [controller, dispatch] = useMaterialUIController();
    const { openConfigurator, darkMode } = controller;
    const { t } = useTranslation();

    const [lang, setLang] = useState(false);

    useEffect(() => {
        const currLang = localStorage.getItem("lang");
        if (currLang === "vi") {
            setLang(false);
        } else {
            setLang(true);
        }
    }, []);

    const handleCloseConfigurator = () => setOpenConfigurator(dispatch, false);

    const handleDarkMode = () => setDarkMode(dispatch, !darkMode);

    function handleChangeLanguage() {
        const currLang = localStorage.getItem("lang");
        if (currLang === "vi") {
            i18n.changeLanguage("en");
            localStorage.setItem("lang", "en");
            setLang(true);
        } else {
            i18n.changeLanguage("vi");
            localStorage.setItem("lang", "vi");
            setLang(false);
        }
    }

    return (
        <ConfiguratorRoot variant="permanent" ownerState={{ openConfigurator }}>
            <MDBox
                display="flex"
                justifyContent="space-between"
                alignItems="baseline"
                pt={4}
                pb={0.5}
                px={3}
            >
                <MDBox>
                    <MDTypography variant="h5">
                        {t("login.configurator")}
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                        {t("login.seeOur")}
                    </MDTypography>
                </MDBox>

                <Icon
                    sx={({
                        typography: { size },
                        palette: { dark, white },
                    }) => ({
                        fontSize: `${size.lg} !important`,
                        color: darkMode ? white.main : dark.main,
                        stroke: "currentColor",
                        strokeWidth: "2px",
                        cursor: "pointer",
                        transform: "translateY(5px)",
                    })}
                    onClick={handleCloseConfigurator}
                >
                    close
                </Icon>
            </MDBox>

            <Divider />

            <MDBox pt={0.5} pb={3} px={3}>
                <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={3}
                    lineHeight={1}
                >
                    <MDTypography variant="h6">
                        {t("login.changeLang")}
                    </MDTypography>

                    <Switch checked={lang} onChange={handleChangeLanguage} />
                </MDBox>
                <Divider />
                <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    lineHeight={1}
                >
                    <MDTypography variant="h6">
                        {t("login.lightDark")}
                    </MDTypography>

                    <Switch checked={darkMode} onChange={handleDarkMode} />
                </MDBox>
                <Divider />
            </MDBox>
        </ConfiguratorRoot>
    );
}

export default ConfiguratorLogin;
