import React, { memo, Suspense, lazy } from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import { getAllowedRoutes, isLoggedIn } from "utils";
import { PrivateRoutesConfig } from "config/index";

// import Login from "pages/Login/Login";

import Loading from "components/common/Loading/Loading";
const NotFound = lazy(() => import("components/common/NotFound/NotFound"));
const CourseDetail = lazy(() => import("pages/CourseDetail/CourseDetail"));
const ProductDetail = lazy(() => import("pages/ProductDetail/ProductDetail"));
const ShopCheckout = lazy(() => import("pages/ShopCheckout/ShopCheckout"));
const TrackingOrder = lazy(() => import("pages/TrackingOrder/TrackingOrder"));
const Home = lazy(() => import("pages/Home/Home"));
const Shop = lazy(() => import("pages/Shop/Shop"));
const Introduction = lazy(() => import("pages/Introduction/Introduction"));
const TeacherIntroduction = lazy(() =>
    import("pages/TeacherIntroduction/TeacherIntroduction")
);
const CourseIntroduction = lazy(() =>
    import("pages/CourseIntroduction/CourseIntroduction")
);
const NeedToKnow = lazy(() => import("pages/NeedToKnow/NeedToKnow"));
const Login = lazy(() => import("pages/Login/Login"));

function CRoutes() {
    let allowedRoutes = [];

    if (isLoggedIn()) {
        allowedRoutes = getAllowedRoutes(PrivateRoutesConfig);
    }

    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="" element={<Outlet />}>
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
        </Suspense>
    );
}

export default memo(CRoutes);
