import Roles from "./Roles";
import { Dashboard, TeacherCourse, StudentCourse, Home } from "../pages";

const PrivateRoutesConfig = [
    {
        component: Home,
        path: "",
        title: "Home",
        exact: true,
        permission: [Roles.TEACHER, Roles.STUDENT],
    },
    {
        component: Dashboard,
        path: "",
        title: "Dashboard",
        permission: [Roles.ADMIN],
        exact: true,
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
