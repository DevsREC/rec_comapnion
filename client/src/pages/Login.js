import React from "react";
import { useState, useEffect } from "react";

import { Button, Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import {useGoogleLogin, GoogleLogin, GoogleLogout } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
function Login() {
  const navigate = useNavigate();
  const [rollno, setRollno] = useState("");
  const [token, setToken] = useState("");
  // Initial load
  useEffect(() => {
    // if (localStorage.getItem("rollno") === null) {
    //   console.log("no roll number");
    // } else {
    //   setRollno(localStorage.getItem("rollno"));
    //   navigate("/home");
    // }
    if (localStorage.getItem("JWT_TOKEN") === null) {
      console.log("TRY LOGINING");
    } else {
      setToken(localStorage.getItem("JWT_TOKEN"));
      navigate("/home");
    }
  }, [navigate]);
  function handlesubmit() {
    localStorage.setItem("rollno", rollno);
    // window.location.reload(false);
    navigate("/home");
  }
    const [ user, setUser ] = useState([]);
    const [ profile, setProfile ] = useState([]);

  const responseMessage = (response) => {
    let creds = jwtDecode(response.credential);
    setUser(creds);
    console.log("Credentials", creds);
    console.log("jwt: ", response.credential);
    localStorage.setItem("JWT_TOKEN", response.credential)
    navigate("/home");
  }
    const errorMessage = (error) => {
        console.log(error);
    };

  return (
    <div className="w-full h-full login">
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
      {/* <Input */}
      {/*   className="center max-w-xs" */}
      {/*   type="text" */}
      {/*   label="RollNumber" */}
      {/*   placeholder="211001084" */}
      {/*   onChange={(e) => setRollno(e.target.value)} */}
      {/* /> */}
      {/* <Button onClick={handlesubmit} className="center"> */}
      {/*   Submit */}
      {/* </Button> */}
    </div>
  );
}
export default Login;
