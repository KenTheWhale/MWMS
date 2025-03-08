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
    return input[0].toUpperCase() + input.slice(1);
}

function RenderInfoTextField({label, data, isCapital}){
    return(
        <FormControl variant="standard" fullWidth={true} sx={{m: 1}}>
            <InputLabel shrink>
                {label}
            </InputLabel>
            <Input readOnly defaultValue={isCapital ? CapitalizeFirstLetter(data) : data} />
        </FormControl>
    )
}

function RenderTable({tasks, SetActionFunc}) {
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
            SetActionFunc()
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
                                    <TableCell align={"center"}>
                                        <DeleteForeverRounded className="delete-btn"
                                                              onClick={() => handleDeleteTask(task.id)}/>
                                    </TableCell>
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

function RenderGroupModal({modalVisible, CloseModalFunc, groups, SetActionFunc, staffs}) {
    const [expand, setExpand] = useState("0")
    const [childExpand, setChildExpand] = useState("0")
    const [secondChildExpand, setSecondChildExpand] = useState("0")
    const [assignArea, setAssignArea] = useState(false)
    const [input, setInput] = useState({
        description: "",
        staff: ""
    })

    // console.log("Expand: " + expand)
    // console.log("Child: " + childExpand)
    // console.log("Second: " + secondChildExpand)

    const handleExpand = (value, type) => {
        switch (type) {
            case "1":
                setExpand(expand === value ? "0" : value)
                break
            case "2":
                setChildExpand(childExpand === value ? "0" : value)
                break
            case "3":
                setSecondChildExpand(secondChildExpand === value ? "0" : value)
                break
        }
    }

    const handleAssignArea = () => {
        SetActionFunc()
        setAssignArea(!assignArea)
    }

    const handleAssign = async (staffId, description, groupId) => {
        SetActionFunc()
        const response = await addTask(staffId, description, groupId)
        if(response.success){
            enqueueSnackbar(response.message, {variant: "success"});
            setAssignArea(false)
            setExpand("0")
            setChildExpand("0")
            setSecondChildExpand("0")
        }else {
            enqueueSnackbar(response.message, {variant: "error"})
        }
    }

    return (
        <Dialog
            open={modalVisible}
            onClose={CloseModalFunc}
            scroll={"paper"}
            maxWidth={"md"}
            fullWidth={true}
        >
            <DialogTitle style={{display: "flex", justifyContent: "space-between"}}>
                <Typography component={"p"}>Unassigned Requests</Typography>
                <Button variant={"contained"} color={"success"} onClick={() => {
                    setExpand("0")
                    setChildExpand("0")
                    setSecondChildExpand("0")
                }}>Collapse all</Button>
            </DialogTitle>
            <DialogContent dividers={true}>
                <Box>
                    {
                        groups.map((group, index) => (
                            <Accordion key={index} expanded={expand === (index + 1).toString()} onChange={() => handleExpand((index + 1).toString(), "1")}>
                                <AccordionSummary expandIcon={<ArrowDropDown/>}>
                                    <Typography component={"span"}>
                                        {(index + 1) + ". " + CapitalizeFirstLetter(group.items[0].partner) + " - " + group.items.length + " equipment(s) - " + group.request.requestDate}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {/*Carrier name*/}
                                    <RenderInfoTextField label={"Carrier name"} data={group.cName} isCapital={true}/>

                                    {/*Carrier phone*/}
                                    <RenderInfoTextField label={"Carrier phone"} data={group.cPhone} isCapital={false}/>

                                    {/*Delivery date*/}
                                    <RenderInfoTextField label={"Delivery date"} data={group.delivery} isCapital={false}/>

                                    {/*Status*/}
                                    <RenderInfoTextField label={"Status"} data={group.status} isCapital={true}/>

                                    <Accordion expanded={childExpand === expand + ".1"} onChange={() => handleExpand(expand + ".1", "2")}>
                                        <AccordionSummary expandIcon={<ArrowDropDown/>}>
                                            <Typography component={"span"}>
                                                {"Request information"}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {/*Code*/}
                                            <RenderInfoTextField label={"Code"} data={group.request.code} isCapital={false}/>

                                            {/*Type*/}
                                            <RenderInfoTextField label={"Type"} data={group.request.type} isCapital={true}/>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion expanded={childExpand === expand + ".2"} onChange={() => handleExpand(expand + ".2", "2")}>
                                        <AccordionSummary expandIcon={<ArrowDropDown/>}>
                                            <Typography component={"span"}>
                                                {"Items information"}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {group.items.map((item, index) => (
                                                <Accordion key={index} expanded={secondChildExpand === expand + "." + childExpand + "." + (index + 1)} onChange={() => handleExpand(expand + "." + childExpand + "." + (index + 1), "3")}>
                                                    <AccordionSummary expandIcon={<ArrowDropDown/>}>
                                                        <Typography component={"span"}>
                                                            {(index + 1) + ". " + item.equipment + " - " + item.category}
                                                        </Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        {/*Quantity*/}
                                                        <RenderInfoTextField label={"Quantity"} data={item.quantity} isCapital={false}/>

                                                        {/*Unit price*/}
                                                        <RenderInfoTextField label={"Quantity"} data={"$" + item.unitPrice} isCapital={false}/>
                                                    </AccordionDetails>
                                                </Accordion>
                                            ))}
                                        </AccordionDetails>
                                    </Accordion>
                                    {assignArea &&
                                        (
                                            <>
                                                <FormControl variant="standard" fullWidth={true} sx={{m: 1}}>
                                                    <InputLabel shrink>
                                                        Staff
                                                    </InputLabel>
                                                    <Select
                                                        value={input.staff}
                                                        onChange={(e) => setInput({...input, staff: e.target.value})}
                                                    >
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
                                                        required
                                                        value={input.description}
                                                        onChange={(e) => setInput({...input, description: e.target.value})}
                                                    />
                                                </FormControl>
                                            </>

                                        )
                                    }
                                </AccordionDetails>
                                <AccordionActions>
                                    {
                                        assignArea &&
                                        <Button variant="contained" color="error" onClick={handleAssignArea}>Cancel assign</Button>
                                    }
                                    <Button variant="contained" color="primary" onClick={assignArea ? () => handleAssign(input.staff, input.description, group.id) : handleAssignArea}>Assign staff</Button>
                                </AccordionActions>
                            </Accordion>
                        ))
                    }
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant={"contained"} color={"error"} onClick={CloseModalFunc}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default function Task() {
    const [tasks, setTasks] = useState([]);
    const [unassignedGrp, setUnassignedGrp] = useState([])
    const [staffs, setStaffs] = useState([])
    const [action, setAction] = useState(false)
    const [modal, setModal] = useState({
        visible: false,
        type: ""
    })

    /* fetch data */
    useEffect(() => {
        async function fetchData() {
            const taskResponse = await getTasks()
            const groupResponse = await getUnassignedGroups()
            const staffResponse = await getStaffs()
            if(taskResponse.success && groupResponse.success && staffResponse.success) {
                setTasks(taskResponse.data)
                setUnassignedGrp(groupResponse.data)
                setStaffs(staffResponse.data)
            }
        }

        fetchData()
    }, [action]);

    function SetAction() {
        setAction(!action)
    }

    function CloseCurrentModal(nextType){
        setModal({...modal, visible: false, type: nextType})
        SetAction()
    }

    function OpenModal(openType){
        setModal({...modal, visible: true, type: openType})
        SetAction()
    }

    const renderTableProp = {
        tasks: tasks,
        SetActionFunc: SetAction
    }

    const renderGroupModalProp = {
        modalVisible: modal.visible,
        CloseModalFunc: () => CloseCurrentModal(""),
        groups: unassignedGrp,
        SetActionFunc: SetAction,
        staffs: staffs
    }

    return (
        <>
            <Typography component={"span"} style={{fontSize: "2.5rem"}}>TASK MANAGEMENT</Typography>
            <div className={"assign"}>
                <Button style={{width: "12vw", height: "6vh"}}
                        variant={"contained"}
                        startIcon={<AddRounded/>}
                        disabled={unassignedGrp.length <= 0}
                        onClick={() => OpenModal("group")}
                >Assign task</Button>
            </div>
            <RenderTable {...renderTableProp}/>
            {
                modal.visible && modal.type === "group" &&
                <RenderGroupModal {...renderGroupModalProp}/>
            }
        </>
    )
}