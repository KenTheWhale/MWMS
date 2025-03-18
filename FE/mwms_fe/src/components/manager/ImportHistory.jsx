import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {
    Accordion, AccordionDetails,
    AccordionSummary,
    Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow, Typography,
} from "@mui/material";
import {ExpandMore, Visibility} from "@mui/icons-material";
import {useEffect, useState} from "react";
import axiosClient from "../../config/api.jsx";
import {getHistoryImportList} from "../../services/ManagerService.jsx";

function ImportHistory() {

    const [requestList, setRequestList] = useState([]);
    const [filterDate, setFilterDate] = useState({
        value: null,
        format: ""
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    async function fetchData() {
        const response = await getHistoryImportList();

        if (response.success) {
            setRequestList(response.data);
        } else {
            setRequestList([]);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const clearDatePicker = () => {
        setFilterDate({
            ...filterDate, value: null, format: ""
        });
    }

    const handleDateChange = (value) => {
        setFilterDate({
            ...filterDate, value: value, format: value.format("YYYY-MM-DD")
        });
    };

    const handleViewDetail = (detail) => {
        setSelectedDetail(detail);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedDetail(null);
    };

    return (
        <div className={`container-fluid`}>
            <div className="row">
                <label className="d-flex justify-content-center fs-1">History Request</label>
            </div>

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
                    <Table size={"small"} stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align={"center"}
                                           sx={{fontWeight: "bold", border: 1, borderColor: "inherit"}}>Code</TableCell>
                                <TableCell align={"center"}
                                           sx={{fontWeight: "bold", border: 1, borderColor: "inherit"}}>Partner
                                </TableCell>
                                <TableCell align={"center"}
                                           sx={{fontWeight: "bold", border: 1, borderColor: "inherit"}}>Equipment
                                </TableCell>
                                <TableCell align={"center"}
                                           sx={{fontWeight: "bold", border: 1, borderColor: "inherit"}}>Request
                                    Quantity</TableCell>
                                <TableCell align={"center"}
                                           sx={{fontWeight: "bold", border: 1, borderColor: "inherit"}}>Import
                                    Quantity</TableCell>
                                <TableCell align={"center"}
                                           sx={{fontWeight: "bold", border: 1, borderColor: "inherit"}}>Area
                                    -- position
                                </TableCell>
                                <TableCell align={"center"}
                                           sx={{fontWeight: "bold", border: 1, borderColor: "inherit"}}>Request
                                    Date</TableCell>
                                <TableCell align={"center"}
                                           sx={{fontWeight: "bold", border: 1, borderColor: "inherit"}}>Delivery
                                    Date</TableCell>

                                <TableCell align={"center"} sx={{
                                    fontWeight: "bold",
                                    border: 1,
                                    borderColor: "inherit"
                                }}>View detail</TableCell>
                            </TableRow>

                        </TableHead>

                        <TableBody>
                            {requestList
                                .filter((item) => item.requestDate.includes(filterDate.format))
                                .reverse()
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((item, index) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        <TableCell
                                            sx={{border: 1, borderColor: "inherit"}}>{item.code}
                                        </TableCell>
                                        <TableCell
                                            sx={{border: 1, borderColor: "inherit"}}>{item.partner}</TableCell>
                                        <TableCell
                                            sx={{border: 1, borderColor: "inherit"}}>{item.equipment}</TableCell>
                                        <TableCell align={"right"}
                                            sx={{border: 1, borderColor: "inherit"}}>{item.requestQty}</TableCell>
                                        <TableCell align={"right"}
                                            sx={{border: 1, borderColor: "inherit"}}>{item.batchQty}</TableCell>
                                        <TableCell
                                            sx={{border: 1, borderColor: "inherit"}}>[{item.area}] --  [{item.position}]</TableCell>
                                        <TableCell
                                            sx={{border: 1, borderColor: "inherit"}}>{item.requestDate}</TableCell>
                                        <TableCell
                                            sx={{border: 1, borderColor: "inherit"}}>{item.deliveryDate}</TableCell>
                                        <TableCell sx={{border: 1, borderColor: "inherit"}} align={"center"}>
                                            <IconButton color={`white`}
                                                        onClick={() => handleViewDetail(item)}>
                                                <Visibility/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
                <DialogTitle variant={"h5"} color={"textPrimary"}>Import History Detail</DialogTitle>
                <DialogContent>
                    {selectedDetail && (
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="body1"> <strong>Request Code</strong> : {selectedDetail.code}</Typography>
                                <Typography><strong>Partner</strong> : {selectedDetail.partner}</Typography>
                                <Typography><strong>Equipment</strong> : {selectedDetail.equipment}</Typography>
                                <Typography><strong>Request Date</strong> : {selectedDetail.requestDate}</Typography>
                                <Typography><strong>Delivery Date</strong> : {selectedDetail.deliveryDate}</Typography>
                                <div color={"textPrimary"} style={{ marginTop: "10px" , marginBottom: "10px" }}>
                                    <Divider sx={{borderColor: "primary.main"}} />
                                </div>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant="inherit"><strong>Task Details</strong></Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography sx={{ ml: 2 }}><strong>Code</strong> : {selectedDetail.historyDetail.task.code}</Typography>
                                        <Typography sx={{ ml: 2 }}><strong>Staff</strong> : {selectedDetail.historyDetail.task.staff}</Typography>
                                        <Typography sx={{ ml: 2 }}><strong>Assigned</strong> : {selectedDetail.historyDetail.task.assigned}</Typography>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant="inherit"><strong>Batch Detail</strong></Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography sx={{ ml: 2 }}><strong>Code</strong>: {selectedDetail.historyDetail.batch.code}</Typography>
                                        <Typography sx={{ ml: 2 }}><strong>Position</strong> : {selectedDetail.historyDetail.batch.position}</Typography>
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMore />}>
                                                <Typography variant="inherit"><strong>Item</strong></Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <ul>
                                                    {selectedDetail.historyDetail.batch.items.map((batchItem, index) => (
                                                        <li key={index}>Serial: {batchItem.serial}</li>
                                                    ))}
                                                </ul>
                                            </AccordionDetails>
                                        </Accordion>
                                    </AccordionDetails>
                                </Accordion>
                            </CardContent>
                        </Card>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant={"contained"} onClick={handleCloseDialog} color="error">Close</Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default ImportHistory;