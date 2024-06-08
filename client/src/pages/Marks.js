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
  Tabs,
  Tab,
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
import Header from "../components/HeaderTop/Header";
import NavbarBottom from "../components/NavbarBottom/NavbarBottom";
import Attendance from "../pages/Attendance";

function Marks() {
  // auth
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [sempage, setSempage] = useState(1);
  const [assignmentPage, setAssignmentPage] = useState(1);
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
      if(localStorage.getItem('internal-marks') === null){
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}` 
        const url = `/api/internal-marks/`;
        axios
          .get(url, {})
          .then(function (response) {
            setData(response.data);
            localStorage.setItem('internal-marks', JSON.stringify(response.data));
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
        setData(JSON.parse(localStorage.getItem('internal-marks')));
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
    console.log("Fuckking: ")
    console.log(data?.[sempage]?.[catpage]);
    return data?.[sempage]?.[catpage];
  }, [data, catpage, sempage]);

  const assRow = useMemo(() => {
    console.log('----- See ---- here -----');
    console.log(data?.[assignmentPage]?.[3]);
    return data?.[assignmentPage]?.[3];
    // return data?.[assignmentPage]
  })

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
      key: "Total",
      label: "Marks",
    },
  ];

  const columnsAssignment = [
    {
      key: "subjectName",
      label: "Subject Name",
    },
    {
      key: "totalMarks",
      label: "Marks",
    },
  ];

  if (Object.keys(data).length === 0 ) {
    return <Audio className='center'/>;
  }
  console.log(data)
  const no_sems = Object.keys(data).length;
  function onHomeClick() {
    navigate('/home');
  }

  // console.log(data[1][0]);
  //
  const markTabs = [
    {
      id: "cat",
      label: "CAT Marks",
      content: <Table
                radius="none"
                shadow="none"
                isStriped
                topContent={
                  <div>
                    <h1>Internals</h1>
                    <Pagination
                      showControls
                      color="secondary"
                      total={no_sems}
                      initialPage={no_sems}
                      page={sempage}
                      onChange={(page) => setSempage(page)}
                      loop
                    />
                    <h1>CAT</h1>
                    <Pagination
                      showControls
                      color="secondary"
                      total={3}
                      initialPage={1}
                      page={catpage + 1}
                      onChange={(page) => setCatpage(page - 1)}
                      loop
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
    },
    {
      id: 'assignments',
      label: 'Assignments',
      content: <Table
                radius="none"
                shadow="none"
                isStriped="true"
                topContent={
                  <div>
                    <h1>Assingment Marks</h1>
                    <Pagination
                      showControls
                      color="secondary"
                      total={no_sems}
                      initialPage={assignmentPage}
                      page={assignmentPage}
                      onChange={(page) => setAssignmentPage(page)}
                      loop
                    />
                  </div>
                }
              >
                <TableHeader columns={columnsAssignment}>
                  {
                    (column) => <TableColumn key={column.key}>{column.label}</TableColumn>
                  }
                </TableHeader>
                <TableBody items={assRow}>
                  {
                    (item) => {
                      console.log('See tghus');
                      console.log(item);
                      return <TableRow key={1}>
                              {
                                (columnKey) => {
                                  return <TableCell>{getKeyValue(item,columnKey)}</TableCell>
                                }
                              }
                            </TableRow>
                    }
                  }
                </TableBody>
              </Table>
    }
  ]
  return (
    <div className="bg-background text-foreground">
      <Header />
      <div className="flex w-full flex-col tab-mark">
        <Tabs color="secondary" className="tabs-mark" aria-label="Marks Tab" items={markTabs}>
          {
            (item) => 
              <Tab key={item.id} title={item.label}>
                {item.content}
              </Tab>
          }
        </Tabs>
      </div>

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
export default Marks;
