import React, { useEffect } from "react";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";

import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDComponents/MDBox";

// Material Dashboard 2 React example components
import ConfiguratorLogin from "components/MDComponents/examples/Configurator/ConfiguratorLogin";

// Material Dashboard 2 React themes
import theme from "assets/theme";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setOpenConfigurator } from "context";

//i18next translate
import i18n from "translation/i18n";

import Routes from "./routes";

const App = () => {
    const [controller, dispatch] = useMaterialUIController();
    const { direction, layout, openConfigurator, darkMode } = controller;

    // Change the openConfigurator state
    const handleConfiguratorOpen = () =>
        setOpenConfigurator(dispatch, !openConfigurator);

    // Setting the dir attribute for the body element
    useEffect(() => {
        document.body.setAttribute("dir", direction);
        const currLang = localStorage.getItem("lang") || "vi";
        localStorage.setItem("lang", currLang);
        i18n.changeLanguage(currLang);
    }, [direction]);

    const configsButton = (
        <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="3.25rem"
            height="3.25rem"
            bgColor="white"
            shadow="sm"
            borderRadius="50%"
            position="fixed"
            right="2rem"
            bottom="2rem"
            zIndex={99}
            color="dark"
            sx={{ cursor: "pointer" }}
            onClick={handleConfiguratorOpen}
        >
            <Icon fontSize="small" color="inherit">
                settings
            </Icon>
        </MDBox>
    );

    return (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
            {layout === "login" && (
                <>
                    <ConfiguratorLogin />
                    {configsButton}
                </>
            )}
            <Routes />
        </ThemeProvider>
    );
};

export default App;
