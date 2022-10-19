import Roles from "./Roles";
import { TeacherCourse, StudentCourse } from "pages";
import { Dashboard } from "pages/Dashboard";
import { Overview } from "pages/Dashboard/Overview";
import { ManageHomePage } from "pages/ManageHomePage";
import Loading from "components/common/Loading/Loading";
import { ManagerRequestContact } from "pages/ManagerRequestContact";
import { ManagerStaff } from "pages/ManagerStaff";
import { ManagerTeacher } from "pages/ManagerTeacher";
import { ManagerStudent } from "pages/ManagerStudent";

// @mui icons
import Icon from "@mui/material/Icon";

const PrivateRoutesConfig = [
    {
        component: Loading,
        path: "",
        title: "Loading",
    },
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
                key: "app/dashboard/*",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "*",
                component: <Overview />,
            },
            {
                type: "collapse",
                name: "Quản lý nhân viên",
                key: "app/dashboard/manage-staff",
                icon: <Icon fontSize="small">badge</Icon>,
                path: "manage-staff",
                component: <ManagerStaff />,
            },
            {
                type: "collapse",
                name: "Quản lý giáo viên",
                key: "app/dashboard/manage-teacher",
                icon: <Icon fontSize="small">school</Icon>,
                path: "manage-teacher",
                component: <ManagerTeacher />,
            },
            {
                type: "collapse",
                name: "Quản lý học viên",
                key: "app/dashboard/manage-student",
                icon: <Icon fontSize="small">person</Icon>,
                path: "manage-student",
                component: <ManagerStudent />,
            },
            {
                type: "collapse",
                name: "Quản lý trang chủ",
                key: "app/dashboard/manage-home-page",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "manage-home-page",
                component: <ManageHomePage />,
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
                key: "app/dashboard/*",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "*",
                component: <Overview />,
            },
            {
                type: "collapse",
                name: "Yêu cầu liên hệ",
                key: "app/dashboard/yeu-cau-lien-he",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "yeu-cau-lien-he",
                component: <ManagerRequestContact />,
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
