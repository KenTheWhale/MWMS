import {
    Accordion, AccordionDetails, AccordionSummary,
    Box, Button,
    Dialog, DialogContent, DialogTitle, FormControl,
    IconButton, Input, InputLabel, MenuItem,
    Paper, Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow, TextField,
    Typography
} from "@mui/material";
import '../../styles/staff/TaskStaff.css'
import {useEffect, useState} from "react";
import {createBatch, getAllArea, getAllTasks} from "../../services/StaffService.jsx";
import {ArrowDropDown, Create, Info} from "@mui/icons-material";
import {enqueueSnackbar} from "notistack";

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

function RenderCreateBatchModal({modal, CloseBatchModal, task, areas, RefreshFunc, TestFunc, refresh}) {

    const [expand, setExpand] = useState(0);

    const [batchItems, setBatchItems] = useState(task.items.map(item => ({
        id: item.id,
        quantity: 1,
        length: 1,
        width: 1,
        area: 0,
        position: 0
    })))

    const limitation = {
        length: {max: 100, min: 1},
        width: {max: 100, min: 1},
        quantity: {max: 100, min: 1}
    }

    const filteredArea = (itemId, eqId) => {
        return areas.filter(area =>
            area.equipment.id === eqId &&
            checkValidSquare(area.square, batchItems.find(i => i.id === itemId).length, batchItems.find(i => i.id === itemId).width)
        )
    }

    const filteredPositions = (itemId, area) => {
        return area ? area.positionList.filter(position =>
            checkValidSquare(position.square, batchItems.find(i => i.id === itemId).length, batchItems.find(i => i.id === itemId).width)
        ) : []
    }

    const handleExpand = (index) => {
        setExpand(index);
    }

    const handleInputChange = (id, e) => {
        const value = checkLimitation(e.target.value, e.target.name);
        if (Number.isInteger(value) || e.target.value === "") {
            setBatchItems(batch => batch.map(item =>
                item.id === id ? {...item, [e.target.name]: value} : item
            ))
        }
    }

    const handleAreaChange = (id, e) => {
        setBatchItems(batch => batch.map(item =>
            item.id === id ? {...item, area: parseInt(e.target.value)} : item
        ))
    }

    const handlePositionChange = (id, e) => {
        setBatchItems(batch => batch.map(item =>
            item.id === id ? {...item, position: parseInt(e.target.value)} : item
        ))
    }

    const checkLimitation = (value, name) => {
        const intValue = parseInt(value, 10);
        if (Number.isInteger(intValue)) {
            return Math.max(limitation[name].min, (Math.min(limitation[name].max, intValue)));
        }
        return null
    }

    const checkValidSquare = (square, length, width) => {
        return square - (length * width) > 10
    }

    const handleRenewArea = (id) => {
        if (batchItems.find(i => i.id === id).area !== 0) {
            setBatchItems(batch => batch.map(item =>
                item.id === id ? {...item, area: 0} : item
            ))
        }
        return 0
    }

    const handleRenewPosition = (id) => {
        if (batchItems.find(i => i.id === id).position !== 0) {
            setBatchItems(batch => batch.map(item =>
                item.id === id ? {...item, position: 0} : item
            ))
        }
        return 0
    }

    const getAreaValue = (itemId, eqId) => {
        return filteredArea(itemId, eqId).length > 0 ?
            batchItems.find(i => i.id === itemId).area
            :
            handleRenewArea(itemId)
    }

    const getPositionValue = (itemId, area) => {
        if (batchItems.find(i => i.id === itemId).area === 0
            && batchItems.find(i => i.id === itemId).position !== 0
        ) {
            setBatchItems(batch => batch.map(item =>
                item.id === itemId ? {...item, position: 0} : item
            ))
            return 0
        }
        return filteredPositions(itemId, area).length > 0 ?
            batchItems.find(i => i.id === itemId).position
            :
            handleRenewPosition(itemId)
    }

    const createNewBatch = async (quantity, requestItemId, length, width, positionId) => {
        const response = await createBatch(quantity, requestItemId, length, width, positionId)
        if (response.success) {
            enqueueSnackbar(response.message, {variant: "success"});
        } else {
            enqueueSnackbar(response.message, {variant: "error"});
        }
        RefreshFunc()
    }

    console.log(batchItems)

    return (
        <Dialog
            open={modal.visible}
            onClose={CloseBatchModal}
            scroll={"paper"}
            maxWidth={"md"}
            fullWidth
        >
            <DialogTitle color={"textPrimary"}>{`Create batch (Refresh: ${refresh})`}</DialogTitle>
            <DialogContent dividers>
                <RenderInfoTextField
                    label={"Request code"}
                    data={task.requestApp.code}
                    isCapital={false}
                />
                <RenderInfoTextField
                    label={"Request date"}
                    data={task.requestApp.requestDate}
                    isCapital={false}
                />
                <RenderInfoTextField
                    label={"Delivery date"}
                    data={task.group.deliveryDate}
                    isCapital={false}
                />

                <RenderInfoTextField
                    label={"Partner"}
                    data={task.items[0].partner.name}
                    isCapital={true}
                />
                {
                    task.items.map((item, index) => (
                        <Accordion key={index} expanded={expand === index}>
                            <AccordionSummary>
                                <div style={{width: '100%'}} className={'d-flex justify-content-between'}>
                                    <Typography color="textPrimary">
                                        {(index + 1) + ". " + item.equipment + " - " + item.category}
                                    </Typography>
                                    {
                                        expand !== index &&
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => handleExpand(index)}
                                        >
                                            Create batch
                                        </Button>
                                    }

                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box>
                                    <FormControl variant="standard" fullWidth={true} sx={{m: 1}}>
                                        <TextField
                                            label={`Quantity (${limitation.quantity.min} ~ ${limitation.quantity.max} ${item.unit})`}
                                            type={"number"}
                                            variant={"standard"}
                                            name={"quantity"}
                                            value={batchItems.find(i => i.id === item.id).quantity}
                                            onChange={(e) => handleInputChange(item.id, e)}
                                            slotProps={{
                                                htmlInput: {
                                                    max: limitation.quantity.max,
                                                    min: limitation.quantity.min
                                                },
                                                inputLabel: {
                                                    shrink: true
                                                }
                                            }}
                                        />
                                    </FormControl>

                                    <FormControl variant="standard" fullWidth={true} sx={{m: 1}}>
                                        <TextField
                                            label={`Batch length (${limitation.length.min} ~ ${limitation.length.max} m\u00B2)`}
                                            type={"number"}
                                            variant={"standard"}
                                            name={"length"}
                                            value={batchItems.find(i => i.id === item.id).length}
                                            onChange={(e) => handleInputChange(item.id, e)}
                                            slotProps={{
                                                htmlInput: {
                                                    max: limitation.length.max,
                                                    min: limitation.length.min
                                                },
                                                inputLabel: {
                                                    shrink: true
                                                }
                                            }}
                                        />
                                    </FormControl>

                                    <FormControl variant="standard" fullWidth={true} sx={{m: 1}}>
                                        <TextField
                                            label={`Batch width (${limitation.width.min} ~ ${limitation.width.max} m\u00B2)`}
                                            type={"number"}
                                            variant={"standard"}
                                            name={"width"}
                                            value={batchItems.find(i => i.id === item.id).width}
                                            onChange={(e) => handleInputChange(item.id, e)}
                                            slotProps={{
                                                htmlInput: {
                                                    max: limitation.width.max,
                                                    min: limitation.width.min
                                                },
                                                inputLabel: {
                                                    shrink: true
                                                }
                                            }}
                                        />
                                    </FormControl>

                                    <FormControl variant="filled" fullWidth={true} sx={{m: 1}}>
                                        <InputLabel>Area</InputLabel>
                                        <Select
                                            label={"Area"}
                                            name={"area"}
                                            value={getAreaValue(item.id, item.eqId)}
                                            onChange={(e) => handleAreaChange(item.id, e)}
                                        >
                                            <MenuItem value={0} disabled>{"N/A"}</MenuItem>
                                            {
                                                filteredArea(item.id, item.eqId)
                                                    .map((area, index) => (
                                                        <MenuItem key={index} value={area.id}>
                                                            {area.name}
                                                        </MenuItem>
                                                    ))
                                            }

                                        </Select>
                                    </FormControl>

                                    <FormControl variant="filled" fullWidth={true} sx={{m: 1}}>
                                        <InputLabel>Position</InputLabel>
                                        <Select
                                            label={"Position"}
                                            name={"position"}
                                            disabled={batchItems.find(i => i.id === item.id).area === 0}
                                            value={getPositionValue(item.id, areas.find(area => area.id === batchItems.find(i => i.id === item.id).area))}
                                            onChange={(e) => handlePositionChange(item.id, e)}
                                        >
                                            <MenuItem value={0} disabled>{"N/A"}</MenuItem>
                                            {
                                                batchItems.find(i => i.id === item.id).area !== 0 &&
                                                filteredPositions(item.id, areas.find(area => area.id === batchItems.find(i => i.id === item.id).area))
                                                    .map((p, index) => (
                                                        <MenuItem key={index} value={p.id}>{p.name}</MenuItem>
                                                    ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            </AccordionDetails>
                            <div className={'d-flex justify-content-end me-2 mb-2'}>
                                <Button
                                    variant={"contained"}
                                    color={"success"}
                                    onClick={
                                        () => createNewBatch(
                                            batchItems.find(i => i.id === item.id).quantity,
                                            batchItems.find(i => i.id === item.id).id,
                                            batchItems.find(i => i.id === item.id).length,
                                            batchItems.find(i => i.id === item.id).width,
                                            batchItems.find(i => i.id === item.id).position)
                                    }
                                >
                                    Create
                                </Button>
                            </div>

                        </Accordion>
                    ))
                }
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
    const [areas, setAreas] = useState([])
    const [refresh, setRefresh] = useState(0)

    useEffect(() => {
        async function getTasks() {
            const taskResponse = await getAllTasks()
            const areaResponse = await getAllArea()
            if (taskResponse.success && areaResponse) {
                setTasks(taskResponse.data)
                setAreas(areaResponse.data)
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
                    areas={areas}
                    RefreshFunc={() => setAction(!action)}
                    TestFunc={() => setRefresh(refresh + 1)}
                    refresh={refresh}
                />
            }
        </>

    )
}