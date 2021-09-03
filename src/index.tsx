import React from "react";
import ReactDOM from "react-dom";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import SessionManager from "./data-structures/session/SessionManager";
import i18n from "./i18n";
import reportWebVitals from "./reportWebVitals";

const session = new SessionManager();

ReactDOM.render(
    <React.StrictMode>
        <I18nextProvider i18n={i18n}>
            <BrowserRouter>
                <App sessionManager={session}/>
            </BrowserRouter>
        </I18nextProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
