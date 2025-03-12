import {useEffect, useState} from "react";
import {Modal} from "react-bootstrap";
import style from "../../styles/manager/ImportRequest.module.css";
import {
    cancelRequest,
    createRequestApplication,
    getEquipmentList,
    getImportRequest,
    getSupplierEquipment,
    updateRequestApplication,
    viewDetail
} from "../../services/ManagerService.jsx";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {enqueueSnackbar} from "notistack";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {Add, Cancel, CheckCircle, EditNote, Info, RemoveCircleOutline, Save, Visibility} from "@mui/icons-material";

function ImportRequest() {
    const [requestList, setRequestList] = useState([]);
    const [filterDate, setFilterDate] = useState({
        value: null,
        format: ""
    });
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [show, setShow] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState({});
    const [showAddCard, setShowAddCard] = useState(false);
    const [partners, setPartners] = useState([]);
    const [equipments, setEquipments] = useState([]);
    const [rows, setRows] = useState([{eqId: "", description: "", quantity: 0, unit: "", partner: ""}]);
    const [editRows, setEditRows] = useState({});
    const [equipmentForUpdate, setEquipmentForUpdate] = useState([]);
    const [showConfirmCancel, setShowConfirmCancel] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedEqId, setSelectedEqId] = useState([]);


    useEffect(() => {
        async function fetchData() {
            const response = await getImportRequest();
            setRequestList(response.data || []);
        }

        fetchData();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewDetail = async (code) => {
        try {
            const response = await viewDetail(code);
            if (!response || !response.data) {
                console.error("viewDetail API returned null or invalid data.");
                return;
            }
            setSelectedRequest(response.data);
            setShow(true);
        } catch (error) {
            console.error("Error in handleViewDetail:", error);
        }
    };

    const toggleGroup = (groupId) => {
        setExpandedGroups((previousState) => {
            const updatedState = {...previousState};

            updatedState[groupId] = !previousState[groupId];

            return updatedState;
        });
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

    const handleClose = () => setShow(false);

    const handleAddClick = () => {

        async function GetEquipment() {
            const response = await getEquipmentList();

            if (response) {
                setEquipments(response);
                // setFilterEquipments(response)
            } else {
                setEquipments([]);
            }
        }

        GetEquipment();
        setRows([{eqId: "", description: "", quantity: "", unit: "", partner: ""}]);
        setShowAddCard(!showAddCard);
    };

    const handleAddRow = () => {
        setRows(prevRows => {
            const newRow = { eqId: "", name: "", description: "", quantity: "", unit: "", partner: "" };
            return [...prevRows, newRow];
        });
    };
    console.log("Rows", rows)

    const handleInputRow = async (index, e, name) => {
        const value = e.target.value;
        setRows(prevRows => prevRows.map((item, i) => {
            if (i === index) {
                let updatedItem = { ...item, [name]: e.target.value };

                if (name === "eqId") {
                    const selectedEquipment = equipments.find(e => e.id === value);
                    if (selectedEquipment) {
                        updatedItem.description = selectedEquipment.description || "";
                        updatedItem.unit = selectedEquipment.unit || "";
                    }
                }

                return updatedItem;
            }
            return item;
        }));

        if(name === "eqId") {
            const response = await getSupplierEquipment(e.target.value);
            console.log("Partners", response)
            if (response.success){
                setPartners(response.data);
            } else {
                setPartners([]);
            }
        }
        if(name === "description"){

        }

    };


    useEffect(() => {
        if(rows.length > 0) {
            const selectedId = rows
                .filter(rows => rows.eqId !== "").map(row => row.eqId);
            setSelectedEqId(selectedId)
        }
    },[rows])


    const handleRemoveRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };

    const handleSubmit = () => {
        async function createRequest() {

            if (rows.length === 0 || rows.every(row => !row.partner || !row.eqId || !row.quantity)) {
                enqueueSnackbar("Please fill in at least one item", {variant: "error"});
                return;
            }

            const requestItems = rows.map(row => ({
                equipmentId: equipments.find(e => e.name === row.name)?.id,
                partnerId: row.partner,
                quantity: parseInt(row.quantity, 10),
            }))
            const response = await createRequestApplication(requestItems);

            if (response) {
                enqueueSnackbar(response.message, {variant: "success"});
                const updatedRequests = await getImportRequest();
                setRequestList(updatedRequests.data || []);
            } else {
                enqueueSnackbar(response.message, {variant: "error"});
            }
        }

        createRequest();
        setShowAddCard(false);
        setRows([]);
    }

    const handleEditRow = async (groupId, index, item) => {
        const selectedGroup = selectedRequest?.itemGroups.find(group => group.groupId === groupId);
        if (!selectedGroup) return;

        const existingEquipmentIds = selectedGroup?.requestItems?.map(item => item.eqId) || [];

        getSupplierEquipment(selectedGroup.partnerId).then(response => {
            const filteredEquipments = response.data.filter(eq =>
                !(existingEquipmentIds.includes(eq.id) && eq.id === item.eqId)
            );

            setEquipmentForUpdate(filteredEquipments);
            setEditRows(prev => ({
                ...prev,
                [`${groupId}-${index}`]: true,
            }));
        });
    };

    const cancelEditRow = (groupId, index) => {
        setEditRows(prev => {
            const updatedEditRows = {...prev};
            delete updatedEditRows[`${groupId}-${index}`];
            return updatedEditRows;
        });
    };

    const handleUpdateChange = (groupId, index, field, value) => {
        const rowKey = `${groupId}-${index}`;

        setEditRows(prev => ({
            ...prev,
            [rowKey]: {
                ...prev[rowKey],
                [field]: field === "quantity"
                    ? Math.max(1, Math.min(100, value))
                    : value
            }
        }));
    };

    const handleUpdateSave = async (groupId, index, item) => {
        const rowKey = `${groupId}-${index}`;
        const editData = editRows[rowKey];

        if (!editData) return;


        const response = await updateRequestApplication(
            item.itemId,
            editData.selectedEquipmentId || item.eqId,
            editData.quantity || item.quantity
        );

        if (response.success) {
            setSelectedRequest(prev => {
                const newItemGroups = prev.itemGroups.map(group => {
                    if (group.groupId === groupId) {
                        return {
                            ...group,
                            requestItems: group.requestItems.map((reqItem, idx) =>
                                idx === index ? {...reqItem, ...editData} : reqItem
                            )
                        };
                    }
                    return group;
                });

                return {...prev, itemGroups: newItemGroups};
            });

            setEditRows(prev => {
                const newRows = {...prev};
                delete newRows[rowKey];
                return newRows;
            });
            handleViewDetail(selectedRequest.code)
            enqueueSnackbar(response.message, {variant: "success"});

        } else {
            enqueueSnackbar(response.message, {variant: "success"});

        }
    };

    const handleCancelClick = (groupId) => {
        setSelectedGroupId(groupId);
        setShowConfirmCancel(true);
    };

    const handleCancel = async () => {
        const response = await cancelRequest(selectedGroupId);

        if (response) {
            enqueueSnackbar(response.message, {variant: "success"});

            setShowConfirmCancel(false)
            handleViewDetail(selectedRequest.code)
        } else {
            enqueueSnackbar(response.message, {variant: "error"});

        }
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <label className="d-flex justify-content-center fs-1">Import Request</label>
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
                    <Button size={"large"} startIcon={<Add/>} variant={"contained"} onClick={handleAddClick}>Add</Button>
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
                                           sx={{fontWeight: "bold", border: 1, borderColor: "inherit"}}>Request
                                    Date</TableCell>
                                <TableCell align={"center"}
                                           sx={{fontWeight: "bold", border: 1, borderColor: "inherit"}}>Last
                                    Modified</TableCell>
                                <TableCell align={"center"} sx={{
                                    fontWeight: "bold",
                                    border: 1,
                                    borderColor: "inherit"
                                }}>Action</TableCell>
                            </TableRow>

                        </TableHead>

                        <TableBody>
                            {requestList
                                .filter((item) => item.requestDate.includes(filterDate.format))
                                .reverse()
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((item, index) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        <TableCell sx={{border: 1, borderColor: "inherit"}}>{item.code}</TableCell>
                                        <TableCell
                                            sx={{border: 1, borderColor: "inherit"}}>{item.requestDate}</TableCell>
                                        <TableCell
                                            sx={{border: 1, borderColor: "inherit"}}>{item.lastModifiedDate}</TableCell>
                                        <TableCell sx={{border: 1, borderColor: "inherit"}} align={"center"}>
                                            <IconButton color={`white`} onClick={() => handleViewDetail(item.code)}>
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

            {showAddCard && (
                <Card className={style.addCard} sx={{mt: 3, p: 3}}>
                    <CardContent>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}>
                            <TableContainer sx={{maxHeight: `28vh`}}>
                                <Table stickyHeader>
                                    <TableHead >
                                        <TableRow>
                                            <TableCell align={"center"} sx={{fontWeight: "bold"}}>Equipment Name</TableCell>
                                            <TableCell align={"center"} sx={{fontWeight: "bold"}}>Partner Name</TableCell>
                                            <TableCell align={"center"} sx={{fontWeight: "bold"}}>Description</TableCell>
                                            <TableCell align={"center"} sx={{fontWeight: "bold"}}>Quantity</TableCell>
                                            <TableCell align={"center"} sx={{fontWeight: "bold"}}>Unit</TableCell>
                                            <TableCell align={"center"} sx={{fontWeight: "bold"}}>Remove Line</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row, index) => (
                                            <TableRow key={index}>

                                                <TableCell>
                                                    <FormControl fullWidth sx={{ m: 1 }}>
                                                        <InputLabel>Equipment</InputLabel>
                                                        <Select
                                                            variant="filled"
                                                            label="Equipment"
                                                            value={row.eqId}
                                                            onChange={(e) => handleInputRow(index, e, "eqId")}
                                                            required

                                                        >
                                                            <MenuItem disabled value="">Select Equipment</MenuItem>
                                                            {equipments
                                                                .map(equipment => (
                                                                <MenuItem disabled={selectedEqId.includes(equipment.id)} key={equipment.id} value={equipment.id}>
                                                                    {equipment.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>


                                                <TableCell>
                                                    <FormControl variant={"outlined"} fullWidth sx={{m: 1}}>
                                                        <InputLabel>Partner</InputLabel>
                                                        <Select
                                                            variant={"filled"}
                                                            label={"Partner"}
                                                            value={row.partner}
                                                            onChange={(e) => handleInputRow(index, e, "partner")}
                                                            required
                                                        >
                                                            <MenuItem disabled value="">Select Partner</MenuItem>
                                                            {partners.map((partner) => (
                                                                <MenuItem key={partner.id}
                                                                          value={partner.id}>
                                                                    {partner.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>

                                                <TableCell>
                                                    <TextField
                                                        fullWidth
                                                        sx={{m: 1}}
                                                        value={row.description}
                                                        variant="outlined"
                                                        InputProps={{readOnly: true}}
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <TextField
                                                        fullWidth
                                                        sx={{m: 1}}
                                                        type="number"
                                                        value={row.quantity}
                                                        onChange={(e) => handleInputRow(index, e, "quantity")}
                                                        required
                                                        slotProps={{htmlInput:{min:1, max:100}}}
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <TextField
                                                        fullWidth
                                                        sx={{m: 1}}
                                                        value={row.unit}
                                                        variant="outlined"
                                                        InputProps={{readOnly: true}}
                                                    />
                                                </TableCell>

                                                <TableCell align={"center"}>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleRemoveRow(index)}
                                                    >
                                                        <RemoveCircleOutline/>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{display: "flex", justifyContent: "center", mt: 2}}>
                                <Button  variant="outlined" color="primary" onClick={handleAddRow}>
                                    <Add/>
                                </Button>
                            </Box>

                            <CardActions disableSpacing sx={{justifyContent: "flex-end"}}>
                                <Button type="submit" variant="contained" color="success" endIcon={<CheckCircle/>}>
                                    Create
                                </Button>
                            </CardActions>
                        </form>
                    </CardContent>
                </Card>
            )}


            <Dialog open={show} onClose={handleClose} fullWidth maxWidth="xl">
                <DialogTitle>
                    <Typography variant="h4" color="text.primary">
                        Request Detail - {selectedRequest?.code}
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    {selectedRequest ? (
                        <div>
                            <div style={{ marginBottom: 16 }}>
                                <Typography variant="body1"><strong>Request Date:</strong> {selectedRequest.requestDate}</Typography>
                                <Typography variant="body1"><strong>Last Modified:</strong> {selectedRequest.lastModified}</Typography>
                            </div>

                            {selectedRequest.itemGroups?.length > 0 ? (
                                selectedRequest.itemGroups.map((group) => (
                                    <Card key={group.groupId} sx={{ mb: 3 }}>
                                        <CardContent>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography variant="h6" color="text.primary">
                                                    Partner : {group.partner}
                                                </Typography>
                                                <Button variant="outlined" endIcon={<Info/>} color={"info"} size="small" onClick={() => toggleGroup(group.groupId)}>
                                                     View
                                                </Button>
                                            </div>

                                            <Typography variant="body2">
                                                Carrier Name : {group.carrierName ? group.carrierName : "N/A"}
                                            </Typography>
                                            <Typography variant="body2">
                                                Carrier Phone: {group.carrierPhone ? group.carrierPhone : "N/A"}
                                            </Typography>
                                            <Typography variant="body2">Delivery Date: {group.deliveryDate ? group.deliveryDate : "N/A"}</Typography>
                                            <Typography variant="body2"><span style={{fontWeight: "bold"}}>Status: </span>{group.status}</Typography>

                                            {expandedGroups[group.groupId] && (
                                                <>
                                                    <TableContainer>
                                                        <Table sx={{ mt: 2 }}>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Equipment Name</TableCell>
                                                                    <TableCell>Description</TableCell>
                                                                    <TableCell>Quantity</TableCell>
                                                                    <TableCell>Unit</TableCell>
                                                                    <TableCell>Action</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {group.requestItems.map((item, index) => {
                                                                    const rowKey = `${group.groupId}-${index}`;
                                                                    const isEditing = editRows[rowKey];

                                                                    return (
                                                                        <TableRow key={index}>
                                                                            <TableCell>
                                                                                {isEditing ? (
                                                                                    <Select
                                                                                        value={isEditing.selectedEquipmentId || item.eqId}
                                                                                        onChange={(e) =>
                                                                                            handleUpdateChange(group.groupId, index, "selectedEquipmentId", parseInt(e.target.value, 10))
                                                                                        }
                                                                                        fullWidth
                                                                                    >
                                                                                        <MenuItem value={item.eqId} disabled>{item.equipmentName}</MenuItem>
                                                                                        {equipmentForUpdate
                                                                                            .filter(eq => eq.id !== item.eqId)
                                                                                            .map(eq => (
                                                                                                <MenuItem key={eq.id} value={eq.id}>{eq.name}</MenuItem>
                                                                                            ))}
                                                                                    </Select>
                                                                                ) : (
                                                                                    item.equipmentName
                                                                                )}
                                                                            </TableCell>

                                                                            <TableCell>{item.equipmentDescription}</TableCell>
                                                                            <TableCell>
                                                                                {isEditing ? (
                                                                                    <TextField
                                                                                        type="number"
                                                                                        value={isEditing.quantity || item.quantity}
                                                                                        onChange={(e) =>
                                                                                            handleUpdateChange(group.groupId, index, "quantity", parseInt(e.target.value, 10) || 1)
                                                                                        }
                                                                                        inputProps={{ min: 1, max: 100 }}
                                                                                        fullWidth
                                                                                    />
                                                                                ) : (
                                                                                    item.quantity
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell>{item.unit}</TableCell>
                                                                            <TableCell>
                                                                                {group.status !== "canceled" && (
                                                                                    isEditing ? (
                                                                                        <div>
                                                                                            <IconButton size="small" color="primary" onClick={() => handleUpdateSave(group.groupId, index, item)}>
                                                                                                <Save/>
                                                                                            </IconButton>
                                                                                            <IconButton size="small" color="error" onClick={() => cancelEditRow(group.groupId, index)}>
                                                                                                <Cancel/>
                                                                                            </IconButton>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <IconButton size="small" variant="outlined" onClick={() => handleEditRow(group.groupId, index, item)}>
                                                                                            <EditNote/>
                                                                                        </IconButton>
                                                                                    )
                                                                                )}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>

                                                    {group.status !== "canceled" && (
                                                        <div style={{ textAlign: "right", marginTop: 16 }}>
                                                            <Button variant="contained" color="warning" onClick={() => handleCancelClick(group.groupId)}>
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Typography variant="body2" align="center">No groups available</Typography>
                            )}
                        </div>
                    ) : (
                        <Typography variant="body2" align="center">No request detail</Typography>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Modal
                className={`${style.confirmModal}`}
                show={showConfirmCancel}
                onHide={() => setShowConfirmCancel(false)}
                centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Cancel Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to cancel this request
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmCancel(false)}>No</Button>
                    <Button variant="danger" onClick={() => handleCancel()}>Yes</Button>
                </Modal.Footer>
            </Modal>

        </div>

    );
}

export default ImportRequest;
