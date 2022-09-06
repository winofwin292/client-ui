import React, { memo } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import history from "utils/history";
import PrivateRoutes from "./PrivateRoutes";
import Auth from "./Auth";
import { Shop, Home } from "../pages";
import Login from "../pages/Login/Login";
import { getAllowedRoutes, isLoggedIn } from "../utils";
import { PrivateRoutesConfig } from "../config/index";
import { NotFound } from "../components/common";

function CRoutes() {
    let allowedRoutes = [];

    if (isLoggedIn()) {
        allowedRoutes = getAllowedRoutes(PrivateRoutesConfig);
    }

    return (
        <Router history={history}>
            <Routes>
                <Route path="" element={<Auth />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/login" element={<Login />} />
                </Route>
                <Route path="app" element={<PrivateRoutes />}>
                    {allowedRoutes.map((route) => {
                        const {
                            path,
                            component: Component,
                            children,
                            title,
                            permission,
                            ...rest
                        } = route;
                        return (
                            <Route
                                {...rest}
                                key={path}
                                path={path}
                                element={<Component children={children} />}
                            />
                        );
                    })}
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default memo(CRoutes);
