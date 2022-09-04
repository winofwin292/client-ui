import React, { memo } from "react";
import { Routes, Route } from "react-router-dom";
import { NotFound } from "../components/common";

function MapAllowedRoutes({ routes, basePath, isAddNotFound }) {
    return (
        <Routes>
            {routes.map((route) => {
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
                        path={`${path}`}
                        element={<Component children={children} />}
                    />
                );
            })}
            {isAddNotFound && <Route element={<NotFound />} />}
        </Routes>
    );
}

export default memo(MapAllowedRoutes);
