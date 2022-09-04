import React, { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAllowedRoutes, isLoggedIn } from "../utils";
import { PrivateRoutesConfig } from "../config/index";
import { TopNav } from "../components/common";

function PrivateRoutes() {
    let allowedRoutes = [];

    if (isLoggedIn()) {
        allowedRoutes = getAllowedRoutes(PrivateRoutesConfig);
    } else {
        return <Navigate to="/" />;
    }

    return (
        <Fragment>
            <TopNav routes={allowedRoutes} prefix={"/app"} />
            <Outlet />
        </Fragment>
    );
}

export default PrivateRoutes;
