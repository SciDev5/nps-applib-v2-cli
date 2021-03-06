import React, { ReactNode } from "react";
import { Route, Switch } from "react-router-dom";
import Application from "../data-structures/app/Application";
import ApplicationsManager, { AppsChangeHandler } from "../data-structures/app/ApplicationsManager";
import SessionManager, { SessionChangeHandler } from "../data-structures/session/SessionManager";
import UsersManager from "../data-structures/user/UsersManager";
import { AsyncVoid } from "../util/ts-util";
import "./App.scss";
import ErrorDisplay, { ErrorData } from "./error-display/ErrorDisplay";
import Error404Page from "./page/404/404";
import AboutPage from "./page/about/About";
import AdminPage, { LoginFunc } from "./page/admin/Admin";
import AppCreatePage from "./page/app-focus/AppCreatePage";
import AppFocusPage from "./page/app-focus/AppFocusPage";
import ExportPage from "./page/export-page/ExportPage";
import HeaderCommon from "./page/header-common/Header";
import MainPage from "./page/main/Main";
import SettingsPage from "./page/settings/Settings";
import VerifyLinkAlertPage from "./page/verify-link/VerifyLinkAlertPage";
import VerifyLinkPage from "./page/verify-link/VerifyLinkPage";


export default class App extends React.Component<{sessionManager:SessionManager,appsManager:ApplicationsManager,usersManager:UsersManager}> {
    readonly errDisplayRef = React.createRef<ErrorDisplay>();

    constructor(props:App["props"]) {
        super(props);
        props.sessionManager.addChangeHandler(this.onSessionChange);
        props.appsManager.addChangeHandler(this.onAppsChange);
    }

    private _mounted:boolean = false;
    componentDidMount() { this._mounted = true }
    componentWillUnmount() { this._mounted = false }
    onSessionChange:SessionChangeHandler = (manager,sess)=>{
        if (this._mounted)
            this.forceUpdate();
        console.log("LOGGED IN AS:",sess?.id);
    };
    onAppsChange:AppsChangeHandler = (manager,what,data)=>{
        if (this._mounted)
            this.forceUpdate();
    };

    onLogin:LoginFunc = async(cred)=>this.onLoginSignup("login",cred);
    onSignup:LoginFunc = async(cred)=>this.onLoginSignup("signup",cred);
    async onLoginSignup(which:"login"|"signup",cred:Parameters<LoginFunc>[0]):Promise<void|boolean> {
        const { sessionManager } = this.props;
        const { email, password } = cred;
        try {
            const result = await sessionManager[which](email, password);
            if (typeof result === "boolean")
                return result;
            else
                this.showErrorIfExists(result);
        } catch (e) {
            console.error(e);
            this.showRawError(e);
        }
    }
    onLogout:AsyncVoid = async()=>{
        const { sessionManager } = this.props;
        try {
            this.showErrorIfExists(await sessionManager.logout());
        } catch (e) {
            console.error(e);
            this.showRawError(e);
        }
    };
    onChangePassword = async(password:string)=>{
        const { sessionManager } = this.props;
        try {
            const v = await sessionManager.setPassword(password);
            this.showErrorIfExists(v);
            return v === undefined;
        } catch (e) {
            console.error(e);
            this.showRawError(e);
        }
    };

    doCreateApp = async():Promise<Application|null>=>{
        const { appsManager } = this.props;
        const res = await appsManager.createApp();
        
        if (res instanceof Application)
            return res;
        else { // It was an ErrorData
            console.error(res);
            this.showError(res);
            return null;
        }
    };
    doEditApp = async(app:Application):Promise<void>=>{
        const { appsManager } = this.props;
        const res = await appsManager.editApp(app);
        
        if (res) { // It was an ErrorData
            console.error(res);
            this.showError(res);
        }
    };
    doDeleteApp = async(app:Application):Promise<void>=>{
        const { appsManager } = this.props;
        const res = await appsManager.deleteApp(app);
        
        if (res) { // It was an ErrorData
            console.error(res);
            this.showError(res);
        }
    };

    showRawError = (err:any) => this.showError({error:"general",detail:(err instanceof Error)?err.stack:err});
    showErrorIfExists = (errData?:ErrorData|void):void => errData && this.showError(errData);
    showError = (errData:ErrorData):void=>{
        const { error, detail } = errData;
        this.errDisplayRef.current?.showError(error,detail);
    };

    render():ReactNode {
        const { sessionManager, appsManager } = this.props;
        const loggedIn = sessionManager.currentSession !== null,
            isAdmin = sessionManager.currentSession?.isAdmin ?? false,
            isEditor = isAdmin || (sessionManager.currentSession?.isEditor ?? false);

        const apps = appsManager.allApps;

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const Header = (props:{pageName:string}):JSX.Element => (
            <HeaderCommon pageName={props.pageName} isAdmin={isAdmin}/>
        );

        return (<>
            <ErrorDisplay ref={this.errDisplayRef} />
            <Switch>
                <Route path="/" exact>
                    <Header pageName="main" />
                    <MainPage apps={apps} canEdit={isEditor}/>
                </Route>
                <Route path="/app/:id" exact>
                    <Header pageName="app" />
                    <AppFocusPage apps={apps} canEdit={isEditor} onEdit={this.doEditApp} onDelete={this.doDeleteApp}/>
                </Route>
                <Route path="/new-app" exact>
                    <Header pageName="app" />
                    <AppCreatePage createApp={this.doCreateApp}/>
                </Route>
                <Route path="/export">
                    <Header pageName="export" />
                    <ExportPage apps={apps} canEdit={isEditor} appsManager={appsManager} />
                </Route>
                <Route path="/admin">
                    <Header pageName="admin" />
                    <AdminPage login={{loggedIn,email:sessionManager.currentSession?.email,login:this.onLogin,signup:this.onSignup}} isAdmin={isAdmin} isEditor={isEditor} usersManager={this.props.usersManager}/>
                </Route>
                <Route path="/settings">
                    <Header pageName="settings" />
                    <SettingsPage admin={{loggedIn,logout:this.onLogout,changePass:this.onChangePassword}} />
                </Route>
                <Route path="/about">
                    <Header pageName="about" />
                    <AboutPage />
                </Route>
                <Route path="/verify-link/:token">
                    <Header pageName="verify-link" />
                    <VerifyLinkPage sessionManager={sessionManager} showError={this.showError.bind(this)} />
                </Route>
                <Route path="/verify-link">
                    <Header pageName="verify-link-alert" />
                    <VerifyLinkAlertPage />
                </Route>
                <Route>
                    <Header pageName="404" />
                    <Error404Page />
                </Route>
            </Switch>
        </>);
    }
}
