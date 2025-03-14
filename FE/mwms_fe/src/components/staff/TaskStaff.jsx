import {
    Accordion, AccordionDetails, AccordionSummary,
    Box,
    Dialog, DialogContent, DialogTitle, FormControl,
    IconButton, Input, InputLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import '../../styles/staff/TaskStaff.css'
import {useEffect, useState} from "react";
import {getAllTasks} from "../../services/StaffService.jsx";
import {ArrowDropDown, Create, Info} from "@mui/icons-material";

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

function RenderTable({tasks, OpenDetailModalFunc, SetSelectedTaskFunc, OpenBatchModalFunc}) {

    const [rowPerPage, setRowPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowPerPage(event.target.value);
        setPage(0);
    };

    const handleSelectedTask = (task) => {
        OpenDetailModalFunc()
        SetSelectedTaskFunc(task)
    }

    const handleCreateBatch = (task) => {
        OpenBatchModalFunc()
        SetSelectedTaskFunc(task)
    }

    return (
        <Paper sx={{height: "60vh"}}>
            <TableContainer style={{height: '53vh'}} className={'table-container'}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align={"center"}>No</TableCell>
                            <TableCell align={"center"}>Code</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align={"center"}>Detail</TableCell>
                            <TableCell align={"center"}>Create Batch</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {

                            tasks
                                .slice(page * rowPerPage, page * rowPerPage + rowPerPage)
                                .map((task, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell align={"center"}>{index + 1}</TableCell>
                                        <TableCell align={"center"}>{task.code}</TableCell>
                                        <TableCell>{task.description}</TableCell>
                                        <TableCell>{task.status}</TableCell>
                                        <TableCell align={"center"}>
                                            <IconButton color={"info"} onClick={() => handleSelectedTask(task)}>
                                                <Info/>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align={"center"}>
                                            <IconButton color={"success"} onClick={() => handleCreateBatch(task)}>
                                                <Create/>
                                            </IconButton>
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

function RenderTaskDetailModal({task, modal, CloseDetailModal}) {
    return (
        <Dialog
            open={modal.visible}
            onClose={CloseDetailModal}
            scroll={"paper"}
            maxWidth={"md"}
            fullWidth
        >
            <DialogTitle color={"textPrimary"}>Task detail</DialogTitle>
            <DialogContent dividers>
                <Box>
                    <RenderInfoTextField
                        label={"Code"}
                        data={task.code}
                        isCapital={false}
                    />

                    <RenderInfoTextField
                        label={"Description"}
                        data={task.description}
                        isCapital={true}
                    />

                    <RenderInfoTextField
                        label={"Status"}
                        data={task.status}
                        isCapital={true}
                    />

                    <RenderInfoTextField
                        label={"Partner"}
                        data={task.items.length > 0 ? task.items[0].partner.name : ""}
                        isCapital={true}
                    />
                    <Accordion>
                        <AccordionSummary expandIcon={<ArrowDropDown/>}>
                            <Typography variant="span" color="textPrimary">
                                Request
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <RenderInfoTextField
                                label={"Code"}
                                data={task.requestApp.code}
                                isCapital={false}
                            />

                            <RenderInfoTextField
                                label={"Carrier name"}
                                data={task.group.cName}
                                isCapital={true}
                            />

                            <RenderInfoTextField
                                label={"Carrier phone"}
                                data={task.group.cPhone}
                                isCapital={false}
                            />

                            <RenderInfoTextField
                                label={"Last modified"}
                                data={task.requestApp.modifiedDate}
                                isCapital={false}
                            />

                            <RenderInfoTextField
                                label={"Request date"}
                                data={task.requestApp.requestDate}
                                isCapital={false}
                            />

                            <RenderInfoTextField
                                label={"Status"}
                                data={task.group.status}
                                isCapital={true}
                            />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ArrowDropDown/>}>
                            <Typography variant="span" color="textPrimary">
                                Equipments
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {
                                task.items.map(
                                    (item, index) => (
                                        <Accordion key={index}>
                                            <AccordionSummary expandIcon={<ArrowDropDown/>}>
                                                <Typography variant="span" color="textPrimary">
                                                    {(index + 1) + ". " + item.equipment + " - " + item.category}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <RenderInfoTextField
                                                    label={"Quantity"}
                                                    data={item.quantity + " " + item.unit}
                                                    isCapital={false}
                                                />
                                            </AccordionDetails>
                                        </Accordion>
                                    )
                                )
                            }
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

function RenderCreateBatchModal({modal, CloseBatchModal, task}) {
    return (
        <Dialog
            open={modal.visible}
            onClose={CloseBatchModal}
            scroll={"paper"}
            maxWidth={"md"}
            fullWidth
        >
            <DialogTitle color={"textPrimary"}>Create batch</DialogTitle>
            <DialogContent dividers>
                <RenderInfoTextField
                    label={"Code"}
                    data={task.code}
                    isCapital={false}
                />
            </DialogContent>
        </Dialog>
    )
}

export function TaskStaff() {
    const [tasks, setTasks] = useState([]);
    const [action, setAction] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null)
    const [modal, setModal] = useState({
        visible: false,
        type: ""
    })

    useEffect(() => {
        async function getTasks() {
            const taskResponse = await getAllTasks()
            if (taskResponse.success) {
                setTasks(taskResponse.data)
            }
        }

        getTasks()
    }, [action]);

    function HandleOpenModal(open, type) {
        setAction(!action)
        setModal({...modal, visible: open, type: open ? type : ""})
    }

    function HandleGetSelectedTask(task) {
        setSelectedTask(task)
    }

    return (
        <>
            <Typography component={"span"} className={'d-flex justify-content-center'} color={"textPrimary"}
                        style={{fontSize: "2.5rem"}}>TASK
                MANAGEMENT</Typography>
            <RenderTable
                tasks={tasks}
                OpenDetailModalFunc={() => HandleOpenModal(true, "detail")}
                SetSelectedTaskFunc={HandleGetSelectedTask}
                OpenBatchModalFunc={() => HandleOpenModal(true, "batch")}
            />
            {
                modal.type === "detail" &&
                <RenderTaskDetailModal
                    modal={modal}
                    CloseDetailModal={() => HandleOpenModal(false, "detail")}
                    task={selectedTask}
                />
            }
            {
                modal.type === 'batch' &&
                <RenderCreateBatchModal
                    modal={modal}
                    CloseBatchModal={() => HandleOpenModal(false, "batch")}
                    task={selectedTask}
                />
            }
        </>

    )
}