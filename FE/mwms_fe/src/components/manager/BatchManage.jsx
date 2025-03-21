import {
    Accordion, AccordionDetails, AccordionSummary,
    Box,
    Dialog, DialogContent,
    DialogTitle, FormControl,
    IconButton, Input, InputLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {getAllBatches} from "../../services/ManagerService.jsx";
import {ArrowDropDown, Info} from "@mui/icons-material";

/* eslint-disable react/prop-types*/
function RenderTable({batches, setCurrentBatch}) {

    return (
        <>
            <div className={'d-flex justify-content-center align-items-center'}>
                <Typography variant="h3" color="textPrimary">Batch</Typography>
            </div>
            <Paper sx={{width: '100%', overflow: 'hidden'}}>

                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align={"center"}>{"No"}</TableCell>
                            <TableCell align={"center"}>{"Code"}</TableCell>
                            <TableCell align={"center"}>{"Stored date"}</TableCell>
                            <TableCell align={"center"}>{"Size (m\u00B2)"}</TableCell>
                            <TableCell align={"center"}>{"Equipment quantity"}</TableCell>
                            <TableCell align={"center"}>{"Stored location"}</TableCell>
                            <TableCell align={"center"}>{"Detail"}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            batches.sort((b1, b2) => b2.id - b1.id).map((batch, index) => (
                                <TableRow key={index}>
                                    <TableCell align={"center"}>{index + 1}</TableCell>
                                    <TableCell align={"center"}>{batch.code}</TableCell>
                                    <TableCell align={"center"}>{batch.createdDate}</TableCell>
                                    <TableCell align={"center"}>{batch.length * batch.width}</TableCell>
                                    <TableCell align={"center"}>{batch.qty}</TableCell>
                                    <TableCell
                                        align={"center"}>{batch.location.areaName + " - " + batch.location.positionName}</TableCell>
                                    <TableCell align={"center"}>
                                        <IconButton onClick={() => setCurrentBatch(batch)}>
                                            <Info color={"info"}/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Paper>
        </>
    )
}

function RenderDetailModal({batch, closeModal}) {

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

    return (
        <Dialog
            open={batch !== null}
            onClose={closeModal}
            scroll={"paper"}
            maxWidth={"md"}
            fullWidth
        >
            <DialogTitle color={"textPrimary"}>{`Batch detail`}</DialogTitle>
            <DialogContent dividers>
                <Box>
                    {/*Code*/}
                    <RenderInfoTextField
                        label={"Code"}
                        data={batch.code}
                        isCapital={false}
                    />

                    {/*Stored data*/}
                    <RenderInfoTextField
                        label={"Stored date"}
                        data={batch.createdDate}
                        isCapital={false}
                    />

                    {/*Size*/}
                    <RenderInfoTextField
                        label={"Size (m\u00B2)"}
                        data={batch.length * batch.width}
                        isCapital={false}
                    />

                    {/*Partner*/}
                    <RenderInfoTextField
                        label={"Supplier"}
                        data={batch.request.partner}
                        isCapital={true}
                    />

                    <Accordion>
                        <AccordionSummary expandIcon={<ArrowDropDown/>}>
                            <Typography variant="body1" color="textPrimary">
                                Equipment
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {/*Eq Code*/}
                            <RenderInfoTextField
                                label={"Code"}
                                data={batch.request.equipment.code}
                                isCapital={false}
                            />

                            {/*Eq Name*/}
                            <RenderInfoTextField
                                label={"Name"}
                                data={batch.request.equipment.name}
                                isCapital={true}
                            />

                            {/*Eq qty*/}
                            <RenderInfoTextField
                                label={`Quantity (${batch.request.equipment.unit})`}
                                data={batch.qty}
                                isCapital={false}
                            />

                            {/*Eq des*/}
                            <RenderInfoTextField
                                label={"Description"}
                                data={batch.request.equipment.description}
                                isCapital={true}
                            />

                            {/*Eq Cate*/}
                            <RenderInfoTextField
                                label={"Category"}
                                data={batch.request.equipment.category}
                                isCapital={true}
                            />

                            <Accordion>
                                <AccordionSummary expandIcon={<ArrowDropDown/>}>
                                    <Typography variant="body1" color="textPrimary">
                                        Stored list
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {
                                        batch.items.map((item, index) => (
                                            //Serial number
                                            <div key={index}>
                                                <RenderInfoTextField
                                                    label={"Code"}
                                                    data={item.serial}
                                                    isCapital={false}
                                                />
                                            </div>
                                        ))
                                    }

                                </AccordionDetails>
                            </Accordion>

                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<ArrowDropDown/>}>
                            <Typography variant="body1" color="textPrimary">
                                Stored location
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {/*Area*/}
                            <RenderInfoTextField
                                label={"Area"}
                                data={batch.location.areaName}
                                isCapital={true}
                            />

                            {/*Position*/}
                            <RenderInfoTextField
                                label={"Detail position"}
                                data={batch.location.positionName}
                                isCapital={true}
                            />
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<ArrowDropDown/>}>
                            <Typography variant="body1" color="textPrimary">
                                Request
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>

                            {/*Request code*/}
                            <RenderInfoTextField
                                label={"Code"}
                                data={batch.request.group.request.code}
                                isCapital={true}
                            />

                            {/*Request data*/}
                            <RenderInfoTextField
                                label={"Requested date"}
                                data={batch.request.group.request.requestDate}
                                isCapital={true}
                            />

                            {/*Carrier name*/}
                            <RenderInfoTextField
                                label={"Carrier name"}
                                data={batch.request.group.cName}
                                isCapital={true}
                            />

                            {/*Carrier phone*/}
                            <RenderInfoTextField
                                label={"Carrier name"}
                                data={batch.request.group.cPhone}
                                isCapital={false}
                            />


                        </AccordionDetails>
                    </Accordion>
                </Box>
            </DialogContent>

        </Dialog>
    )
}

export function BatchManage() {
    const [batches, setBatches] = useState([]);
    const [currentBatch, setCurrentBatch] = useState(null)

    useEffect(() => {
        async function fetchBatches() {
            return await getAllBatches()
        }

        fetchBatches().then(res => setBatches(res.data));
    }, [])

    const handleGetCurrentBatch = (batch) => {
        setCurrentBatch(batch)
    }

    return (
        <>
            <RenderTable batches={batches} setCurrentBatch={handleGetCurrentBatch}/>
            {
                currentBatch !== null &&
                <RenderDetailModal batch={currentBatch} closeModal={() => setCurrentBatch(null)}/>
            }
        </>
    )
}