import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import style from "../../styles/manager/ExportRequest.module.css";
import {BsFilter} from "react-icons/bs";
import {filterRequest, getExportRequest} from "../../services/ManagerService.jsx";
import {IoReload} from "react-icons/io5";
import {
    Table,
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    IconButton
} from "@mui/material";
import {Add, Visibility} from "@mui/icons-material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

function ExportRequest() {
    const [requestList, setRequestList] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterDate, setFilterDate] = useState({
        value: null,
        format: ""
    });


    async function fetchData() {
        const response = await getExportRequest();
        console.log("API Response:", response);
        if (response.success) {
            setRequestList(response.data);
        } else {
            setRequestList([]);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    console.log(requestList);
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const handleDateChange = (value) => {
        setFilterDate({
            ...filterDate, value: value, format: value.format("YYYY-MM-DD")
        });
    };

    const clearDatePicker = () => {
        setFilterDate({
            ...filterDate, value: null, format: ""
        });
    }

    return (

        <div className="container-fluid">
            <div className="row">
                <div className="col-12 d-flex justify-content-end align-items-center mb-4 gap-2">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker slotProps={{field: {clearable: true, onClear: clearDatePicker}}}
                                    format={"YYYY-MM-DD"} timezone={"system"}
                                    onChange={handleDateChange}
                                    value={filterDate.value}
                                    label="Request Date"/>
                    </LocalizationProvider>
                </div>
            </div>
            <Paper sx={{overflowY: "hidden"}}>
                <TableContainer sx={{height: "23vh"}}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align={"center"}
                                           sx={{fontWeight: "bold", border: 1, borderColor: "inherit"}}>Code</TableCell>
                                <TableCell align={"center"}
                                           sx={{fontWeight: "bold", border: 1, borderColor: "inherit"}}>Request
                                    Date</TableCell>
                                <TableCell align={"center"}
                                           sx={{fontWeight: "bold", border: 1, borderColor: "inherit"}}>Last
                                    Modified</TableCell>
                                <TableCell align={"center"}
                                           sx={{
                                               fontWeight: "bold",
                                               border: 1,
                                               borderColor: "inherit"
                                           }}> Partner</TableCell>

                                <TableCell align={"center"} sx={{
                                    fontWeight: "bold",
                                    border: 1,
                                    borderColor: "inherit"
                                }}>Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {requestList.length > 0 ? (
                                requestList
                                    .filter((item) => item.requestDate.includes(filterDate.format))
                                    .reverse()
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((item, index) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                            <TableCell>{item.code}</TableCell>
                                            <TableCell>{item.requestDate}</TableCell>
                                            <TableCell>{item.lastModifiedDate}</TableCell>
                                            <TableCell>{item.partnerNames ? item.partnerNames.join(", ") : "N/A"}</TableCell>
                                            <TableCell align="center">
                                                <IconButton color="primary" onClick={() => handleViewDetail(item.code)}>
                                                    <Visibility/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">No Data Available</TableCell>
                                </TableRow>
                            )}

                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 25, 100]}
                    component="div"
                    count={requestList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}

export default ExportRequest;