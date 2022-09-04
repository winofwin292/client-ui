import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";

function PublicRoutes() {
    return (
        <Fragment>
            <Outlet />
        </Fragment>
    );
}

export default PublicRoutes;
