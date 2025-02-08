import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const CategoryPopup = ({ category, show, handleClose, actionType, onSave, onDelete }) => {
    const [editedCategory, setEditedCategory] = useState({
        name: '',
        category: '',
        quantity: '',
        price: '',
        description: '',
        code: '',
        expired_date: ''
    });

    useEffect(() => {
        if (actionType === 'add') {
            setEditedCategory({
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
    }, [category, actionType]);

    const handleChange = (e) => {
        setEditedCategory({
            ...editedCategory,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        onSave(editedCategory);
        handleClose();
    };

    const handleDelete = () => {
        if (category && category.id) {
            onDelete(category.id);
            handleClose();
        }
    };

    const renderContent = () => {
        if (actionType === 'view' && !category) return null;

        switch (actionType) {
            case 'view':
                return (
                    <>
                        <p><strong>Name:</strong> {category.name}</p>
                        <p><strong>Code:</strong> {category.code}</p>
                        <p><strong>Description:</strong> {category.description}</p>
                    </>
                );
            case 'add':
                return (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={editedCategory.name}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="code"
                                value={editedCategory.code}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={editedCategory.description}
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
                <Modal.Title>{actionType === 'edit' ? 'Edit Equipment' : actionType === 'add' ? 'Add Equipment' : category?.name}</Modal.Title>
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

CategoryPopup.propTypes = {
    category: PropTypes.object,
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    actionType: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default CategoryPopup;

