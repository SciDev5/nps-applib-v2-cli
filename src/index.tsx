import React from "react";
import ReactDOM from "react-dom";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import ApplicationsManager from "./data-structures/app/ApplicationsManager";
import SessionManager from "./data-structures/session/SessionManager";
import UsersManager from "./data-structures/user/UsersManager";
import i18n from "./i18n";
import reportWebVitals from "./reportWebVitals";

const session = new SessionManager();
const apps = new ApplicationsManager();
const users = new UsersManager();

session.fetchCurrent();
apps.fetchCurrent();

ReactDOM.render(
    <React.StrictMode>
        <I18nextProvider i18n={i18n}>
            <BrowserRouter>
                <App sessionManager={session} appsManager={apps} usersManager={users}/>
            </BrowserRouter>
        </I18nextProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
