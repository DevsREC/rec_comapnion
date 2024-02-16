import { React, useEffect, useState } from "react";
import axios from "axios";
import { Image } from "@nextui-org/react";

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

import Marks from "./Marks";
import Grade from "./Grade";
import Logout from "../components/logout";

//debug

function Home() {
  // auth
  const [rollno, setRollno] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("rollno") === null) {
      console.log("no roll number");
      navigate("/login");
    } else {
      setRollno(localStorage.getItem("rollno"));
    }
  }, []);
  // auth ends

  const [data, setData] = useState({});
  const getData = () => {
    const url = "/api/get-info/" + rollno;
    axios
      .get(url, {})
      .then(function(response) {
        // console.log(response);
        setData(response.data);
      })
      .catch(function(error) {
        console.log(error);
      })
      .finally(function() { });
  };
  useEffect(getData, [rollno]);

  const [pic, setPic] = useState({});
  const getPic = () => {
    const url = "/api/get-photo/" + rollno;
    axios
      .get(url, {})
      .then(function(response) {
        // console.log(response);
        setPic(response.data);
      })
      .catch(function(error) {
        console.log(error);
      })
      .finally(function() { });
  };
  useEffect(getPic, [rollno]);

  return (
    <div className="center">
      {/* <Login /> */}
      <Logout className="right" />
      <Image
        loading="lazy"
        width={300}
        alt="USER"
        src={pic.image}
        fallbackSrc="https://via.placeholder.com/300x300"
      />
      <Table radius="none" shadow="none" isStriped>
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>ROLE</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell>
              {" "}
              <h2>ROLLNUMBER</h2>{" "}
            </TableCell>
            <TableCell>{rollno}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h2>Blood Group</h2>
            </TableCell>
            <TableCell>{data["Blood Group"]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h2>College Email</h2>
            </TableCell>
            <TableCell>{data["CollegeEmail"]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h2>Course Name</h2>
            </TableCell>
            <TableCell>{data["CourseName"]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h2>DATE OF BIRTH</h2>
            </TableCell>
            <TableCell>{data["DateOfBirth"]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h2>DEPARTMENT</h2>
            </TableCell>
            <TableCell>{data["Department"]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h2>NAME</h2>
            </TableCell>
            <TableCell>{data["Name"]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h2>PLACE OF BIRTH</h2>
            </TableCell>
            <TableCell>{data["Place of Birth"]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h2>Current Semester</h2>
            </TableCell>
            <TableCell>{data["Semester"]}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h2>Gender</h2>
            </TableCell>
            <TableCell>{data["Sex"]}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <h2>CGPA</h2>
            </TableCell>
            <TableCell>{data["CGPA"]}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <h2>Total Attendance</h2>
            </TableCell>
            <TableCell>{data["P_Percentage"]}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <h2>Total Arrear</h2>
            </TableCell>
            <TableCell>{data["totalArrear"]}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Marks />
      <Grade />
    </div>
  );
}
export default Home;
