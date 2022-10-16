import React, { useEffect, useRef } from "react";

// react-router-dom components
import { useNavigate } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";

// Material Dashboard 2 React themes
import theme from "assets/theme";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setDarkMode } from "context";

//notistack
import { SnackbarProvider } from "notistack";

//i18next translate
import i18n from "translation/i18n";

import Cookies from "js-cookie";

import Routes from "routes";
import userApi from "api/Users/useApi";

import { isLoggedIn } from "utils";

const App = () => {
    const [controller, dispatch] = useMaterialUIController();
    const { direction, darkMode } = controller;
    const navigate = useNavigate();

    const intervalRef = useRef();

    // Setting the dir attribute for the body element
    useEffect(() => {
        document.body.setAttribute("dir", direction);

        const currLang = localStorage.getItem("lang") || "vi";
        localStorage.setItem("lang", currLang);
        i18n.changeLanguage(currLang);

        let isDark = false;

        if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            isDark = true;
        }

        if (localStorage.getItem("darkTheme"))
            isDark =
                localStorage.getItem("darkTheme") === "true" ? true : false;

        setDarkMode(dispatch, isDark);
        localStorage.setItem("darkTheme", isDark);
    }, [direction, dispatch]);

    useEffect(() => {
        // Get new Token
        const getNewUserToken = async () => {
            const response = await userApi.getNewAccessToken();

            if (response.status !== 200) {
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                Cookies.remove("userData");
                navigate("/");
            }
        };

        if (isLoggedIn()) {
            getNewUserToken();
            const interval = setInterval(
                () => getNewUserToken(),
                1000 * 60 * 8
            ); //tự động làm mới token mỗi 8 phút
            intervalRef.current = interval;
            return () => clearInterval(interval);
        }
    }, [navigate]);

    return (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
            <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
                <Routes />
            </SnackbarProvider>
        </ThemeProvider>
    );
};

export default App;
