import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@nextui-org/react";

import './Rec360.css';
import Footer from "../../components/Footer/Footer";
import NavbarBottom from "../../components/NavbarBottom/NavbarBottom";

export default function Rec360() {
    
    const navigate = useNavigate();
    
    useEffect(() => {
        window.scroll(0, 0);
    }, [])
    
    return(
        <div className="rec-360-container">
            <iframe className="rec-360-iframe" src="https://rec-experience.netlify.app/"></iframe>
            <NavbarBottom />
        </div>
    )
}