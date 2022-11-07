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
import { ManagerCourse } from "pages/ManagerCourse";
import { ManagerCategory } from "pages/ManagerCategory";
import { ManagerProduct } from "pages/ManagerProduct";
import { ManagerOrder } from "pages/ManagerOrder";
import { Tools } from "pages/Tools";

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
                name: "Nhân viên",
                key: "app/dashboard/manage-staff",
                icon: <Icon fontSize="small">badge</Icon>,
                path: "manage-staff",
                component: <ManagerStaff />,
            },
            {
                type: "collapse",
                name: "Giáo viên",
                key: "app/dashboard/manage-teacher",
                icon: <Icon fontSize="small">school</Icon>,
                path: "manage-teacher",
                component: <ManagerTeacher />,
            },
            {
                type: "collapse",
                name: "Học viên",
                key: "app/dashboard/manage-student",
                icon: <Icon fontSize="small">person</Icon>,
                path: "manage-student",
                component: <ManagerStudent />,
            },
            {
                type: "collapse",
                name: "Khóa học",
                key: "app/dashboard/manage-course",
                icon: <Icon fontSize="small">person</Icon>,
                path: "manage-course",
                component: <ManagerCourse />,
            },
            {
                type: "collapse",
                name: "Loại hàng",
                key: "app/dashboard/manage-category",
                icon: <Icon fontSize="small">person</Icon>,
                path: "manage-category",
                component: <ManagerCategory />,
            },
            {
                type: "collapse",
                name: "Sản phẩm",
                key: "app/dashboard/manage-product",
                icon: <Icon fontSize="small">person</Icon>,
                path: "manage-product",
                component: <ManagerProduct />,
            },
            {
                type: "collapse",
                name: "Đơn hàng",
                key: "app/dashboard/manage-order",
                icon: <Icon fontSize="small">local_mall</Icon>,
                path: "manage-order",
                component: <ManagerOrder />,
            },
            {
                type: "collapse",
                name: "Trang chủ",
                key: "app/dashboard/manage-home-page",
                icon: <Icon fontSize="small">assignment</Icon>,
                path: "manage-home-page",
                component: <ManageHomePage />,
            },
            {
                type: "collapse",
                name: "Công cụ",
                key: "app/dashboard/tools",
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
