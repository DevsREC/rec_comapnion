import React, { useState } from "react";

import './BusCard.css';

export default function BusCard({busNo, busName, busTime, busRouteList}) {
    const [isClicked, setIsClicked] = useState(false);

    return(
        <>
            <div onClick={() => setIsClicked(prev => !prev)} className="bus-card-container">
                <div className="bus-no-cont">
                    {busNo}
                </div>
                <div className="bsu-start-cont">
                    {busName}
                </div>
                <div className="bus-time-cont">
                    {busTime.includes('am')? busTime: busTime + 'am'}
                </div>
            </div>
            <div className={`bus-route-container ${isClicked? 'active': ''}`}>
                    {
                        busRouteList.map(ele => 
                                <div  className="bus-route-card">
                                    <div className="circle-container">
                                        <div className="circle"></div>
                                    </div>
                                    <div className="stop-name-container">
                                        {ele.pointName}
                                    </div>
                                    <div className="stop-time-container">
                                        {ele.pointTime}
                                    </div>
                                </div>
                        )
                    }
            </div>
        </>
    )
}