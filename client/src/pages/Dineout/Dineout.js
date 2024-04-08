import React from "react";

import './Dineout.css';
import Header from "../../components/HeaderTop/Header";
import NavbarBottom from "../../components/NavbarBottom/NavbarBottom";

import { useNavigate } from 'react-router-dom'
import { Button } from "@nextui-org/react";



export default function Dineout() {
    // const navigate = useNavigate();

    return(
        <>
            <Header />
                <iframe src="https://rec-companion-dineout.vercel.app/" className="dine-out-iframe" />
                {/* <Button color="secondary" onClick={() => navigate(-1)} >
                    Go Back
                </Button> */}
                <div className="empty"></div>
            <NavbarBottom />
        </>
    )
}