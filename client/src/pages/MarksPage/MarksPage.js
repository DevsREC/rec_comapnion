import React from "react";

import { useNavigate } from "react-router-dom";

import './MarksPage.css';
import { Button } from "@nextui-org/react";
import NavbarBottom from "../../components/NavbarBottom/NavbarBottom";
import Header from "../../components/HeaderTop/Header";

export default function MarksPage() {
    const navigate = useNavigate();

    return(
        <div className="mark-page-container">
            <Header />
            <Button className="btn" color="secondary" onClick={() => navigate('/marks')} >
                Internals
            </Button>
            <Button className="btn" color="secondary" onClick={() => navigate('/grade')} >
                Semester Results
            </Button>
            <NavbarBottom />
        </div>
    )
}