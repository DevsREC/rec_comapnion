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
  // PaginationItem,
  // PaginationCursor,
  // Button,
  // Image,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
//debug
import { Audio } from "react-loader-spinner";
//

function Marks() {
  // auth
  const [rollno, setRollno] = useState("");
  const [sempage, setSempage] = useState(1);
  const [catpage, setCatpage] = useState(0);
  const navigate = useNavigate();
  const [data, setData] = useState({});
  useEffect(() => {
    if (localStorage.getItem("rollno") === null) {
      console.log("no roll number");
      navigate("/login");
    } else {
      setRollno(localStorage.getItem("rollno"));
    }
    if (rollno) {
      const url = `/api/internal-marks/${rollno}`;
      axios
        .get(url, {})
        .then(function(response) {
          // console.log(response.data);
          // console.log(data[1][0]);
          setData(response.data);
        })
        .catch(function(error) {
          console.log("shit good luck; i ain't fixing that", error);
        })
        .finally(() => {
          // console.log(data[1][0]);
        });
    }
  }, [rollno, navigate]);

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
    return data?.[sempage]?.[catpage];
  }, [data, catpage, sempage]);
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
  // const [semp, setSemp] = useState(1);
  // const [catp, setCatp] = useState(0);
  // const rows = data[semp][catp];
  // console.log("rows", rows);

  if (data[1] === undefined) {
    return <Audio />;
  }
  const no_sems = Object.keys(data).length;
  if (rows === undefined) {
    return <h1>Loading</h1>;
  }

  // console.log(data[1][0]);
  //
  return (
    <div className="dark bg-background text-foreground">
      <Table
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
            <h1>CAT</h1>
            <Pagination
              showControls
              total={3}
              initialPage={1}
              page={catpage + 1}
              onChange={(page) => setCatpage(page - 1)}
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
    </div>
  );
}
export default Marks;
