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

const ELTeacherHome = lazy(() => import("pages/ELTeacherHome/ELTeacherHome"));
const ELCourse = lazy(() => import("pages/ELCourse/ELCourse"));
const ELDashboard = lazy(() =>
    import("pages/ELTeacherHome/components/Dashboard/Dashboard")
);

const ELStudentHome = lazy(() => import("pages/ELStudentHome/ELStudentHome"));
const ELStudentDashboard = lazy(() =>
    import("pages/ELStudentHome/components/StudentDashboard/StudentDashboard")
);

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
                name: "T???ng quan",
                key: "dashboard/*",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "*",
                component: <Overview />,
            },
            {
                type: "collapse",
                name: "Nh??n vi??n",
                key: "dashboard/manage-staff",
                icon: <Icon fontSize="small">badge</Icon>,
                path: "manage-staff",
                component: <ManagerStaff />,
            },
            {
                type: "collapse",
                name: "Gi??o vi??n",
                key: "dashboard/manage-teacher",
                icon: <Icon fontSize="small">school</Icon>,
                path: "manage-teacher",
                component: <ManagerTeacher />,
            },
            {
                type: "collapse",
                name: "H???c vi??n",
                key: "dashboard/manage-student",
                icon: <Icon fontSize="small">person</Icon>,
                path: "manage-student",
                component: <ManagerStudent />,
            },
            {
                type: "collapse",
                name: "Kh??a h???c",
                key: "dashboard/manage-course",
                icon: <Icon fontSize="small">collections_bookmark</Icon>,
                path: "manage-course",
                component: <ManagerCourse />,
            },
            {
                type: "collapse",
                name: "Lo???i h??ng",
                key: "dashboard/manage-category",
                icon: <Icon fontSize="small">category</Icon>,
                path: "manage-category",
                component: <ManagerCategory />,
            },
            {
                type: "collapse",
                name: "S???n ph???m",
                key: "dashboard/manage-product",
                icon: <Icon fontSize="small">inventory_2</Icon>,
                path: "manage-product",
                component: <ManagerProduct />,
            },
            {
                type: "collapse",
                name: "????n h??ng",
                key: "dashboard/manage-order",
                icon: <Icon fontSize="small">local_mall</Icon>,
                path: "manage-order",
                component: <ManagerOrder />,
            },
            {
                type: "collapse",
                name: "Th???ng k??",
                key: "dashboard/statistical",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "statistical",
                component: <StatisticalPage />,
            },
            {
                type: "collapse",
                name: "Trang ch???",
                key: "dashboard/manage-home-page",
                icon: <Icon fontSize="small">home</Icon>,
                path: "manage-home-page",
                component: <ManageHomePage />,
            },
            {
                type: "collapse",
                name: "C??ng c???",
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
                name: "T???ng quan",
                key: "dashboard/*",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "*",
                component: <Overview />,
            },
            {
                type: "collapse",
                name: "Y??u c???u li??n h???",
                key: "dashboard/yeu-cau-lien-he",
                icon: <Icon fontSize="small">call</Icon>,
                path: "yeu-cau-lien-he",
                component: <ManagerRequestContact />,
            },
            {
                type: "collapse",
                name: "Lo???i h??ng",
                key: "dashboard/manage-category",
                icon: <Icon fontSize="small">category</Icon>,
                path: "manage-category",
                component: <ManagerCategory />,
            },
            {
                type: "collapse",
                name: "S???n ph???m",
                key: "dashboard/manage-product",
                icon: <Icon fontSize="small">inventory_2</Icon>,
                path: "manage-product",
                component: <ManagerProduct />,
            },
            {
                type: "collapse",
                name: "????n h??ng",
                key: "dashboard/manage-order",
                icon: <Icon fontSize="small">local_mall</Icon>,
                path: "manage-order",
                component: <ManagerOrder />,
            },
            {
                type: "collapse",
                name: "Th???ng k??",
                key: "dashboard/statistical",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "statistical",
                component: <StatisticalPage />,
            },
            {
                type: "collapse",
                name: "Trang ch???",
                key: "dashboard/manage-home-page",
                icon: <Icon fontSize="small">home</Icon>,
                path: "manage-home-page",
                component: <ManageHomePage />,
            },
            {
                type: "collapse",
                name: "C??ng c???",
                key: "dashboard/tools",
                icon: <Icon fontSize="small">constructions</Icon>,
                path: "tools",
                component: <ToolsStaff />,
            },
        ],
    },
    {
        component: ELTeacherHome,
        path: "teacher/*",
        title: "Gi??o vi??n",
        permission: [Roles.TEACHER],
        children: [
            {
                type: "collapse",
                name: "T???ng quan",
                key: "teacher/*",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "*",
                component: <ELDashboard />,
            },
            {
                type: "collapse",
                name: "Kh??a h???c",
                key: "teacher/course",
                icon: <Icon fontSize="small">constructions</Icon>,
                path: "course/:courseId",
                component: <ELCourse />,
            },
        ],
    },
    {
        component: ELStudentHome,
        path: "student/*",
        title: "H???c vi??n",
        permission: [Roles.STUDENT],
        children: [
            {
                type: "collapse",
                name: "T???ng quan",
                key: "student/*",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "*",
                component: <ELStudentDashboard />,
            },
        ],
    },
];
export default PrivateRoutesConfig;
