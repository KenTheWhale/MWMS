import {Table, Modal, Button, Form} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {approveRequest} from "../../services/RequestService.js";


const RequestPopup = ({ request, show, handleClose, onAccept, onReject }) => {

    const handleAccept = async () => {
        if (!request) return;
        const result = await approveRequest(request.code, "accepted");
        if (result) {
            onAccept(request.code);
            handleClose();
        }
    };

    const handleReject = async () => {
        if (!request) return;
        const result = await approveRequest(request.code, "rejected");
        if (result) {
            onReject(request.code);
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Approve Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {request ? (
                    <>
                        <p><strong>Request Code:</strong> {request.code}</p>
                        <p><strong>Request Date:</strong> {request.requestDate}</p>
                        <p><strong>Last Modified:</strong> {request.lastModifiedDate}</p>

                        <h5>Request Items:</h5>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Equipment Name</th>
                                <th>Supplier</th>
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
                                        <td>{item.partnerName}</td>
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
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleAccept}>
                    Accept
                </Button>
                <Button variant="danger" onClick={handleReject}>
                    Reject
                </Button>
            </Modal.Footer>
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

