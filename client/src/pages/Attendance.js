import { React, useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Pagination,
  Button,
  // PaginationItem,
  // PaginationCursor,
  // Button,
  // Image,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
//debug
import { Audio } from "react-loader-spinner";
//

import './marks.css';
import Footer from "../components/Footer/Footer";
import Header from "../components/HeaderTop/Header";
import NavbarBottom from "../components/NavbarBottom/NavbarBottom";

function Attendance() {
  // auth
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [sempage, setSempage] = useState(1);
  const [catpage, setCatpage] = useState(0);
  const [data, setData] = useState({});

  useEffect(() => {

    if (localStorage.getItem("JWT_TOKEN") === null) {
      console.log("NOT LOGGED IN");
      navigate("/login");
    } else {
      setToken(localStorage.getItem("JWT_TOKEN"));
    }
  }, []);

  const getData = () => {
    if (token !== "") {
      if(localStorage.getItem('attendance') === null){
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}` 
        const url = `/api/get-attendance`;
        axios
          .get(url, {})
          .then(function (response) {
            setData(response.data);
            console.log(data)
            localStorage.setItem('attendance', JSON.stringify(response.data));
          })
          .catch(function (error) {
            console.log(error);
            localStorage.clear();
            navigate("/login");
          })
          .finally(() => {
            // console.log(data[1][0]);
          });

      }
      else{
        setData(JSON.parse(localStorage.getItem('attendance')));
      }
    }

  }
  useEffect(getData, [token]);

  // debug
  // console.log(data);
  // voodoo magic to cache the data. Then use ?. operator to return only when the data is defined.
  // js sucks ass
  // don't ever use javascript.
  // waiting for wasm to take over tbh
  // if rust frontend was a bit more mature i would be using that instead of this react shit
  //
  // pagination just changes the `key` value
  // useing useState
  const rows = useMemo(() => {
    return data;
  }, [data]);
  //debug

  //
  // auth ends

  //
  //
  // defines the columns in the table
  // the rows are supplied by the api backend
  const columns = [
    {
      key: "SubjName",
      label: "Subject Name",
    },
    {
      key: "percentage",
      label: "Total percentage",
    },
    {
      key: "present",
      label: "Present Count",
    },
    {
      key: "absent",
      label: "Absent Count",
    },
    {
      key: "total",
      label: "Total number of classes",
    },
  ];

  if (Object.keys(data).length === 0 ) {
    return <Audio className='center'/>;
}

  function onHomeClick() {
    navigate('/home');
  }

  // console.log(data[1][0]);
  //
  return (
    <div className="bg-background text-foreground">
      <Header />
      <Table
        className="marks-table"
        radius="none"
        shadow="none"
        isStriped
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={1}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Button color="secondary" style={
        {
          margin: '0px auto',
          display: 'block'
        }
      } onClick={() => navigate(-1)}>Go back</Button>
      <div className="empty"></div>
      <NavbarBottom />
    </div>
  );
}
export default Attendance;

