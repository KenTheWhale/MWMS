import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const EquipmentPopup = ({ equipment, show, handleClose, actionType, onSave, onDelete }) => {
    const [editedEquipment, setEditedEquipment] = useState({
        name: '',
        category: '',
        quantity: '',
        price: '',
        description: '',
        code: '',
        expired_date: ''
    });

    const categories = [
        'Diagnostic Equipment',
        'Surgical Equipment',
        'Monitoring Equipment',
        'Anesthesia Equipment',
        'Therapeutic Equipment',
        'Rehabilitation Equipment',
        'Imaging Equipment',
        'Infusion Equipment',
        'Respiratory Equipment',
        'Laboratory Equipment',
        'Other'
    ];

    useEffect(() => {
        if (actionType === 'edit' && equipment) {
            setEditedEquipment({
                id: equipment.id,
                name: equipment.name || '',
                category: equipment.category || '',
                quantity: equipment.quantity || '',
                price: equipment.price || '',
                description: equipment.description || '',
                code: equipment.code || '',
                expired_date: equipment.expired_date || ''
            });
        } else if (actionType === 'add') {
            setEditedEquipment({
                id: null,
                name: '',
                category: '',
                quantity: '',
                price: '',
                description: '',
                code: '',
                expired_date: ''
            });
        }
    }, [equipment, actionType]);

    const handleChange = (e) => {
        setEditedEquipment({
            ...editedEquipment,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        onSave(editedEquipment);
        handleClose();
    };

    const handleDelete = () => {
        if (equipment && equipment.id) {
            onDelete(equipment.id);
            handleClose();
        }
    };

    const renderContent = () => {
        if (actionType === 'view' && !equipment) return null;

        switch (actionType) {
            case 'view':
                return (
                    <>
                        <p><strong>Category:</strong> {equipment.category}</p>
                        <p><strong>Quantity:</strong> {equipment.quantity}</p>
                        <p><strong>Price:</strong> {equipment.price}</p>
                        <p><strong>Description:</strong> {equipment.description}</p>
                        <p><strong>Code:</strong> {equipment.code}</p>
                        <p><strong>Expired Date:</strong> {new Date(equipment.expired_date).toDateString()}</p>
                    </>
                );
            case 'add':
            case 'edit':
                return (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={editedEquipment.name}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                name="category"
                                value={editedEquipment.category}
                                onChange={handleChange}
                            >
                                <option value="">Select a category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                name="quantity"
                                value={editedEquipment.quantity}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={editedEquipment.price}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={editedEquipment.description}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="code"
                                value={editedEquipment.code}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Expired Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="expired_date"
                                value={editedEquipment.expired_date}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                );

            case 'delete':
                return (
                    <>
                        <p>Are you sure you want to delete this equipment?</p>
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>{' '}
                        <Button variant="danger" onClick={handleDelete}>Delete</Button>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{actionType === 'edit' ? 'Edit Equipment' : actionType === 'add' ? 'Add Equipment' : equipment?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {renderContent()}
            </Modal.Body>
            <Modal.Footer>
                {(actionType === 'edit' || actionType === 'add') && (
                    <Button variant="primary" onClick={handleSave}>
                        {actionType === 'edit' ? 'Save Changes' : 'Add Equipment'}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

EquipmentPopup.propTypes = {
    equipment: PropTypes.object,
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    actionType: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default EquipmentPopup;

