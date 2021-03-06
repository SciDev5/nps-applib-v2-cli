import React, { ReactNode } from "react";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";
import WidthLimiter from "../../leaf-component/WidthLimiter/WidthLimiter";
import "./Header.scss";

export default class HeaderCommon extends React.Component<{pageName:string,isAdmin:boolean}> {
    render():ReactNode {
        return (
            <nav className="Header">
                <WidthLimiter>
                    <div className="-left">
                        <div className="-appName"><Trans>thisApp.name</Trans></div>
                        <div className="-pageName"><code><Trans>{`page.${this.props.pageName}.name`}</Trans></code></div>
                    </div>
                    <div className="-right">
                        <Link to="/"><Trans>header.homeLink</Trans></Link>
                        <Link to="/about"><Trans>header.aboutLink</Trans></Link>
                        <Link to="/settings"><Trans>header.settingsLink</Trans></Link>
                        {this.props.isAdmin && <Link to="/admin"><Trans>header.adminLink</Trans></Link>}
                    </div>
                </WidthLimiter>
            </nav>
        );
    }
}