import React from "react";
import { Button } from "@nextui-org/react";
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";

function Logout() {

  const navigate = useNavigate();
  function logout() {
    localStorage.clear();
    googleLogout();
    navigate("/login");
  };

  return (
    <Button color="secondary" onClick={logout}>
      LogOut
    </Button>
  );
}

export default Logout;
