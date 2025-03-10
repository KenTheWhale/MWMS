import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import {addEquipment} from "../../services/ManagerService.jsx";
import {getCategoryList} from "../../services/ManagerService.jsx";
import style from "../../styles/manager/Equipment.module.css"
import Divider from '@mui/material/Divider';
import {CardActions, CardContent, Typography, Box} from "@mui/material";

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
        if (!editedEquipment.price) newErrors.price = "Price is required";
        if (editedEquipment.price && editedEquipment.price <= 0) newErrors.price = "Price must be greater than 0";
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
        // const bull = (
        //     <Box
        //         component="span"
        //         sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
        //     >
        //         •
        //     </Box>
        // );
        if (actionType === 'view' && !equipment) return null;

        switch (actionType) {
            case 'view':
                return (
                    <>
                        <p className={style.text_color}><strong>Name:</strong> {equipment.name}</p>
                        <p className={style.text_color}><strong>Code:</strong> {equipment.code}</p>
                        <p className={style.text_color}><strong>Category:</strong> {equipment.category}</p>
                        <p className={style.text_color}><strong>Unit:</strong> {equipment.unit}</p>
                        <p className={style.text_color}><strong>Price:</strong> {equipment.price}</p>
                        <Divider />
                        <p className={style.text_color}><strong>Description:</strong> {equipment.description}</p>
                        {/*<React.Fragment>*/}
                        {/*    <CardContent>*/}
                        {/*        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>*/}
                        {/*            Word of the Day*/}
                        {/*        </Typography>*/}
                        {/*        <Typography variant="h5" component="div">*/}
                        {/*            be{bull}nev{bull}o{bull}lent*/}
                        {/*        </Typography>*/}
                        {/*        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>*/}
                        {/*        <Typography variant="body2">*/}
                        {/*            well meaning and kindly.*/}
                        {/*            <br />*/}
                        {/*            {'"a benevolent smile"'}*/}
                        {/*        </Typography>*/}
                        {/*    </CardContent>*/}
                        {/*    <CardActions>*/}
                        {/*        <Button size="small">Learn More</Button>*/}
                        {/*    </CardActions>*/}
                        {/*</React.Fragment>*/}
                    </>
                );
            case 'add':
            case 'edit':
                return (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className={style.text_color}>Name</Form.Label>
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
                            <Form.Label className={style.text_color}>Code</Form.Label>
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
                            <Form.Label className={style.text_color}>Category</Form.Label>
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
                            <Form.Label className={style.text_color}>Unit</Form.Label>
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
                            <Form.Label className={style.text_color}>Price</Form.Label>
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
                            <Form.Label className={style.text_color}>Description</Form.Label>
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
        <Modal show={show} onHide={handleClose} className={`${style.modal_index}`}>
            <Modal.Header closeButton>
                <Modal.Title className={style.text_color}>{actionType === 'edit' ? 'Edit Equipment' : actionType === 'add' ? 'Add Equipment' : 'Equipment Detail'}</Modal.Title>
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

