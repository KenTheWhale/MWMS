import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useState } from 'react';

const RequestPopup = ({ request, show, handleClose, onAccept, onReject }) => {
    // const [editedRequest, setEditedRequest] = useState({
    //     id: '',
    //     name: '',
    //     code: '',
    //     category: '',
    //     unit: '',
    //     price: '',
    //     description: ''
    // });
    //
    // const handleChange = (e) => {
    //     setEditedRequest({
    //         ...editedRequest,
    //         [e.target.name]: e.target.value,
    //     });
    // };
    //
    // const handleSave = async () => {
    //
    // };
    //
    // const handleDelete = () => {
    //     if (request && request.id) {
    //         onReject(request.id);
    //         handleClose();
    //     }
    // };
    //
    // const renderContent = () => {
    //     if (actionType === 'view' && !request) return null;
    //             return (
    //                 <>
    //                     <p><strong>Name:</strong> {request.code}</p>
    //                     <p><strong>Category:</strong> {request.requestDate}</p>
    //                     <p><strong>Unit:</strong> {request.lastModifiedDate}</p>
    //                     <p><strong>Price:</strong> {request.status}</p>
    //                 </>
    //             );
    // };
    //
    // return (
    //     <Modal show={show} onHide={handleClose}>
    //         <Modal.Header closeButton>
    //             <Modal.Title>Approve Request</Modal.Title>
    //         </Modal.Header>
    //         <Modal.Body>
    //             {renderContent()}
    //         </Modal.Body>
    //         <Modal.Footer>
    //                 <Button variant="primary">
    //                     Accept
    //                 </Button>
    //             <Button variant="primary">
    //                     Reject
    //                 </Button>
    //         </Modal.Footer>
    //     </Modal>
    // );
};

RequestPopup.propTypes = {
    request: PropTypes.object,
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onAccept: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
};

export default RequestPopup;

