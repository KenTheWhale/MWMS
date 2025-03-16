// import { Modal, Button, Form } from 'react-bootstrap';
// import PropTypes from 'prop-types';
// import { useState, useEffect } from 'react';
// import {addEquipment} from "../../services/ManagerService.jsx";
// import {getCategoryList} from "../../services/ManagerService.jsx";
// import style from "../../styles/manager/Equipment.module.css"
// import Divider from '@mui/material/Divider';
// import {CardActions, CardContent, Typography, Box} from "@mui/material";
//
// const EquipmentPopup = ({ equipment, show, handleClose, actionType, onSave, onDelete }) => {
//     const [editedEquipment, setEditedEquipment] = useState({
//         id: '',
//         name: '',
//         code: '',
//         category: '',
//         unit: '',
//         price: '',
//         description: ''
//     });
//     const [errors, setErrors] = useState({});
//     const [categories, setCategories] = useState([]);
//
//     const validateForm = () => {
//         let newErrors = {};
//         if (!editedEquipment.name.trim()) newErrors.name = "Name is required";
//         if (!editedEquipment.category) newErrors.category = "Category is required";
//         if (!editedEquipment.unit || editedEquipment.unit <= 0) newErrors.unit = "Unit is required";
//         if (!editedEquipment.price) newErrors.price = "Price is required";
//         if (editedEquipment.price && editedEquipment.price <= 0) newErrors.price = "Price must be greater than 0";
//         if (!editedEquipment.code.trim()) newErrors.code = "Code is required";
//         if (!editedEquipment.description) newErrors.description = "Description date is required";
//
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };
//
//     useEffect(() => {
//         if (actionType === 'edit' && equipment) {
//             setEditedEquipment({
//                 id: equipment.id,
//                 name: equipment.name || '',
//                 category: equipment.category || '',
//                 unit: equipment.unit || '',
//                 price: equipment.price || '',
//                 description: equipment.description || '',
//                 code: equipment.code || ''
//             });
//         } else if (actionType === 'add') {
//
//             setEditedEquipment({
//                 id: null,
//                 name: '',
//                 code: '',
//                 category: '',
//                 unit: '',
//                 price: '',
//                 description: ''
//             });
//         }
//     }, [equipment, actionType]);
//
//     useEffect(() => {
//         async function fetchData() {
//             return await getCategoryList();
//         }
//         fetchData().then((data) => {
//             setCategories(data);
//         });
//     }, []);
//
//     const handleChange = (e) => {
//         setEditedEquipment({
//             ...editedEquipment,
//             [e.target.name]: e.target.value,
//         });
//     };
//
//     const handleSave = async () => {
//         try {
//             if (!validateForm()) return;
//             let updatedEquipment = editedEquipment;
//             if (actionType === 'add') {
//                 await addEquipment(
//                     editedEquipment.code,
//                     editedEquipment.name,
//                     editedEquipment.description,
//                     editedEquipment.category,
//                     editedEquipment.unit,
//                     editedEquipment.price
//                 );
//             }
//             onSave(updatedEquipment);
//             handleClose();
//         } catch (error) {
//             console.error(error);
//         }
//     };
//
//     const handleDelete = () => {
//         if (equipment && equipment.id) {
//             onDelete(equipment.id);
//             handleClose();
//         }
//     };
//
//     const renderContent = () => {
//         if (actionType === 'view' && !equipment) return null;
//
//         switch (actionType) {
//             case 'view':
//                 return (
//                     <>
//                         <p className={style.text_color}><strong>Name:</strong> {equipment.name}</p>
//                         <p className={style.text_color}><strong>Code:</strong> {equipment.code}</p>
//                         <p className={style.text_color}><strong>Category:</strong> {equipment.category}</p>
//                         <p className={style.text_color}><strong>Unit:</strong> {equipment.unit}</p>
//                         <p className={style.text_color}><strong>Price:</strong> {equipment.price}</p>
//                         <Divider />
//                         <p className={style.text_color}><strong>Description:</strong> {equipment.description}</p>
//                     </>
//                 );
//             case 'add':
//             case 'edit':
//                 return (
//                     <Form>
//                         <Form.Group className="mb-3">
//                             <Form.Label className={style.text_color}>Name</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="name"
//                                 value={editedEquipment.name}
//                                 onChange={handleChange}
//                                 isInvalid={!!errors.name}
//                             />
//                             <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
//                         </Form.Group>
//
//                         <Form.Group className="mb-3">
//                             <Form.Label className={style.text_color}>Code</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="code"
//                                 value={editedEquipment.code}
//                                 onChange={handleChange}
//                                 isInvalid={!!errors.code}
//                             />
//                             <Form.Control.Feedback type="invalid">{errors.code}</Form.Control.Feedback>
//                         </Form.Group>
//
//                         <Form.Group className="mb-3">
//                             <Form.Label className={style.text_color}>Category</Form.Label>
//                             <Form.Select
//                                 name="category"
//                                 value={editedEquipment.category}
//                                 onChange={handleChange}
//                                 isInvalid={!!errors.category}
//                             >
//                                 <option value="">Select a category</option>
//                                 {categories.map((category, index) => (
//                                     <option key={index} value={category.id}>
//                                         {category.name}
//                                     </option>
//                                 ))}
//                             </Form.Select>
//                             <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
//                         </Form.Group>
//
//                         <Form.Group className="mb-3">
//                             <Form.Label className={style.text_color}>Unit</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="unit"
//                                 value={editedEquipment.unit}
//                                 onChange={handleChange}
//                                 isInvalid={!!errors.unit}
//                             />
//                             <Form.Control.Feedback type="invalid">{errors.unit}</Form.Control.Feedback>
//                         </Form.Group>
//
//                         <Form.Group className="mb-3">
//                             <Form.Label className={style.text_color}>Price</Form.Label>
//                             <Form.Control
//                                 type="number"
//                                 name="price"
//                                 value={editedEquipment.price}
//                                 onChange={handleChange}
//                                 isInvalid={!!errors.price}
//                             />
//                             <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
//                         </Form.Group>
//
//                         <Form.Group className="mb-3">
//                             <Form.Label className={style.text_color}>Description</Form.Label>
//                             <Form.Control
//                                 as="textarea"
//                                 name="description"
//                                 value={editedEquipment.description}
//                                 onChange={handleChange}
//                                 isInvalid={!!errors.description}
//                             />
//                             <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
//                         </Form.Group>
//                     </Form>
//                 );
//
//             case 'delete':
//                 return (
//                     <>
//                         <p>Are you sure you want to delete this equipment?</p>
//                         <Button variant="secondary" onClick={handleClose}>Cancel</Button>{' '}
//                         <Button variant="danger" onClick={handleDelete}>Delete</Button>
//                     </>
//                 );
//             default:
//                 return null;
//         }
//     };
//
//     return (
//         <Modal show={show} onHide={handleClose} className={`${style.modal_index}`}>
//             <Modal.Header closeButton>
//                 <Modal.Title className={style.text_color}>{actionType === 'edit' ? 'Edit Equipment' : actionType === 'add' ? 'Add Equipment' : 'Equipment Detail'}</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 {renderContent()}
//             </Modal.Body>
//             <Modal.Footer>
//                 {(actionType === 'edit' || actionType === 'add') && (
//                     <Button variant="primary" onClick={handleSave}>
//                         {actionType === 'edit' ? 'Save Changes' : 'Add Equipment'}
//                     </Button>
//                 )}
//             </Modal.Footer>
//         </Modal>
//     );
// };
//
// EquipmentPopup.propTypes = {
//     equipment: PropTypes.object,
//     show: PropTypes.bool.isRequired,
//     handleClose: PropTypes.func.isRequired,
//     actionType: PropTypes.string.isRequired,
//     onSave: PropTypes.func.isRequired,
//     onDelete: PropTypes.func.isRequired,
// };
//
// export default EquipmentPopup;
//


import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Typography } from '@mui/material';
import { addEquipment, getCategoryList } from '../../services/ManagerService.jsx';
import style from '../../styles/manager/Equipment.module.css';

const EquipmentPopup = ({ equipment, show, handleClose, actionType, onSave, onFetch, onDelete }) => {
    const [editedEquipment, setEditedEquipment] = useState({
        id: '', name: '', code: '', category: '', unit: '', description: '', threshHold: ''
    });
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (actionType === 'edit' && equipment) {
            setEditedEquipment({ ...equipment });
        } else if (actionType === 'add') {
            setEditedEquipment({ id: '', name: '', code: '', category: '', unit: '', description: '' , threshold: ''});
        }
    }, [equipment, actionType]);

    useEffect(() => {
        async function fetchCategories() {
            const data = await getCategoryList();
            setCategories(data);
        }
        fetchCategories();
    }, []);

    const validateForm = () => {
        let newErrors = {};
        if (!editedEquipment.name.trim()) newErrors.name = 'Name is required';
        if (!editedEquipment.category) newErrors.category = 'Category is required';
        if (!editedEquipment.unit.trim()) newErrors.unit = 'Unit is required';
        if (!editedEquipment.code.trim()) newErrors.code = 'Code is required';
        if (!editedEquipment.description.trim()) newErrors.description = 'Description is required';
        if (!editedEquipment.threshHold.trim()) newErrors.threshHold = 'ThreshHold is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setEditedEquipment({ ...editedEquipment, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        console.log(editedEquipment);
        if (actionType === 'add') {
            await addEquipment(
                editedEquipment.code,
                editedEquipment.name,
                editedEquipment.description,
                editedEquipment.category,
                editedEquipment.unit,
                editedEquipment.theshHold
            );
        }
        onSave(editedEquipment);
        onFetch();
        handleClose();
    };

    const handleDelete = () => {
        if (equipment?.id) {
            onDelete(equipment.id);
            handleClose();
        }
    };

    return (
        <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
            <div className={`d-flex justify-content-center`}>
                <DialogTitle>
                    <Typography variant="h6" color={'textPrimary'}> {actionType === 'edit' ? 'Edit Equipment' : actionType === 'add' ? 'Add Equipment' : 'Equipment Detail'} </Typography>
                </DialogTitle>
            </div>
            <DialogContent>
                {actionType === 'view' && equipment && (
                    <>
                        <Typography><strong>Name:</strong> {equipment.name}</Typography>
                        <Typography><strong>Code:</strong> {equipment.code}</Typography>
                        <Typography><strong>Category:</strong> {equipment.category}</Typography>
                        <Typography><strong>Unit:</strong> {equipment.unit}</Typography>
                        <Typography><strong>Price:</strong> {equipment.price}</Typography>
                        <Typography><strong>Description:</strong> {equipment.description}</Typography>
                    </>
                )}
                {(actionType === 'edit' || actionType === 'add') && (
                    <>
                        <TextField label="Name" name="name" fullWidth margin="dense" value={editedEquipment.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} />
                        <TextField label="Code" name="code" fullWidth margin="dense" value={editedEquipment.code} onChange={handleChange} error={!!errors.code} helperText={errors.code} />
                        <TextField select label="Category" name="category" fullWidth margin="dense" value={editedEquipment.category} onChange={handleChange} error={!!errors.category} helperText={errors.category}>
                            <MenuItem value="">Select a category</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Unit" name="unit" fullWidth margin="dense" value={editedEquipment.unit} onChange={handleChange} error={!!errors.unit} helperText={errors.unit} />
                        <TextField label="Description" name="description" fullWidth multiline rows={3} margin="dense" value={editedEquipment.description} onChange={handleChange} error={!!errors.description} helperText={errors.description} />
                    </>
                )}
                {actionType === 'delete' && (
                    <Typography>Are you sure you want to delete this equipment?</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                {(actionType === 'edit' || actionType === 'add') && (
                    <Button onClick={handleSave} color="primary">{actionType === 'edit' ? 'Save' : 'Add'}</Button>
                )}
                {actionType === 'delete' && (
                    <Button onClick={handleDelete} color="error">Delete</Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

EquipmentPopup.propTypes = {
    equipment: PropTypes.object,
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    actionType: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired,
    onFetch: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default EquipmentPopup;

