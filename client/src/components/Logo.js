import React from "react";
import {Image} from "@nextui-org/react";


export default function logo({logoPath}) {
  return (
    // <Image
    //   width={200}
    //   alt="NextUI hero Image"
    //   src={logoPath}
    // />
    <img src={logoPath} className="login-logo"></img>
  );

}
