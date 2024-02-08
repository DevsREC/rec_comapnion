import React from "react";
import { useState, useEffect } from "react";

import { Button, Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import {useGoogleLogin, GoogleLogin, GoogleLogout } from '@react-oauth/google';
import axios from 'axios';
function Login() {
  const navigate = useNavigate();
  const [rollno, setRollno] = useState("");
  // Initial load
  useEffect(() => {
    if (localStorage.getItem("rollno") === null) {
      console.log("no roll number");
    } else {
      setRollno(localStorage.getItem("rollno"));
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
    setUser(response);
    console.log("response",response);
  }
    const errorMessage = (error) => {
        console.log(error);
    };

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });
    useEffect(
        () => {
            if (user) {
        console.log("what the fuck", user)
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.clientId}`, {
                        headers: {
                            Authorization: `Bearer ${user.clientId}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
            console.log(res)
                        setProfile(res.data);
                        localStorage.setItem("rollno", "211001084");
                        navigate("/home");
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user ]
    );
  return (
    <div className="w-full h-full login">
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
      <Input
        className="center max-w-xs"
        type="text"
        label="RollNumber"
        placeholder="211001084"
        onChange={(e) => setRollno(e.target.value)}
      />
      <Button onClick={handlesubmit} className="center">
        Submit
      </Button>
    </div>
  );
}
export default Login;
