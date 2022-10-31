import { intersection } from "lodash";
import Cookies from "js-cookie";

export const getObjectFromCookieValue = (cookieName) => {
    const data = Cookies.get(cookieName) || null;
    if (data) {
        return JSON.parse(data.slice(data.indexOf(":") + 1));
    } else {
        return null;
    }
};

export const isLoggedIn = () => {
    // return !!localStorage.getItem("roles");
    return !!getObjectFromCookieValue("userData");
};

export const isArrayWithLength = (arr) => {
    return Array.isArray(arr) && arr.length;
};

export const getAllowedRoutes = (routes) => {
    const roles = [getObjectFromCookieValue("userData")?.role] || [];
    return routes.filter(({ permission }) => {
        if (!permission) return true;
        else if (!isArrayWithLength(permission)) return true;
        else return intersection(permission, roles).length;
    });
};

export const formatterVND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
});

export const removeAccents = (str) => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
};

export const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
