import React, { useEffect } from "react";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDComponents/MDBox";

// Material Dashboard 2 React example components
import Configurator from "components/MDComponents/examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setOpenConfigurator } from "context";

import Routes from "./routes";

const App = () => {
    const [controller, dispatch] = useMaterialUIController();
    const { direction, openConfigurator, darkMode } = controller;
    // const { pathname } = useLocation();

    // Change the openConfigurator state
    const handleConfiguratorOpen = () =>
        setOpenConfigurator(dispatch, !openConfigurator);

    // Setting the dir attribute for the body element
    useEffect(() => {
        document.body.setAttribute("dir", direction);
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
            <CssBaseline />
            <Configurator />
            {configsButton}
            <Routes />
        </ThemeProvider>
    );
};

export default App;
