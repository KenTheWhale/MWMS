import {Button, Form, Modal, Table} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {approveRequest} from "../../services/ManagerService.jsx";
import {FaCheck} from "react-icons/fa";
import {FaX} from "react-icons/fa6";
import style from '../../styles/partner/Request.module.css';
import {useState} from "react";
import {colors} from "@mui/material";


const RequestPopup = ({request, show, handleClose, onAccept, onReject, setRequest}) => {
    const [deliveryDate, setDeliveryDate] = useState("");
    const [carrierName, setCarrierName] = useState("");
    const [carrierPhone, setCarrierPhone] = useState("");
    const [errors, setErrors] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    const isDeliveryDisabled = request?.status === "accepted" || request?.status === "rejected" || request?.status === "canceled";

    const validateForm = () => {
        let errors = {};
        if (!deliveryDate) errors.deliveryDate = "Delivery date is required";
        if (!carrierName) errors.carrierName = "Carrier name is required";
        if (!carrierPhone) errors.carrierPhone = "Carrier phone is required";

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
        });
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
    };

    const handleReject = async () => {
        if (!request) return;
        await approveRequest(request.code, "rejected", JSON.parse(localStorage.getItem('user')).name, {
            deliveryDate,
            carrierName,
            carrierPhone
        });
        onReject(request.code);
        setRequest(prevRequests =>
            prevRequests.map(req =>
                req.code === request.code ? { ...req, status: "rejected" } : req
            )
        );
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" className={`${style.modal_index}`}>
            <Modal.Header closeButton>
                <div className={`${style.title_area}`}>
                    <Modal.Title className={`${style.text_color}`}>Approve Request</Modal.Title>
                </div>
            </Modal.Header>
            <Modal.Body>
                {request ? (
                    <>
                        <p><strong>Request Code:</strong> {request.code}</p>
                        <p><strong>Request Date:</strong> {request.requestDate}</p>
                        <p><strong>Last Modified:</strong> {request.lastModifiedDate}</p>

                        <h5>Request Detail:</h5>
                        <div className={style.popup_table_area}>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Equipment Name</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Length(cm)</th>
                                    <th>Width(cm)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {request.requestItems && request.requestItems.length > 0 ? (
                                    request.requestItems.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.equipmentName}</td>
                                            <td>{item.quantity}</td>
                                            <td>${item.unitPrice}</td>
                                            <td>{item.length}</td>
                                            <td>{item.width}</td>
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
                        <h5>Delivery Information</h5>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Delivery Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={deliveryDate}
                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                    isInvalid={errors.deliveryDate}
                                    disabled={isDeliveryDisabled}
                                />
                                <Form.Control.Feedback type="invalid">{errors.deliveryDate}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Carrier Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter carrier name"
                                    value={carrierName}
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
                                    value={carrierPhone}
                                    onChange={(e) => setCarrierPhone(e.target.value)}
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
                    <FaCheck/>
                </Button>
                <Button variant="danger" onClick={handleReject} disabled={isDeliveryDisabled}>
                    <FaX/>
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

