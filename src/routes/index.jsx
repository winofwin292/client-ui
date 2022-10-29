import React, { memo } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import Auth from "./Auth";
import {
    Shop,
    Home,
    Introduction,
    TeacherIntroduction,
    CourseIntroduction,
    NeedToKnow,
} from "pages";
import Login from "pages/Login/Login";
import { getAllowedRoutes, isLoggedIn } from "utils";
import { PrivateRoutesConfig } from "config/index";
import { NotFound } from "components/common/NotFound";
import { CourseDetail } from "pages/CourseDetail";
import { ProductDetail } from "pages/ProductDetail";
import { ShopCheckout } from "pages/ShopCheckout";
import { TrackingOrder } from "pages/TrackingOrder";

function CRoutes() {
    let allowedRoutes = [];

    if (isLoggedIn()) {
        allowedRoutes = getAllowedRoutes(PrivateRoutesConfig);
    }

    return (
        <Routes>
            <Route path="" element={<Auth />}>
                <Route path="/" element={<Home />} />
                <Route path="/introduction" element={<Introduction />} />
                <Route
                    path="/teacher-introduction"
                    element={<TeacherIntroduction />}
                />
                <Route
                    path="/course-introduction"
                    element={<CourseIntroduction />}
                />
                <Route
                    path="/course-introduction/:id"
                    element={<CourseDetail />}
                />
                <Route path="/need-to-know" element={<NeedToKnow />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:id" element={<ProductDetail />} />
                <Route path="/shop/checkout" element={<ShopCheckout />} />
                <Route path="/shop/tracking" element={<TrackingOrder />} />
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
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default memo(CRoutes);
