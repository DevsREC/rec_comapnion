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
  Button
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
//debug
import { Audio } from "react-loader-spinner";
import Footer from "../components/Footer/Footer";
import Header from "../components/HeaderTop/Header";
import NavbarBottom from "../components/NavbarBottom/NavbarBottom";
//

function Grade() {
  // auth
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [sempage, setSempage] = useState(1);
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
      if(localStorage.getItem('sem-marks') === null){
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}` 
        const url = `/api/sem-marks/`;
        axios
          .get(url, {})
          .then(function(response) {
            setData(response.data);
            localStorage.setItem('sem-marks', JSON.stringify(response.data));
            console.log("grade:", data);
          })
          .catch(function(error) {
            console.log(error);
            localStorage.clear();
            navigate("/login");
          });
      }
      else{
        setData(JSON.parse(localStorage.getItem("sem-marks")));
      }
    }

  };
  useEffect(getData, [token]);

  // debug
  // console.log(data);
  const rows = useMemo(() => {
    return data?.[sempage];
  }, [data, sempage]);
  //debug

  //
  // auth ends

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  const columns = [
    {
      key: "AcademicYear",
      label: "Academic Year",
    },
    {
      key: "Subject",
      label: "Subject Name",
    },
    {
      key: "SubjCode",
      label: "Subject Code",
    },
    {
      key: "Exam_Type",
      label: "Exam/Supplementary/Arrear",
    },
    {
      key: "Grade",
      label: "Grade",
    },
  ];

  if (data[1] === undefined) {
    return <Audio />;
  }
  const no_sems = Object.keys(data).length;
  if (rows === undefined) {
    return <h1>Loading</h1>;
  }

  function onHomeClick() {
    navigate('/home');
  }

  // console.log(data[1][0]);
  //
  return (
    <div>
      <Header />
      
      <Table
        className="marks-table"
        radius="none"
        shadow="none"
        isStriped
        topContent={
          <div>
            <h1>Semester</h1>
            <Pagination
              showControls
              total={no_sems}
              initialPage={no_sems}
              page={sempage}
              onChange={(page) => setSempage(page)}
            />
          </div>
        }
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
          margin: '50px auto',
          display: 'block'
        }
      } onClick={() => navigate(-1)}>Go back</Button>
      <div className="empty"></div>
      {/* <Button color="secondary" className="btn-bottom" onClick={onHomeClick}>
        Home
      </Button> */}
      <NavbarBottom />
      {/* <Footer /> */}
    </div>
  );
}
export default Grade;
