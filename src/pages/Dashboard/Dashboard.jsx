import React, { memo, useEffect, useState } from "react";

//react-router-dom
import { Routes, Route } from "react-router-dom";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDComponents/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "components/MDComponents/examples/Sidenav";
import Configurator from "components/MDComponents/examples/Configurator";

// Material Dashboard 2 React contexts
import {
    useMaterialUIController,
    setMiniSidenav,
    setOpenConfigurator,
    setLayout,
} from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

function Dashboard({ children }) {
    const [controller, dispatch] = useMaterialUIController();
    const {
        miniSidenav,
        openConfigurator,
        sidenavColor,
        transparentSidenav,
        whiteSidenav,
        darkMode,
    } = controller;
    const [onMouseEnter, setOnMouseEnter] = useState(false);

    console.log(children);

    useEffect(() => {
        setLayout(dispatch, "dashboard");
    }, [dispatch]);

    // Change the openConfigurator state
    const handleConfiguratorOpen = () =>
        setOpenConfigurator(dispatch, !openConfigurator);

    // Open sidenav when mouse enter on mini sidenav
    const handleOnMouseEnter = () => {
        if (miniSidenav && !onMouseEnter) {
            setMiniSidenav(dispatch, false);
            setOnMouseEnter(true);
        }
    };

    // Close sidenav when mouse leave mini sidenav
    const handleOnMouseLeave = () => {
        if (onMouseEnter) {
            setMiniSidenav(dispatch, true);
            setOnMouseEnter(false);
        }
    };

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
        <>
            <Sidenav
                color={sidenavColor}
                brand={
                    (transparentSidenav && !darkMode) || whiteSidenav
                        ? brandDark
                        : brandWhite
                }
                brandName="Material Dashboard 2"
                routes={children}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
            <Routes>
                {children.map((route) => {
                    const { path, component: Component } = route;
                    return (
                        <Route
                            key={path}
                            path={`${path}`}
                            element={Component}
                        />
                    );
                })}
            </Routes>
        </>
    );
}

export default memo(Dashboard);
