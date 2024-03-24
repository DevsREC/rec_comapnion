import React, { useEffect, useState } from "react";

import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

import './RecTransport.css';

import Header from "../../components/HeaderTop/Header";
import Footer from "../../components/Footer/Footer";
import BusCard from "../../components/BusCard/BusCard";
import axios from "axios";
import NavbarBottom from "../../components/NavbarBottom/NavbarBottom";

export default function RecTransport() {
    const navigate = useNavigate();

    const [cardData, setCardData] = useState([]);
    const [busCards, setBusCards] = useState([])

    useEffect(() => {
        window.scroll(0, 0);
    }, [])

    async function getBus() {
        const url = '/api/get-bus';
        axios.get(url, {})
            .then((response) => {
                setCardData(response.data)
                setBusCards(prev => {
                    let newList = [];
                    response.data.forEach(bus => {
                        if(bus != null) 
                        newList.push(<BusCard busNo={bus.busNo} busName={bus.bpt == ''? bus.routes[0].pointName: bus.bpt} key={bus.busNo} busRouteList={bus.routes} busTime={bus.routes[0].pointTime == ''? bus.routes[1].pointTime: bus.routes[0].pointTime} />)
                    });
                    return newList;
                })
            })
    }
    
    useEffect(() => {
        try {
            getBus();
        } catch {
            console.log('Fucked Up!');
        }
    }, [])

    return(
        <div className="transport-container">
            <Header />
            <div className="bus-cont-container">
                <h1 className="home-head">REC Transport</h1>
                {/* <input type="text" className="transport-search" placeholder="Search..." onChange={(e) => onSearch(e)} /> */}
                <div className="trans-head-container">
                    <span>Bus No.</span>
                    <span>Starting Point</span>
                    <span>Time</span>
                </div>

                <div className="bus-cards-container">
                    {busCards.length == 0? <p><span>Sunday</span> or <span>Monday</span></p>: busCards}
                </div>
            </div>
            <NavbarBottom />
            {/* <Footer /> */}
        </div>
    )
}