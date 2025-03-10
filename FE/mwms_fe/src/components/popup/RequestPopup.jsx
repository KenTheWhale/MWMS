import {Button, Form, Modal, Table} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {approveRequest} from "../../services/ManagerService.jsx";
import style from '../../styles/partner/Request.module.css';
import {useState} from "react";
import Divider from "@mui/material/Divider";

const RequestPopup = ({request, show, handleClose, onAccept, onReject, setRequest}) => {
    const [deliveryDate, setDeliveryDate] = useState("");
    const [carrierName, setCarrierName] = useState("");
    const [carrierPhone, setCarrierPhone] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");
    const [errors, setErrors] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);

    const isDeliveryDisabled = request?.status !== "pending" ;

    const validateForm = () => {
        let errors = {};
        if (!deliveryDate) errors.deliveryDate = "Delivery date is required";
        if (!carrierName) errors.carrierName = "Carrier name is required";
        if (carrierPhone.length < 10) errors.carrierPhone = "Phone must be 10 number";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleAcceptClick = () => {
        setShowConfirm(true);

    };

    const handleConfirmAccept  = async () => {
        if (!validateForm()) return;
        if (!request) return;

        await approveRequest(request.code, "accepted", JSON.parse(localStorage.getItem('user')).name, {
            deliveryDate,
            carrierName,
            carrierPhone
        }, null);
        console.log(deliveryDate, carrierName, carrierPhone);
        onAccept(request.code);
        setRequest(prevRequests =>
            prevRequests.map(req =>
                req.code === request.code ? { ...req, status: "accepted" } : req
            )
        );
        handleClose();
        setShowConfirm(false);
        setDeliveryDate("");
        setCarrierName("");
        setCarrierPhone("");
        window.location.reload();
    };

    const handleRejectClick = () => {
        setShowRejectConfirm(true);
    };

    const handleConfirmReject = async () => {
        if (!request || !rejectionReason.trim()) return;
        await approveRequest(request.code, "rejected", JSON.parse(localStorage.getItem('user')).name, {
            deliveryDate,
            carrierName,
            carrierPhone
        }, rejectionReason);
        onReject(request.code);
        setRequest(prevRequests =>
            prevRequests.map(req =>
                req.code === request.code ? { ...req, status: "rejected" } : req
            )
        );
        handleClose();
        setShowRejectConfirm(false);
        setRejectionReason("");
        window.location.reload();
    };



    return (
        <Modal show={show} onHide={handleClose} size="lg" className={`${style.modal_index}`}>
            <Modal.Header closeButton>
                <div className={`${style.title_area}`}>
                        <Modal.Title className={`${style.text_color}`}>Approve Request</Modal.Title>
                        {request?.status === "rejected" && (
                            <p className={`${style.rejected_status}`}>Rejected because {request.rejectionReason}</p>
                        )}
                </div>
            </Modal.Header>
            <Modal.Body>
                {request ? (
                    <>
                        <p><strong>Request Code:</strong> {request.code}</p>
                        <p><strong>Request Date:</strong> {request.requestDate}</p>
                        <p><strong>Last Modified:</strong> {request.lastModifiedDate}</p>

                        <h5 className={`${style.title_area}`}>Request List</h5>
                        <div className={style.popup_table_area}>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Equipment Name</th>
                                    <th>Quantity</th>
                                </tr>
                                </thead>
                                <tbody>
                                {request.requestItems && request.requestItems.length > 0 ? (
                                    request.requestItems.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.equipmentName}</td>
                                            <td>{item.quantity}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">No items found</td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                        </div>
                        <Divider/>
                        <h5 className={`${style.title_area}`}>Delivery Information</h5>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Delivery Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={request.deliveryDate === "" ? deliveryDate : request.deliveryDate}
                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                    isInvalid={errors.deliveryDate}
                                    disabled={isDeliveryDisabled}
                                    min={new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0]}
                                />
                                <Form.Control.Feedback type="invalid">{errors.deliveryDate}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Carrier Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter carrier name"
                                    value={request.carrierName === "" ? carrierName : request.carrierName}
                                    onChange={(e) => setCarrierName(e.target.value)}
                                    isInvalid={errors.carrierName}
                                    disabled={isDeliveryDisabled}
                                />
                                <Form.Control.Feedback type="invalid">{errors.carrierName}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Carrier Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter carrier phone"
                                    value={request.carrierPhone === "" ? carrierPhone : request.carrierPhone}
                                    onChange={(e) => {
                                        const newValue = e.target.value.replace(/\D/g, "");
                                        if (newValue.length === 10) {
                                            setCarrierPhone(newValue);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (
                                            !/\d/.test(e.key) &&
                                            e.key !== "Backspace" &&
                                            e.key !== "Delete" &&
                                            e.key !== "ArrowLeft" &&
                                            e.key !== "ArrowRight"
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    minLength={10}
                                    maxLength={10}
                                    isInvalid={errors.carrierPhone}
                                    disabled={isDeliveryDisabled}
                                />
                                <Form.Control.Feedback type="invalid">{errors.carrierPhone}</Form.Control.Feedback>
                            </Form.Group>

                        </Form>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleAcceptClick} disabled={isDeliveryDisabled}>
                    Accept
                </Button>
                <Button variant="danger" onClick={handleRejectClick} disabled={isDeliveryDisabled}>
                    Reject
                </Button>
            </Modal.Footer>
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} className={`${style.confirm_index}`}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Action</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Double check the information. You cannot modify the request. Confirm?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleConfirmAccept}>Confirm</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showRejectConfirm} onHide={() => setShowRejectConfirm(false)} className={`${style.confirm_index}`}>
                <Modal.Header closeButton>
                    <Modal.Title>Reject Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Rejection Reason</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter rejection reason"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRejectConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleConfirmReject} disabled={!rejectionReason.trim()}>Reject</Button>
                </Modal.Footer>
            </Modal>
        </Modal>
    );
};

RequestPopup.propTypes = {
    request: PropTypes.object,
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onAccept: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
};

export default RequestPopup;

