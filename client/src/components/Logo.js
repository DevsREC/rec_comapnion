import React from "react";
import {Image} from "@nextui-org/react";
import logo_pic from "../img/logo.png";
export default function logo() {
  return (
    <Image
      width={300}
      alt="NextUI hero Image"
      src={logo_pic}
    />
  );

}
