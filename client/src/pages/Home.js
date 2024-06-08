import { React, useEffect, useState } from "react";
import axios from "axios";
import { Image } from "@nextui-org/react";
import "./home.css"

import { useNavigate } from "react-router-dom";

import ReactGA from 'react-ga4';

import Header from "../components/HeaderTop/Header";

import { Button } from "@nextui-org/react";
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

  // Google analytics
  useEffect(() => {
    ReactGA.send(
      {
        hitType: 'pageview',
        page: window.location.pathname
      }
    )
  }, [])

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
            alert('Either Unified is down or Something went wrong in our side, Try again later 👋!')
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
