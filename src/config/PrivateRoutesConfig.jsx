import Roles from "./Roles";
import { Dashboard, TeacherCourse, StudentCourse, Shop } from "../pages";

const PrivateRoutesConfig = [
    {
        component: Shop,
        path: "",
        title: "Shop",
        exact: true,
    },
    {
        component: Dashboard,
        path: "/dashboard",
        title: "Dashboard",
        permission: [Roles.ADMIN],
    },
    {
        component: TeacherCourse,
        path: "/teacher",
        title: "Giáo viên",
        permission: [Roles.TEACHER],
    },
    {
        component: StudentCourse,
        path: "/student",
        title: "Học viên",
        permission: [Roles.STUDENT],
    },
];
export default PrivateRoutesConfig;
