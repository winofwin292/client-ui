import React, { lazy } from "react";
import Roles from "./Roles";

// @mui icons
import Icon from "@mui/material/Icon";

const Dashboard = lazy(() => import("pages/Dashboard/Dashboard"));
const Overview = lazy(() => import("pages/Dashboard/Overview/Overview"));
const ManageHomePage = lazy(() =>
    import("pages/ManageHomePage/ManageHomePage")
);
const ManagerRequestContact = lazy(() =>
    import("pages/ManagerRequestContact/ManagerRequestContact")
);
const ManagerStaff = lazy(() => import("pages/ManagerStaff/ManagerStaff"));
const ManagerTeacher = lazy(() =>
    import("pages/ManagerTeacher/ManagerTeacher")
);
const ManagerStudent = lazy(() =>
    import("pages/ManagerStudent/ManagerStudent")
);
const ManagerCourse = lazy(() => import("pages/ManagerCourse/ManagerCourse"));
const ManagerCategory = lazy(() =>
    import("pages/ManagerCategory/ManagerCategory")
);
const ManagerProduct = lazy(() =>
    import("pages/ManagerProduct/ManagerProduct")
);
const ManagerOrder = lazy(() => import("pages/ManagerOrder/ManagerOrder"));
const StatisticalPage = lazy(() =>
    import("pages/StatisticalPage/StatisticalPage")
);
const Tools = lazy(() => import("pages/Tools/Tools"));
const ToolsStaff = lazy(() => import("pages/ToolsStaff/ToolsStaff"));

const TeacherCourse = lazy(() => import("pages/TeacherCourse"));
const StudentCourse = lazy(() => import("pages/StudentCourse"));

const PrivateRoutesConfig = [
    {
        component: Dashboard,
        path: "dashboard/*",
        title: "Dashboard",
        exact: true,
        permission: [Roles.ADMIN],
        children: [
            {
                type: "collapse",
                name: "Tổng quan",
                key: "dashboard/*",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "*",
                component: <Overview />,
            },
            {
                type: "collapse",
                name: "Nhân viên",
                key: "dashboard/manage-staff",
                icon: <Icon fontSize="small">badge</Icon>,
                path: "manage-staff",
                component: <ManagerStaff />,
            },
            {
                type: "collapse",
                name: "Giáo viên",
                key: "dashboard/manage-teacher",
                icon: <Icon fontSize="small">school</Icon>,
                path: "manage-teacher",
                component: <ManagerTeacher />,
            },
            {
                type: "collapse",
                name: "Học viên",
                key: "dashboard/manage-student",
                icon: <Icon fontSize="small">person</Icon>,
                path: "manage-student",
                component: <ManagerStudent />,
            },
            {
                type: "collapse",
                name: "Khóa học",
                key: "dashboard/manage-course",
                icon: <Icon fontSize="small">person</Icon>,
                path: "manage-course",
                component: <ManagerCourse />,
            },
            {
                type: "collapse",
                name: "Loại hàng",
                key: "dashboard/manage-category",
                icon: <Icon fontSize="small">person</Icon>,
                path: "manage-category",
                component: <ManagerCategory />,
            },
            {
                type: "collapse",
                name: "Sản phẩm",
                key: "dashboard/manage-product",
                icon: <Icon fontSize="small">person</Icon>,
                path: "manage-product",
                component: <ManagerProduct />,
            },
            {
                type: "collapse",
                name: "Đơn hàng",
                key: "dashboard/manage-order",
                icon: <Icon fontSize="small">local_mall</Icon>,
                path: "manage-order",
                component: <ManagerOrder />,
            },
            {
                type: "collapse",
                name: "Thống kê",
                key: "dashboard/statistical",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "statistical",
                component: <StatisticalPage />,
            },
            {
                type: "collapse",
                name: "Trang chủ",
                key: "dashboard/manage-home-page",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "manage-home-page",
                component: <ManageHomePage />,
            },
            {
                type: "collapse",
                name: "Công cụ",
                key: "dashboard/tools",
                icon: <Icon fontSize="small">constructions</Icon>,
                path: "tools",
                component: <Tools />,
            },
        ],
    },
    {
        component: Dashboard,
        path: "dashboard/*",
        title: "Dashboard",
        exact: true,
        permission: [Roles.STAFF],
        children: [
            {
                type: "collapse",
                name: "Tổng quan",
                key: "dashboard/*",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "*",
                component: <Overview />,
            },
            {
                type: "collapse",
                name: "Yêu cầu liên hệ",
                key: "dashboard/yeu-cau-lien-he",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "yeu-cau-lien-he",
                component: <ManagerRequestContact />,
            },
            {
                type: "collapse",
                name: "Loại hàng",
                key: "dashboard/manage-category",
                icon: <Icon fontSize="small">person</Icon>,
                path: "manage-category",
                component: <ManagerCategory />,
            },
            {
                type: "collapse",
                name: "Sản phẩm",
                key: "dashboard/manage-product",
                icon: <Icon fontSize="small">person</Icon>,
                path: "manage-product",
                component: <ManagerProduct />,
            },
            {
                type: "collapse",
                name: "Đơn hàng",
                key: "dashboard/manage-order",
                icon: <Icon fontSize="small">local_mall</Icon>,
                path: "manage-order",
                component: <ManagerOrder />,
            },
            {
                type: "collapse",
                name: "Thống kê",
                key: "dashboard/statistical",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "statistical",
                component: <StatisticalPage />,
            },
            {
                type: "collapse",
                name: "Trang chủ",
                key: "dashboard/manage-home-page",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "manage-home-page",
                component: <ManageHomePage />,
            },
            {
                type: "collapse",
                name: "Công cụ",
                key: "dashboard/tools",
                icon: <Icon fontSize="small">constructions</Icon>,
                path: "tools",
                component: <ToolsStaff />,
            },
        ],
    },
    {
        component: TeacherCourse,
        path: "teacher",
        title: "Giáo viên",
        permission: [Roles.TEACHER],
    },
    {
        component: StudentCourse,
        path: "student",
        title: "Học viên",
        permission: [Roles.STUDENT],
    },
];
export default PrivateRoutesConfig;
