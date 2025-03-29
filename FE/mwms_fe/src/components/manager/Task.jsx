import "../../styles/manager/Task.css"
import {
    Accordion, AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Input,
    InputLabel, MenuItem,
    Paper, Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {addTask, deleteTask, getStaffs, getTasks, getUnassignedGroups} from "../../services/ManagerService.jsx";
import {enqueueSnackbar} from "notistack";
import {AddRounded, ArrowDropDown, DeleteForeverRounded} from "@mui/icons-material";

/* eslint-disable react/prop-types */
function CapitalizeFirstLetter(input) {
    return input === "" || !input ? input : input[0].toUpperCase() + input.slice(1);
}

function RenderInfoTextField({label, data, isCapital}) {
    return (
        <FormControl variant="standard" fullWidth={true} sx={{m: 1}}>
            <InputLabel shrink>
                {label}
            </InputLabel>
            <Input readOnly
                   defaultValue={!data || data === "" ? "N/A" : (isCapital ? CapitalizeFirstLetter(data) : data)}/>
        </FormControl>
    )
}

function RenderTable({tasks, fetchData}) {
    const [rowPerPage, setRowPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowPerPage(event.target.value);
        setPage(0);
    };

    const handleDeleteTask = async (id) => {
        const response = await deleteTask(id);
        if (response.success) {
            fetchData()
            enqueueSnackbar(response.message, {variant: 'success'});
        } else {
            enqueueSnackbar(response.message, {variant: 'error'});
        }

    }

    return (
        <Paper style={{height: '60vh'}}>
            <TableContainer style={{height: '53vh'}} className={"table-container"}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>Code</TableCell>
                            <TableCell>Assigned Date</TableCell>
                            <TableCell>Staff</TableCell>
                            <TableCell>Partner</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align={"center"}>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks
                            .slice(page * rowPerPage, page * rowPerPage + rowPerPage)
                            .map((task, index) => (
                                <TableRow key={index} hover>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{task.code}</TableCell>
                                    <TableCell>{task.assignDate}</TableCell>
                                    <TableCell>{task.staff}</TableCell>
                                    <TableCell>{task.partner}</TableCell>
                                    <TableCell>{task.description}</TableCell>
                                    <TableCell>{task.status}</TableCell>
                                    {
                                        task.status.toLowerCase() === "assigned" ?
                                            <TableCell align={"center"}>
                                                <DeleteForeverRounded
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteTask(task.id)}
                                                />
                                            </TableCell> : <TableCell align={"center"}></TableCell>
                                    }

                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component={"div"}
                count={tasks.length}
                rowsPerPage={rowPerPage}
                page={page}
                slotProps={{
                    select: {
                        inputProps: {
                            'aria-label': 'rows per page',
                        },
                        native: true,
                    },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

function RenderGroupModal({modalVisible, closeModal, groups, fetchData, setGrp, openAssignModal}) {

    const handleAssignArea = (group) => {
        setGrp(group)
        fetchData
        openAssignModal()
    }

    return (
        <Dialog
            open={modalVisible}
            onClose={closeModal}
            scroll={"paper"}
            maxWidth={"md"}
            fullWidth={true}
        >
            <DialogTitle style={{display: "flex", justifyContent: "space-between"}}>
                <Typography variant={"h5"} color={"textPrimary"}>Unassigned Requests</Typography>
            </DialogTitle>
            <DialogContent dividers={true}>
                <Box>
                    {
                        groups.map((group, index) => (
                            <Accordion key={index}>
                                <AccordionSummary expandIcon={<ArrowDropDown/>}>
                                    <Typography component={"span"}>
                                        {(index + 1) + ". " + CapitalizeFirstLetter(group.items[0].partner) + " - " + group.items.length + " equipment(s) - Delivery: " + group.delivery}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {/*Carrier name*/}
                                    <RenderInfoTextField label={"Carrier name"} data={group.cName} isCapital={true}/>

                                    {/*Carrier phone*/}
                                    <RenderInfoTextField label={"Carrier phone"} data={group.cPhone} isCapital={false}/>

                                    {/*Delivery date*/}
                                    <RenderInfoTextField label={"Delivery date"} data={group.delivery}
                                                         isCapital={false}/>

                                    {/*Status*/}
                                    <RenderInfoTextField label={"Status"} data={group.status} isCapital={true}/>

                                    <Accordion>
                                        <AccordionSummary expandIcon={<ArrowDropDown/>}>
                                            <Typography component={"span"}>
                                                {"Request information"}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {/*Code*/}
                                            <RenderInfoTextField label={"Code"} data={group.request.code}
                                                                 isCapital={false}/>

                                            {/*Type*/}
                                            <RenderInfoTextField label={"Type"} data={group.request.type}
                                                                 isCapital={true}/>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion>
                                        <AccordionSummary expandIcon={<ArrowDropDown/>}>
                                            <Typography component={"span"}>
                                                {"Items information"}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {group.items.map((item, index) => (
                                                <Accordion key={index}>
                                                    <AccordionSummary expandIcon={<ArrowDropDown/>}>
                                                        <Typography component={"span"}>
                                                            {(index + 1) + ". " + item.equipment + " - " + item.category}
                                                        </Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        {/*Quantity*/}
                                                        <RenderInfoTextField label={`Quantity (${item.unit})`}
                                                                             data={item.quantity}
                                                                             isCapital={false}/>
                                                    </AccordionDetails>
                                                </Accordion>
                                            ))}
                                        </AccordionDetails>
                                    </Accordion>
                                </AccordionDetails>
                                <AccordionActions>
                                    <Button variant="contained" color="primary"
                                            onClick={() => handleAssignArea(group)}>Assign
                                        staff</Button>
                                </AccordionActions>
                            </Accordion>
                        ))
                    }
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant={"contained"} color={"error"} onClick={closeModal}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

function RenderAssignModal({modalVisible, closeModal, group, fetchData, staffs}) {
    const [input, setInput] = useState({
        staff: 0,
        description: ""
    })

    const handleAssign = async () => {
        const response = await addTask(input.staff, input.description, group.id)
        if (response.success) {
            enqueueSnackbar(response.message, {variant: "success"});
        } else {
            enqueueSnackbar(response.message, {variant: "error"})
        }
        fetchData
        closeModal()
    }


    return (
        <Dialog
            open={modalVisible}
            onClose={closeModal}
            scroll={"paper"}
            maxWidth={"md"}
            fullWidth={true}
        >
            <DialogTitle style={{display: "flex", justifyContent: "space-between"}}>
                <Typography variant={"h5"} color={"textPrimary"}>Assign staff</Typography>
            </DialogTitle>
            <DialogContent dividers={true}>
                <Box>
                    <RenderInfoTextField
                        label={"Request code"}
                        data={group.request.code}
                        isCapital={false}
                    />

                    <RenderInfoTextField
                        label={"Assigned date (Same day as delivery)"}
                        data={group.delivery}
                        isCapital={false}
                    />

                    <FormControl variant="standard" fullWidth={true} sx={{m: 1}}>
                        <InputLabel shrink>
                            Staff
                        </InputLabel>
                        <Select
                            value={input.staff}
                            onChange={(e) => setInput({
                                ...input,
                                staff: e.target.value
                            })}
                        >
                            <MenuItem value={0} disabled>{"N/A"}</MenuItem>
                            {staffs.map((s, index) => (
                                <MenuItem key={index} value={s.id}>{s.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl variant="standard" fullWidth={true} sx={{m: 1}}>
                        <InputLabel shrink>
                            Description
                        </InputLabel>
                        <Input
                            multiline
                            maxRows={3}
                            required
                            value={input.description}
                            onChange={(e) => setInput({
                                ...input,
                                description: e.target.value
                            })}
                        />
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="error" onClick={closeModal}>Cancel</Button>
                <Button variant="contained" color="primary" disabled={input.staff === 0} onClick={handleAssign}>Assign</Button>
            </DialogActions>
        </Dialog>
    )
}

export default function Task() {
    const [tasks, setTasks] = useState([]);
    const [unassignedGrp, setUnassignedGrp] = useState([])
    const [staffs, setStaffs] = useState([])
    const [modal, setModal] = useState({
        visible: false,
        type: ""
    })
    const [currentGrp, setCurrentGrp] = useState(null)

    const fetchData = async () => {
        const taskResponse = await getTasks()
        const groupResponse = await getUnassignedGroups()
        const staffResponse = await getStaffs()
        if (taskResponse.success && groupResponse.success && staffResponse.success) {
            setTasks(taskResponse.data)
            setUnassignedGrp(groupResponse.data)
            setStaffs(staffResponse.data)
        }
    }

    /* fetch data */
    useEffect(() => {
        fetchData()
    }, []);

    function ToggleModal(visibility, modalType) {
        setModal({...modal, visible: visibility, type: visibility ? modalType : ""})
        console.log({visible: visibility, type: visibility ? modalType : ""})
        fetchData()
    }



    return (
        <>
            <Typography component={"span"} className={'d-flex justify-content-center'} color={"textPrimary"}
                        style={{fontSize: "2.5rem"}}>TASK
                MANAGEMENT</Typography>
            <div className={"assign"}>
                <Button style={{width: "12vw", height: "6vh"}}
                        variant={"contained"}
                        startIcon={<AddRounded/>}
                        disabled={unassignedGrp.length <= 0}
                        onClick={() => ToggleModal(true, "group")}
                >Assign task</Button>
            </div>
            <RenderTable tasks={tasks} fetchData={fetchData()}/>
            {
                modal.visible && modal.type === "group" &&
                <RenderGroupModal
                    modalVisible={modal.visible}
                    closeModal={() => ToggleModal(false, "")}
                    groups={unassignedGrp}
                    fetchData={fetchData()}
                    setGrp={setCurrentGrp}
                    openAssignModal={() => ToggleModal(true, "assign")}
                />
            }
            {
                modal.visible && modal.type === "assign" && currentGrp !== null &&
                <RenderAssignModal
                    modalVisible={modal.visible}
                    closeModal={() => ToggleModal(true, "group")}
                    fetchData={fetchData()}
                    staffs={staffs}
                    group={currentGrp}
                />
            }
        </>
    )
}