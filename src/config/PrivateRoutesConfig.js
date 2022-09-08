import Roles from "./Roles";
import { TeacherCourse, StudentCourse, Home } from "../pages";
import { Dashboard } from "pages/Dashboard";
import { ManagerUser } from "pages/ManagerUser";
import { Overview } from "pages/Dashboard/Overview";

// @mui icons
import Icon from "@mui/material/Icon";

const PrivateRoutesConfig = [
    {
        component: Home,
        path: "",
        title: "Home",
        exact: true,
    },
    {
        component: Dashboard,
        path: "dashboard/*",
        title: "Dashboard",
        permission: [Roles.ADMIN],
        children: [
            {
                type: "collapse",
                name: "Overview",
                key: "overview",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "*",
                component: <Overview />,
            },
            {
                type: "collapse",
                name: "Manager User",
                key: "user",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "user",
                component: <ManagerUser />,
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
