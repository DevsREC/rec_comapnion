import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";

function Logout() {
  const navigate = useNavigate();
  function logout() {
    localStorage.clear();
    navigate("/login");
  }
  return (
    <Button onClick={logout} color="primary">
      LogOut
    </Button>
  );
}

export default Logout;
