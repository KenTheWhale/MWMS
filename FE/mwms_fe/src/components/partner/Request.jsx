// import {Button, Form, Table} from "react-bootstrap";
// import style from "../../styles/partner/Request.module.css";
// import {useEffect, useState} from "react";
// import RequestPopup from "../popup/RequestPopup.jsx";
// import {getSupplierRequestList} from "../../services/ManagerService.jsx";
//
// function Request() {
//     const [requests, setRequest] = useState([]);
//     const [selectedRequest, setSelectedRequest] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//
//     useEffect(() => {
//         async function fetchData() {
//             let username = JSON.parse(localStorage.getItem('user')).name;
//             const response = await getSupplierRequestList(username);
//             return response.data;
//         }
//
//         fetchData().then((data) => {
//             setRequest(data);
//         });
//     }, []);
//
//     const handleRowClick = (request) => {
//         setSelectedRequest(request);
//         setShowModal(true);
//     };
//
//     const handleAcceptClick = (request) => {
//         setSelectedRequest(request);
//         setShowModal(true);
//     };
//
//     const handleRejectClick = (request) => {
//         setSelectedRequest(request);
//         setShowModal(true);
//     };
//
//     const handleCloseModal = () => setShowModal(false);
//
//     return (
//         <div className={style.main}>
//             <div className={style.title_area}>
//                 <label className={`fs-1`}>Warehouse Request</label>
//             </div>
//             <div className={style.search_area}>
//                 <div className={style.search_input}>
//                     <Form.Group controlId="formGridSearch">
//                         <Form.Control type="email" placeholder="Enter warehouse name..."/>
//                     </Form.Group>
//                 </div>
//                 <div className={style.search_button}>
//                     <Button variant="primary" type="submit" style={{width: "100%"}}>
//                         Search
//                     </Button>
//                 </div>
//             </div>
//             <div className={style.table_area}>
//                 <Table striped bordered hover variant={`lightcyan`} onClick={(e) => {
//                     const row = e.nativeEvent.target.closest('tr');
//                     if (row && requests[row.rowIndex - 1]) {
//                         handleRowClick(requests[row.rowIndex - 1]);
//                     }
//                 }}>
//                     <thead>
//                     <tr>
//                         <th>No.</th>
//                         <th>Code</th>
//                         <th>Request Date</th>
//                         <th>Last Modified Date</th>
//                         <th>Status</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {requests.map((request, index) => (
//                         <tr key={index}>
//                             <td>{index + 1}</td>
//                             <td>{request.code}</td>
//                             <td>{request.requestDate}</td>
//                             <td>{request.lastModifiedDate}</td>
//                             <td>{request.status}</td>
//                         </tr>
//                     ))}
//                     </tbody>
//                 </Table>
//             </div>
//             <RequestPopup
//                 request={selectedRequest}
//                 show={showModal}
//                 handleClose={handleCloseModal}
//                 onAccept={handleAcceptClick}
//                 onReject={handleRejectClick}
//                 setRequest={setRequest}/>
//         </div>
//     );
// }
//
// export default Request;

import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {useEffect, useState} from "react";
import RequestPopup from "../popup/RequestPopup.jsx";
import {getSupplierRequestList} from "../../services/ManagerService.jsx";
import style from "../../styles/partner/Request.module.css";

const columns = [
    {id: "id", label: "No.", minWidth: 50, align: "center"},
    {id: "code", label: "Code", minWidth: 150},
    {id: "requestDate", label: "Request Date", minWidth: 200},
    {id: "lastModifiedDate", label: "Last Modified Date", minWidth: 200},
    {id: "status", label: "Status", minWidth: 150},
];

export default function Request() {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    async function FetchData() {
        let username = JSON.parse(localStorage.getItem("user")).name;
        const response = await getSupplierRequestList(username);
        setRequests(response.data);
    }


    useEffect(() => {

        FetchData();
    }, []);

    const handleRowClick = (row) => {
        setSelectedRequest(row);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div className={style.main}>
            <div className={style.title_area}>
                <label className="fs-1">Warehouse Request</label>
            </div>
            <Paper sx={{width: "100%", overflow: "hidden"}}>
                <TableContainer sx={{maxHeight: 440}}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{minWidth: column.minWidth}}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}
                                              onClick={() => handleRowClick(row)}>
                                        {columns.map((column) => {
                                            const value = column.id === "id" ? index + 1 + page * rowsPerPage : row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={requests.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <RequestPopup
                request={selectedRequest}
                show={showModal}
                handleClose={handleCloseModal}
                onFetch={FetchData}/>
        </div>
    );
}
