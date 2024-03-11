import React from "react";

import './Header.css';
import Logout from "../Logout";

export default function Header() {
    return(
        <div className="header-top-container">
            <h1 className="header-app-name">REC Companion</h1>
            <Logout />
        </div>
    )
}