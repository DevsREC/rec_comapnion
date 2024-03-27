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

    const setOrUpdateLocalStorage = (busData) => {
        let date = new Date()
        localStorage.setItem('busData', JSON.stringify(busData));
        localStorage.setItem('lastBusDataFetched', date.getDate());
    }

    async function getBus() {
        const url = '/api/get-bus';
        console.log(localStorage.getItem('busData') !== null && localStorage.getItem('lastBusDataFetched') == new Date().getDate())
        if (localStorage.getItem('busData') !== null && localStorage.getItem('lastBusDataFetched') == new Date().getDate()) {
            console.log('Inside first');
            setCardData(localStorage.getItem('busData'))
            setBusCards(prev => {
                    let newList = [];
                    JSON.parse(localStorage.getItem('busData')).forEach(bus => {
                        if(bus != null) 
                        newList.push(<BusCard busNo={bus.busNo} busName={bus.bpt == ''? bus.routes[0].pointName: bus.bpt} key={bus.busNo} busRouteList={bus.routes} busTime={bus.routes[0].pointTime == ''? bus.routes[1].pointTime: bus.routes[0].pointTime} />)
                    });
                    return newList;
            })
        } else {
            console.log('Fetchinng');
            axios.get(url, {})
                .then((response) => {
                    setCardData(response.data);
                    setBusCards(prev => {
                        let newList = [];
                        response.data.forEach(bus => {
                            if(bus != null) 
                            newList.push(<BusCard busNo={bus.busNo} busName={bus.bpt == ''? bus.routes[0].pointName: bus.bpt} key={bus.busNo} busRouteList={bus.routes} busTime={bus.routes[0].pointTime == ''? bus.routes[1].pointTime: bus.routes[0].pointTime} />)
                        });
                        return newList;
                    })
                    setOrUpdateLocalStorage(response.data);
            })
        }
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
                    <div className="empty"></div>
                </div>
            </div>
            <NavbarBottom />
        </div>
    )
}