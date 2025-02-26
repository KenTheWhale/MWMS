import {Modal, Button, Form} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {useState, useEffect} from 'react';

const CategoryPopup = ({category, show, handleClose, actionType, onSave, onDelete}) => {
    const [editedCategory, setEditedCategory] = useState({
        name: '',
        code: '',
        description: ''
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let newErrors = {};
        if (!editedCategory.name.trim()) newErrors.name = "Name is required";
        if (!editedCategory.code) newErrors.code = "Category is required";
        if (!editedCategory.description.trim()) newErrors.description = "Description is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (actionType === 'edit' && category) {
            setEditedCategory({
                id: category.id,
                name: category.name || '',
                code: category.code || '',
                description: category.description || ''
            });
        } else if (actionType === 'add') {
            setEditedCategory({
                id: null,
                name: '',
                code: '',
                description: ''
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
        if (!validateForm()) return;
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
            case 'edit':
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
                                isInvalid={errors.name}
                            />
                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="code"
                                value={editedCategory.code}
                                onChange={handleChange}
                                isInvalid={errors.code}
                            />
                            <Form.Control.Feedback type="invalid">{errors.code}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={editedCategory.description}
                                onChange={handleChange}
                                isInvalid={errors.description}
                            />
                            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                );

            case 'delete':
                return (
                    <>
                        <p>Are you sure you want to delete this category?</p>
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
                <Modal.Title>{actionType === 'edit' ? 'Edit Category' : actionType === 'add' ? 'Add Category' : category?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {renderContent()}
            </Modal.Body>
            <Modal.Footer>
                {(actionType === 'edit' || actionType === 'add') && (
                    <Button variant="primary" onClick={handleSave}>
                        {actionType === 'edit' ? 'Save Changes' : 'Add category'}
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

