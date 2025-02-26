import {Modal, Button, Form} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {useState} from 'react';

const RequestPopup = ({request, show, handleClose, onAccept, onReject}) => {

    // const handleChange = (e) => {
    //
    // };
    //
    // const handleSave = async () => {
    //     onAccept(request.id);
    //     handleClose();
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
    //
    //     return (
    //         <>
    //             <p><strong>Name:</strong> {request.code}</p>
    //             <p><strong>Category:</strong> {request.requestDate}</p>
    //             <p><strong>Unit:</strong> {request.lastModifiedDate}</p>
    //             <p><strong>Price:</strong> {request.status}</p>
    //         </>
    //     )
    // };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Approve Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/*{renderContent()}*/}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" >
                    Accept
                </Button>
                <Button variant="primary">
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

