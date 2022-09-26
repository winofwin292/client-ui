import { intersection } from "lodash";
import Cookies from "js-cookie";

const getObjectFromCookieValue = (cookieName) => {
    const data = Cookies.get(cookieName) || null;
    if (data) {
        return JSON.parse(data.slice(data.indexOf(":") + 1));
    } else {
        return null;
    }
};

const isLoggedIn = () => {
    // return !!localStorage.getItem("roles");
    return !!getObjectFromCookieValue("userData");
};

const isArrayWithLength = (arr) => {
    return Array.isArray(arr) && arr.length;
};

const getAllowedRoutes = (routes) => {
    const roles = [getObjectFromCookieValue("userData")?.role] || [];
    return routes.filter(({ permission }) => {
        if (!permission) return true;
        else if (!isArrayWithLength(permission)) return true;
        else return intersection(permission, roles).length;
    });
};

export {
    isArrayWithLength,
    getAllowedRoutes,
    isLoggedIn,
    getObjectFromCookieValue,
};
