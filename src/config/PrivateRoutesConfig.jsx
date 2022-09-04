import Roles from "./Roles";
import { Dashboard, TeacherCourse, StudentCourse, Home } from "../pages";

const PrivateRoutesConfig = [
    {
        component: Home,
        path: "",
        title: "Home",
        exact: true,
    },
    {
        component: Dashboard,
        path: "dashboard",
        title: "Dashboard",
        permission: [Roles.ADMIN],
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
