import React, { memo, useEffect, useState, Suspense } from "react";

//react-router-dom
import { Routes, Route } from "react-router-dom";

// @mui material components
import CssBaseline from "@mui/material/CssBaseline";

// Material Dashboard 2 React example components
import Sidenav from "components/MDComponents/examples/Sidenav";
import Configurator from "components/MDComponents/examples/Configurator";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setLayout } from "context";

import { Loading } from "components/common/Loading";

function Dashboard({ children }) {
    const [controller, dispatch] = useMaterialUIController();
    const { miniSidenav, sidenavColor } = controller;
    const [onMouseEnter, setOnMouseEnter] = useState(false);

    useEffect(() => {
        setLayout(dispatch, "dashboard");
        // setMiniSidenav(dispatch, true);
    }, [dispatch]);

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
        <Suspense fallback={<Loading />}>
            <CssBaseline />
            <Sidenav
                color={sidenavColor}
                brandName="HTQL"
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
        </Suspense>
    );
}

export default memo(Dashboard);
