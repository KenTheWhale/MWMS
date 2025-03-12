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
import {ArrowDropDown, Info} from "@mui/icons-material";

/* eslint-disable react/prop-types */

function CapitalizeFirstLetter(input) {
    return input === "" || !input ? "N/A" : input[0].toUpperCase() + input.slice(1);
}

function RenderInfoTextField({label, data, isCapital}) {
    return (
        <FormControl variant="standard" fullWidth={true} sx={{m: 1}}>
            <InputLabel shrink>
                {label}
            </InputLabel>
            <Input readOnly defaultValue={isCapital ? CapitalizeFirstLetter(data) : data}/>
        </FormControl>
    )
}

function RenderTable({tasks, OpenDetailModalFunc, SetSelectedTaskFunc}) {

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
                    <Accordion>
                        <AccordionSummary expandIcon={<ArrowDropDown/>}>
                            <Typography variant="span" color="textPrimary">
                                Request
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <RenderInfoTextField
                                label={"Carrier name"}
                                data={task.group.cName}
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

                        </AccordionDetails>
                    </Accordion>
                </Box>
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
        switch (type) {
            case "detail":
                setModal({...modal, visible: open, type: open ? type : ""})
                break
        }
    }

    function HandleGetSelectedTask(task){
        setSelectedTask(task)
    }

    return (
        <>
            <Typography component={"span"} className={'d-flex justify-content-center'} color={"textPrimary"} style={{fontSize: "2.5rem"}}>TASK
                MANAGEMENT</Typography>
            <RenderTable
                tasks={tasks}
                OpenDetailModalFunc={() => HandleOpenModal(true, "detail")}
                SetSelectedTaskFunc={HandleGetSelectedTask}
            />
            {
                modal.type === "detail" &&
                    <RenderTaskDetailModal
                        modal={modal}
                        CloseDetailModal={() => HandleOpenModal(false, "detail")}
                        task={selectedTask}
                    />
            }
        </>

    )
}