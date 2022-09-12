import Roles from "./Roles";
import { TeacherCourse, StudentCourse } from "pages";
import { Dashboard } from "pages/Dashboard";
import { ManagerUser } from "pages/ManagerUser";
import { Overview } from "pages/Dashboard/Overview";
import { ManageHomePage } from "pages/ManageHomePage";
import Loading from "components/common/Loading/Loading";

// @mui icons
import Icon from "@mui/material/Icon";

const PrivateRoutesConfig = [
    {
        component: Loading,
        path: "",
        title: "Loading",
        // exact: true,
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
                name: "adminSideBar.overview",
                key: "overview",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "*",
                component: <Overview />,
            },
            {
                type: "collapse",
                name: "adminSideBar.userMana",
                key: "user",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "user",
                component: <ManagerUser />,
            },
            {
                type: "collapse",
                name: "adminSideBar.homeMana",
                key: "manage-home-page",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "manage-home-page",
                component: <ManageHomePage />,
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
