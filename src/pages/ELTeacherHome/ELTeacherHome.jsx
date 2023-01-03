import React, { memo, useState, Suspense } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

//react-router-dom
import { Routes, Route } from "react-router-dom";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

import ELNavBar from "components/common/ELNavBar/ELNavBar";
import CreateClass from "./components/CreateClass/CreateClass";
import JoinClass from "./components/JoinClass/JoinClass";

import Configurator from "components/MDComponents/examples/Configurator";

import { Loading } from "components/common/Loading";

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function ELTeacherHome({ children }) {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const [createState, setCreateState] = useState(false);
    const [joinState, setJoinState] = useState(false);

    return (
        <Suspense fallback={<Loading />}>
            <ThemeProvider theme={darkMode ? themeD : theme}>
                <ELNavBar
                    setCreateState={setCreateState}
                    setJoinState={setJoinState}
                />
                <CreateClass
                    createState={createState}
                    setCreateState={setCreateState}
                />
                <JoinClass joinState={joinState} setJoinState={setJoinState} />
            </ThemeProvider>
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

export default memo(ELTeacherHome);
