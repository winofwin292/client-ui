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
    // const getToken = useCallback(() => {
    //     // Get new token if and only if existing token is available
    //     if (localStorage.getItem("token") != null) {
    //         getNewUserToken();
    //     }
    // }, []);

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
            try {
                const response = await userApi.getNewAccessToken();

                if (response.status !== 200) {
                    Cookies.remove("accessToken");
                    Cookies.remove("refreshToken");
                    Cookies.remove("userData");
                    navigate("/");
                }
                console.log(response);
            } catch (err) {
                console.log(err);
            }
        };
        // console.log(isLoggedIn());

        if (isLoggedIn()) {
            const interval = setInterval(
                () => getNewUserToken(),
                1000 * 60 * 9
            ); //tự động làm mới token mỗi 9 phút
            intervalRef.current = interval;
            return () => clearInterval(interval);
        }
    }, [navigate]);

    return (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
            <Routes />
        </ThemeProvider>
    );
};

export default App;
