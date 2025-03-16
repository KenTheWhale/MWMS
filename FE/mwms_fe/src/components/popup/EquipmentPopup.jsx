import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Typography,
    Card, CardContent, Grid
} from '@mui/material';
import {addEquipment, deleteEquipment, getCategoryList} from '../../services/ManagerService.jsx';
import {enqueueSnackbar} from "notistack";

const EquipmentPopup = ({equipment, show, handleClose, actionType, onFetch}) => {
    const [editedEquipment, setEditedEquipment] = useState({
        id: '',
        name: '',
        code: '',
        category: '',
        unit: '',
        description: ''
    });
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (actionType === 'edit' && equipment) {
            setEditedEquipment({...equipment});
        } else if (actionType === 'add') {
            setEditedEquipment({id: '', name: '', code: '', category: '', unit: '', description: ''});
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setEditedEquipment({...editedEquipment, [e.target.name]: e.target.value});
    };

    const handleAdd = async () => {
        if (!validateForm()) return;
        console.log(editedEquipment);
        if (actionType === 'add') {
            await addEquipment(
                editedEquipment.code,
                editedEquipment.name,
                editedEquipment.description,
                editedEquipment.category,
                editedEquipment.unit
            );
        }
        onFetch();
        handleClose();
    };

    const handleDelete = (code) => {
        const response = deleteEquipment(code);
        if (response.success) {
            onFetch();
            handleClose();
        }
        enqueueSnackbar(response.message, {variant: response.success ? 'success' : 'error'});
    };

    return (
        <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
            <div className={`d-flex justify-content-center`}>
                <DialogTitle component={'div'}>
                    <Typography variant="h4"
                                color={'textPrimary'}> {actionType === 'edit' ? 'Edit Equipment' : actionType === 'add' ? 'Add Equipment' : 'Equipment Detail'} </Typography>
                </DialogTitle>
            </div>
            <DialogContent>
                {actionType === 'view' && equipment && (
                    <>
                        <Card sx={{maxWidth: 500, mx: "auto", p: 3, boxShadow: 3, borderRadius: 2}}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body1" fontWeight="bold">Name:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">{equipment.name}</Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="body1" fontWeight="bold">Code:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">{equipment.code}</Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="body1" fontWeight="bold">Category:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">{equipment.category}</Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="body1" fontWeight="bold">Unit:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">{equipment.unit}</Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="body1" fontWeight="bold">Threshold:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">{equipment.threshold}</Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="body1" fontWeight="bold">Description:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">{equipment.description}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </>
                )}
                {(actionType === 'edit' || actionType === 'add') && (
                    <>
                        <TextField label="Name" name="name" fullWidth margin="dense" value={editedEquipment.name}
                                   onChange={handleChange} error={!!errors.name} helperText={errors.name}/>
                        <TextField label="Code" name="code" fullWidth margin="dense" value={editedEquipment.code}
                                   onChange={handleChange} error={!!errors.code} helperText={errors.code}/>
                        <TextField select label="Category" name="category" fullWidth margin="dense"
                                   value={editedEquipment.category} onChange={handleChange} error={!!errors.category}
                                   helperText={errors.category}>
                            <MenuItem value="">Select a category</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Unit" name="unit" fullWidth margin="dense" value={editedEquipment.unit}
                                   onChange={handleChange} error={!!errors.unit} helperText={errors.unit}/>
                        <TextField label="Description" name="description" fullWidth multiline rows={3} margin="dense"
                                   value={editedEquipment.description} onChange={handleChange}
                                   error={!!errors.description} helperText={errors.description}/>
                    </>
                )}
                {actionType === 'delete' && (
                    <Typography>Are you sure you want to delete this equipment?</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Close</Button>
                {(actionType === 'add') && (
                    <Button onClick={handleAdd} color="primary">Add</Button>
                )}
                {(actionType === 'edit') && (
                    <Button onClick={handleAdd} color="primary">Save</Button>
                )}
                {actionType === 'delete' && (
                    <Button onClick={() => handleDelete(1)} color="error">Delete</Button>
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
    onFetch: PropTypes.func.isRequired,
};

export default EquipmentPopup;

