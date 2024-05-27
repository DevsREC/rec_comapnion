import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {GoogleLogin, googleLogout} from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import Logo from '../components/Logo';

import logo_pic from "../img/logo.png";
import rec_logo from '../img/reclogo.png'
import comp_logo from '../img/rec_comp_logo.png'

import './login.css';

function Login() {

  const navigate = useNavigate();
  const [token, setToken] = useState("");

  // Initial load
  useEffect(() => {
    if (localStorage.getItem("JWT_TOKEN") === null) {
      console.log("LOGIN...");
    } else {
      setToken(localStorage.getItem("JWT_TOKEN"));
      navigate("/home");
    }
  }, [navigate]);


  const responseMessage = (response) => {

    let creds = jwtDecode(response.credential);
    console.log("credentials", creds);

    // if people login using their personal mail don't let them sign in hacky way to do it
    if(creds['email'].split("@")[1] !== 'rajalakshmi.edu.in'){
      localStorage.clear();
      googleLogout();
      window.alert("use college email");
      navigate("/login");
      console.log("plase come here if wrong")

    }
    else {
      localStorage.setItem("JWT_TOKEN", response.credential)
      navigate("/home");

    }
  }
  const errorMessage = (error) => {
    console.log(error);
  };

  return (
    <div className="dark w-full h-full login" style={{colorScheme: 'light'}}>
      <div className="login-logo-container">
        <div className="login-logo-top">
          <Logo logoPath={rec_logo}/>
          <Logo logoPath={logo_pic}/>
        </div>
        <div className="login-logo-bottom">
          <Logo logoPath={comp_logo}/>
        </div>
      </div>
      
      <GoogleLogin 
        onSuccess={responseMessage} 
        onError={errorMessage} 
        size="large" 
        shape="circle" 
        theme="filled_black" 
        auto_select
      />
    </div>
  );
}
export default Login;
