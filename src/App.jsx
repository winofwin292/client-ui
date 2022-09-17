import React, { useEffect } from "react";

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

import Routes from "./routes";

const App = () => {
    const [controller, dispatch] = useMaterialUIController();
    const { direction, darkMode } = controller;

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

    return (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
            <Routes />
        </ThemeProvider>
    );
};

export default App;
