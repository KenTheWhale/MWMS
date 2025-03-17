import {useState} from "react";
import PropTypes from "prop-types";
import {
    Card,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography, TextareaAutosize, Divider, CardContent
} from "@mui/material";
import {approveRequest} from "../../services/ManagerService.jsx";


const RequestPopup = ({request, show, handleClose, onFetch}) => {
    const [deliveryDate, setDeliveryDate] = useState("");
    const [carrierName, setCarrierName] = useState("");
    const [carrierPhone, setCarrierPhone] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");
    const [errors, setErrors] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);

    const isDeliveryDisabled = request?.status !== "pending";

    const validateForm = () => {
        let errors = {};
        if (!deliveryDate) errors.deliveryDate = "Delivery date is required";
        if (!carrierName) errors.carrierName = "Carrier name is required";
        if (carrierPhone.length < 10) errors.carrierPhone = "Phone must be 10 digits";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleConfirmAccept = async () => {
        if (!validateForm() || !request){
            setShowConfirm(false);
            return;
        }
        await approveRequest(request.code, "accepted", JSON.parse(localStorage.getItem("user")).name, {
            deliveryDate,
            carrierName,
            carrierPhone
        }, null);
        setShowConfirm(false);
        handleClose();
        onFetch();
    };

    const handleConfirmReject = async () => {
        if (!request || !rejectionReason.trim()) return;
        await approveRequest(request.code, "rejected", JSON.parse(localStorage.getItem("user")).name, {
            deliveryDate,
            carrierName,
            carrierPhone
        }, rejectionReason);
        setShowRejectConfirm(false);
        handleClose();
        onFetch();
    };

    return (
        <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle component={'div'} className={`d-flex justify-content-center mb-3 mt-3`}>
                <Typography variant={'h4'} color={'textPrimary'}>Approve Request</Typography>
            </DialogTitle>
            <DialogContent>
                {request ? (
                    <>
                        <Card sx={{ maxWidth: 400, mx: "auto", boxShadow: 3, borderRadius: 2 }}>
                            <CardContent>
                                <div className={`d-flex justify-content-center`}>
                                    <Typography variant="h6" color="primary" gutterBottom>
                                        Request Details
                                    </Typography>
                                </div>
                                <Divider sx={{mb: 2}}/>
                                <   Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Typography variant="body1" fontWeight="bold">Request Code:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">{request.code}</Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="body1" fontWeight="bold">Request Date:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">{request.requestDate}</Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="body1" fontWeight="bold">Last Modified:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">{request.lastModifiedDate}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <div className={`d-flex justify-content-center`}>
                            <Typography variant="h5" color={'textPrimary'} className="mb-3 mt-3">Request
                                List</Typography>
                        </div>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Equipment Name</TableCell>
                                        <TableCell>Quantity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {request.requestItems?.length > 0 ? (
                                        request.requestItems.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item.equipmentName}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">No items found</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>


                        <div className={`d-flex justify-content-center`}>
                            <Typography variant="h6" color={'textPrimary'} className={`mb-3 mt-3`}>Delivery Information</Typography>
                        </div>
                        <TextField label="Delivery Date" type="date" fullWidth margin="normal"
                                   InputLabelProps={{shrink: true}}
                                   value={!request.deliveryDate ? deliveryDate : request.deliveryDate} onChange={e => setDeliveryDate(e.target.value)}
                                   error={!!errors.deliveryDate} helperText={errors.deliveryDate}
                                   disabled={isDeliveryDisabled}/>
                        <TextField label="Carrier Name" fullWidth margin="normal" value={!request.carrierName ? carrierName : request.carrierName}
                                   onChange={e => setCarrierName(e.target.value)} error={!!errors.carrierName}
                                   helperText={errors.carrierName} disabled={isDeliveryDisabled}/>
                        <TextField label="Carrier Phone" fullWidth margin="normal" value={!request.carrierPhone ? carrierPhone : request.carrierPhone} type="text"
                                   onChange={e => setCarrierPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                   error={!!errors.carrierPhone} helperText={errors.carrierPhone}
                                   disabled={isDeliveryDisabled}/>
                    </>
                ) : (
                    <Typography>Loading...</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShowConfirm(true)} disabled={isDeliveryDisabled} variant="contained"
                        color="success">Accept</Button>
                <Button onClick={() => setShowRejectConfirm(true)} disabled={isDeliveryDisabled} variant="contained"
                        color="error">Reject</Button>
            </DialogActions>

            <Dialog open={showConfirm} onClose={() => setShowConfirm(false)}>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogContent>
                    <Typography>Double check the information. You cannot modify the request. Confirm?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button onClick={handleConfirmAccept} variant="contained" color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>

            <Dialog sx={{ "& .MuiDialog-paper": { width: "500px" } }} open={showRejectConfirm} onClose={() => setShowRejectConfirm(false)}>
                <DialogTitle className="d-flex justify-content-center mb-3 mt-3">
                    <Typography variant="h5" color="textPrimary">
                        Rejection Reason <span style={{ color: "red" }}>*</span>
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <TextareaAutosize placeholder="Enter your reason" style={{ width: "100%" }} minRows={5} label="Rejection Reason" multiline rows={3} fullWidth value={rejectionReason}
                               onChange={e => setRejectionReason(e.target.value)}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowRejectConfirm(false)}>Cancel</Button>
                    <Button onClick={handleConfirmReject} variant="contained" color="error"
                            disabled={!rejectionReason.trim()}>Reject</Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

RequestPopup.propTypes = {
    request: PropTypes.object,
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onFetch: PropTypes.func.isRequired,
};

export default RequestPopup;