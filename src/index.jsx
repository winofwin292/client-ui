import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

//Translate
import i18n from "./translation/i18n";
import { I18nextProvider } from "react-i18next";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";

import { BrowserRouter } from "react-router-dom";
import history from "utils/history";

import "tw-elements";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    // <React.StrictMode>
    <BrowserRouter history={history}>
        <I18nextProvider i18n={i18n}>
            <MaterialUIControllerProvider>
                <App />
            </MaterialUIControllerProvider>
        </I18nextProvider>
    </BrowserRouter>
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
