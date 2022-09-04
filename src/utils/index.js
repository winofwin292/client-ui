import { intersection } from "lodash";

const isLoggedIn = () => {
    /*
     * Note:
     *  This app assume if local storage have roles it means
     *  user is authenticated you can update this logic as per your app.
     */
    return !!localStorage.getItem("roles");
};

const isArrayWithLength = (arr) => {
    return Array.isArray(arr) && arr.length;
};

const getAllowedRoutes = (routes) => {
    const roles = JSON.parse(localStorage.getItem("roles"));
    return routes.filter(({ permission }) => {
        if (!permission) return true;
        else if (!isArrayWithLength(permission)) return true;
        else return intersection(permission, roles).length;
    });
};

export { isArrayWithLength, getAllowedRoutes, isLoggedIn };
