import React, { memo, useEffect, useState } from "react";

//react-router-dom
import { Routes, Route } from "react-router-dom";

// @mui material components
import CssBaseline from "@mui/material/CssBaseline";

// Material Dashboard 2 React example components
import Sidenav from "components/MDComponents/examples/Sidenav";
import Configurator from "components/MDComponents/examples/Configurator";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setLayout } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

function Dashboard({ children }) {
    const [controller, dispatch] = useMaterialUIController();
    const {
        miniSidenav,
        sidenavColor,
        transparentSidenav,
        whiteSidenav,
        darkMode,
    } = controller;
    const [onMouseEnter, setOnMouseEnter] = useState(false);

    useEffect(() => {
        setLayout(dispatch, "dashboard");
    }, [dispatch]);

    useEffect(() => {
        document.title = "Tổng quan";
    }, []);

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

    return (
        <>
            <CssBaseline />
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
