import React from "react";
import { Trans } from "react-i18next";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Application from "../../../data-structures/app/Application";
import AppFocusClass from "./AppFocusClassElt";
import "./app-focus-common.scss";

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function AppFocusPage(props:{apps:Application[], canEdit:boolean, onEdit:(app:Application)=>Promise<void>,onDelete:(app:Application)=>Promise<void>}):JSX.Element {
    const {id} = useParams<{id:string}>();

    const app = props.apps.find(v=>v.id===id);

    if (!app) {return (
        <div className="AppFocusPage-missing">
            <h1><Trans values={{id}}>page.app.appIdMissing</Trans></h1>
            <Link to="/"><Trans>page.app.backToMain</Trans></Link>
        </div>
    );} else
        return <AppFocusClass app={app} canEdit={props.canEdit} onEdit={async()=>await props.onEdit(app)} onDelete={async()=>await props.onDelete(app)}/>;
}