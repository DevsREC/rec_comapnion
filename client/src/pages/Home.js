import { React, useEffect, useState } from "react";
import axios from "axios";
import { Image } from "@nextui-org/react";
import "./home.css"

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

//debug
caches.open("pwa-assets")
.then(cache => {
  cache.addAll(["/"]); // it stores two resources
});

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

  return (
    <div className="center px-unit-8 py-unit-8">
      <Logout className="right px-unit-8 py-unit-8" />
      {/* <Login /> */}
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
              <h2>ROLLNUMBER</h2>
            </TableCell>
            <TableCell>{data['RollNumber']}</TableCell>
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
