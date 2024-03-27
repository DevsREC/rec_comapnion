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
            {/* <iframe className="rec-360-iframe" src="https://rec-experience.netlify.app/"></iframe> */}

            <iframe className="rec-360-iframe" style={
                {
                    width: '100%',
                    height: '640px',
                    border: 'none',
                    maxWidth: '100%'
                }
                } scrolling="no"  frameborder="0" src="https://webobook.com/public/639b37c5a145ee7a5706c3b2,en?ap=true&amp;si=true&amp;sm=false&amp;sp=true&amp;sfr=false&amp;sl=false&amp;sop=false&amp;" allowvr="yes"></iframe>
            <NavbarBottom />
        </div>
    )
}