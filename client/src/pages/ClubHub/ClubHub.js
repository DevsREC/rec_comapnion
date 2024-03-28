import React from "react";

import './ClubHub.css';
import NavbarBottom from "../../components/NavbarBottom/NavbarBottom";
import Header from "../../components/HeaderTop/Header";

export default function ClubHub() {
    return(
        <>
            <Header />
                <iframe className="club-hub-iframe" src="https://clubhubdevs-seven.vercel.app/"></iframe>
            <NavbarBottom />
        </>
    )
}