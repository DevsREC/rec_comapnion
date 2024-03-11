import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@nextui-org/react";

import './Rec360.css';

export default function Rec360() {
    
    const navigate = useNavigate();
    
    function onHomeClick() {
        navigate('/home');
    }
    
    return(
        <div className="rec-360-container">
            <iframe className="rec-360-iframe" src="https://rec-experience.netlify.app/"></iframe>
            <Button color="secondary" className="btn-bottom" onClick={onHomeClick}>
                Home
            </Button>
        </div>
    )
}