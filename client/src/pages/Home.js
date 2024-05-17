import { React, useEffect, useState } from "react";
import axios from "axios";
import { Image } from "@nextui-org/react";
import "./home.css"

import { Link } from "react-router-dom";

import "../index.css";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

import { Audio } from "react-loader-spinner";
import Logout from "../components/Logout"

import Marks from "./Marks";
import Grade from "./Grade";
import Header from "../components/HeaderTop/Header";

import { Button } from "@nextui-org/react";
import Footer from "../components/Footer/Footer";
import NavbarBottom from "../components/NavbarBottom/NavbarBottom";

//debug
//caches.open("pwa-assets")
//.then(cache => {
//  cache.addAll(["/"]); // it stores two resources
//});

function Home() {
  // auth
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("JWT_TOKEN") === null) {
      console.log("NOT LOGGED IN");
      navigate("/login");
    } else {
      setToken(localStorage.getItem("JWT_TOKEN"));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}` 
    }

  }, []);
  // auth ends

  const [data, setData] = useState({});
  const getData = () => {

    if( token !== ""){
      if(localStorage.getItem('info') === null){
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}` 
        const url = "/api/get-info/";
        axios
          .get(url, {})
          .then(function(response) {
              console.log(response.data)
            setData(response.data);
            localStorage.setItem('info', JSON.stringify(response.data));
          })
          .catch(function(error) {
            console.log(error);
            localStorage.clear();
            navigate("/login");
          })
          .finally(function() { });
        }
      else{
        setData(JSON.parse(localStorage.getItem('info')));
      }
    }
  };
  useEffect(getData, [token]);

  const [pic, setPic] = useState({});
  const getPic = () => {
    if( token !== ""){
      if(localStorage.getItem('pic') === null){
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}` 
        const url = "/api/get-photo/";
        axios
          .get(url, {})
          .then(function(response) {
            setPic(response.data);
            localStorage.setItem('pic', JSON.stringify(response.data));
          })
          .catch(function(error) {
            console.log(error);
            localStorage.clear();
            navigate("/login");
          })
          .finally(function() { });
        }
      else{
        setPic(JSON.parse(localStorage.getItem('pic')));
      }
    }
  };
  useEffect(getPic, [token]);

  useEffect(() => {
    window.scroll(0, 0);
}, [])

  return (
    <div className="center px-unit-8 py-unit-8 home-container">
      <Header />
      <div className="home-profile-container">
        <h1 className="home-head">HOME</h1>
        <div className="home-basic-detail-container">
          <img src={pic.image} className="basic-detail-bg"></img>
          <div className="img-dark-overlay"></div>
          
          <div className="personal-data-container">
            <Image
              className="main-profile-image"
              loading="lazy"
              width={300}
              alt="USER"
              src={pic.image}
              fallbackSrc="https://via.placeholder.com/300x300"
            />

            <div className="person-detail-container">
              <div className="person-val-cont">
                <span className="person-field">Name: </span>
                <span className="person-value">{data['Name']}</span>
              </div>
              <div className="person-val-cont">
                <span className="person-field">Reg. No.: </span>
                <span className="person-value">{data['RollNumber']}</span>
              </div>
              <div className="person-val-cont">
                <span className="person-field">Department: </span>
                <span className="person-value">{data['Department']}</span>
              </div>
              <div className="person-val-cont">
                <span className="person-field">DOB: </span>
                <span className="person-value">{data['DateOfBirth']}</span>
              </div>
              <div className="person-val-cont">
                <span className="person-field">Native: </span>
                <span className="person-value">{data['Place of Birth']}</span>
              </div>
              <div className="person-val-cont">
                <span className="person-field">Blood Group: </span>
                <span className="person-value">{data['Blood Group']}</span>
              </div>
              <div className="person-val-cont">
                <span className="person-field">Semester: </span>
                <span className="person-value">{data['Semester']}</span>
              </div>
              <div className="person-val-cont">
                <span className="person-field">Attendance: </span>
                <span className="person-value">{data['P_Percentage']}</span>
              </div>
              <div className="person-val-cont">
                <span className="person-field">CGPA: </span>
                <span className="person-value">{data['CGPA']}</span>
              </div>
              <div className="person-val-cont">
                <span className="person-field">Arrear: </span>
                <span className="person-value">{data['totalArrear'] || 0}</span>
              </div>
            </div>
          </div>
        </div>
        {/* <Link to={'/mp'} className={`nav-bottom-container`}>
            <span className="nav-icon-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-bar-graph" viewBox="0 0 16 16">
                    <path d="M10 13.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-6a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm-2.5.5a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5zm-3 0a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5z"/>
                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                </svg>
            </span>
            <span className="nav-desc-container">
                Marks
            </span>
        </Link> */}
          <Button className="btn" color="secondary" onClick={() => navigate('/mp')} >
                Marks
          </Button>
          <Button className="btn" color="secondary" onClick={() => navigate('/attendance')} >
                Attendance
          </Button>
          <Button className="btn" color="secondary" onClick={() => navigate('/dineout')} >
                Dine Out
          </Button>
      </div>
      <div className="empty"></div>
      <NavbarBottom />
    </div>
  );
}
export default Home;
