import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import {addEquipment} from "../../services/ManagerService.jsx";
import {getCategoryList} from "../../services/ManagerService.jsx";

const EquipmentPopup = ({ equipment, show, handleClose, actionType, onSave, onDelete }) => {
    const [editedEquipment, setEditedEquipment] = useState({
        id: '',
        name: '',
        code: '',
        category: '',
        unit: '',
        price: '',
        description: ''
    });

    const [errors, setErrors] = useState({});

    // const categories = [
    //     'Diagnostic Equipment',
    //     'Surgical Equipment',
    //     'Monitoring Equipment',
    //     'Anesthesia Equipment',
    //     'Therapeutic Equipment',
    //     'Rehabilitation Equipment',
    //     'Imaging Equipment',
    //     'Infusion Equipment',
    //     'Respiratory Equipment',
    //     'Laboratory Equipment',
    //     'Other'
    // ];

    const [categories, setCategories] = useState([]);

    const validateForm = () => {
        let newErrors = {};
        if (!editedEquipment.name.trim()) newErrors.name = "Name is required";
        if (!editedEquipment.category) newErrors.category = "Category is required";
        if (!editedEquipment.unit || editedEquipment.unit <= 0) newErrors.unit = "Unit is required";
        if (!editedEquipment.price || editedEquipment.price <= 0) newErrors.price = "Price is required";
        if (!editedEquipment.code.trim()) newErrors.code = "Code is required";
        if (!editedEquipment.description) newErrors.description = "Description date is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (actionType === 'edit' && equipment) {
            setEditedEquipment({
                id: equipment.id,
                name: equipment.name || '',
                category: equipment.category || '',
                unit: equipment.unit || '',
                price: equipment.price || '',
                description: equipment.description || '',
                code: equipment.code || ''
            });
        } else if (actionType === 'add') {

            setEditedEquipment({
                id: null,
                name: '',
                code: '',
                category: '',
                unit: '',
                price: '',
                description: ''
            });
        }
    }, [equipment, actionType]);

    useEffect(() => {
        async function fetchData() {
            return await getCategoryList();
        }
        fetchData().then((data) => {
            setCategories(data);
        });
    }, []);

    const handleChange = (e) => {
        setEditedEquipment({
            ...editedEquipment,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        try {
            if (!validateForm()) return;
            let updatedEquipment = editedEquipment;
            if (actionType === 'add') {
                await addEquipment(
                    editedEquipment.code,
                    editedEquipment.name,
                    editedEquipment.description,
                    editedEquipment.category,
                    editedEquipment.unit,
                    editedEquipment.price
                );
            }
            onSave(updatedEquipment);
            handleClose();
        } catch (error) {
            console.error(error);
        }
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
                        <p><strong>Name:</strong> {equipment.name}</p>
                        <p><strong>Code:</strong> {equipment.code}</p>
                        <p><strong>Category:</strong> {equipment.category}</p>
                        <p><strong>Unit:</strong> {equipment.unit}</p>
                        <p><strong>Price:</strong> {equipment.price}</p>
                        <p><strong>Description:</strong> {equipment.description}</p>
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
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="code"
                                value={editedEquipment.code}
                                onChange={handleChange}
                                isInvalid={!!errors.code}
                            />
                            <Form.Control.Feedback type="invalid">{errors.code}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                name="category"
                                value={editedEquipment.category}
                                onChange={handleChange}
                                isInvalid={!!errors.category}
                            >
                                <option value="">Select a category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Unit</Form.Label>
                            <Form.Control
                                type="text"
                                name="unit"
                                value={editedEquipment.unit}
                                onChange={handleChange}
                                isInvalid={!!errors.unit}
                            />
                            <Form.Control.Feedback type="invalid">{errors.unit}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={editedEquipment.price}
                                onChange={handleChange}
                                isInvalid={!!errors.price}
                            />
                            <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={editedEquipment.description}
                                onChange={handleChange}
                                isInvalid={!!errors.description}
                            />
                            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
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

