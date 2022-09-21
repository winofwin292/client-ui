import React, { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAllowedRoutes, isLoggedIn } from "../utils";
import { PrivateRoutesConfig } from "../config/index";
import { TopNav } from "components/common/TopNav";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

function PrivateRoutes() {
    let allowedRoutes = [];
    // eslint-disable-next-line
    const [controller, dispatch] = useMaterialUIController();
    const { layout } = controller;

    if (isLoggedIn()) {
        allowedRoutes = getAllowedRoutes(PrivateRoutesConfig);
    } else {
        return <Navigate to="/" />;
    }

    return (
        <Fragment>
            {layout !== "dashboard" && (
                <TopNav routes={allowedRoutes} prefix={"/app"} />
            )}
            <Outlet />
        </Fragment>
    );
}

export default PrivateRoutes;
