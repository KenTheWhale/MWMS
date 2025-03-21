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
import {addEquipment, deleteEquipment, getCategoryList, updateEquipment} from '../../services/ManagerService.jsx';
import {enqueueSnackbar} from "notistack";

const EquipmentPopup = ({equipment, show, handleClose, actionType, onFetch, isDisabled}) => {
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
            const matchedCategory = categories.find(cate => cate.name === equipment.category);
            setEditedEquipment({
                ...equipment,
                category: matchedCategory ? matchedCategory.id : ''
            });
        } else if (actionType === 'add') {
            setEditedEquipment({id: '', name: '', code: '', category: '', unit: '', description: ''});
        } else if (actionType === 'delete') {
            setEditedEquipment({...equipment});
        }
    }, [equipment, actionType, categories]);

    useEffect(() => {
        async function FetchCategories() {
            const response = await getCategoryList();
            setCategories(response.data);
        }

        FetchCategories();
    }, []);

    const validateForm = () => {
        let newErrors = {};
        if (!editedEquipment.name.trim()) newErrors.name = 'Name is required';
        if (!editedEquipment.category) newErrors.category = 'Category is required';
        if (!editedEquipment.unit.trim()) newErrors.unit = 'Unit is required';
        if (!editedEquipment.description.trim()) newErrors.description = 'Description is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const {name, value} = e.target;

        if (name === "category") {
            setEditedEquipment({
                ...editedEquipment,
                category: value
            });
        } else {
            setEditedEquipment({
                ...editedEquipment,
                [name]: value
            });
        }
    };

    const handleAdd = async () => {
        if (!validateForm()) return;
        if (actionType === 'add') {
            const response = await addEquipment(
                editedEquipment.code,
                editedEquipment.name,
                editedEquipment.description,
                editedEquipment.category,
                editedEquipment.unit
            );
            enqueueSnackbar(response.message, {variant: response.success ? 'success' : 'error'});
            if (response.success) {
                onFetch();
                handleClose();
            }
        }
    };

    const handleUpdate = async () => {
        if (!validateForm()) return;
        const response = await updateEquipment(
            editedEquipment.code,
            editedEquipment.name,
            editedEquipment.description,
            editedEquipment.category,
            editedEquipment.unit
        );
        enqueueSnackbar(response.message, {variant: response.success ? 'success' : 'error'});
        if (response.success) {
            onFetch();
            handleClose();
        }
    }

    const handleDelete = async () => {
        const response = await deleteEquipment(editedEquipment.code);
        if (response.success) {
            enqueueSnackbar(response.message, {variant: response.success ? 'success' : 'error'});
        }
        onFetch();
        handleClose();
    };

    return (
        <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
            <div className={`d-flex justify-content-center`}>
                <DialogTitle component={'div'}>
                    <Typography variant="h4"
                                color={'textPrimary'}> {actionType === 'edit' ? 'Edit Equipment' : actionType === 'add' ? 'Add Equipment' : actionType === 'delete' ? 'Warning' : 'Equipment Detail'} </Typography>
                </DialogTitle>
            </div>
            <DialogContent>
                {actionType === 'view' && equipment && (
                    <>
                        <Card sx={{maxWidth: 500, mx: "auto", p: 3, boxShadow: 3, borderRadius: 2}}>
                            <CardContent>
                                <Grid container spacing={2} rowSpacing={1}>
                                    <Grid xs={6}>
                                        <Typography variant="body1" fontWeight="bold">Code:</Typography>
                                    </Grid>
                                    <Grid xs={6}>
                                        <Typography variant="body1">{equipment.code}</Typography>
                                    </Grid>

                                    <Grid xs={6}>
                                        <Typography variant="body1" fontWeight="bold">Name:</Typography>
                                    </Grid>
                                    <Grid xs={6}>
                                        <Typography variant="body1">{equipment.name}</Typography>
                                    </Grid>

                                    <Grid xs={6}>
                                        <Typography variant="body1" fontWeight="bold">Category:</Typography>
                                    </Grid>
                                    <Grid xs={6}>
                                        <Typography variant="body1">{equipment.category}</Typography>
                                    </Grid>

                                    <Grid xs={6}>
                                        <Typography variant="body1" fontWeight="bold">Unit:</Typography>
                                    </Grid>
                                    <Grid xs={6}>
                                        <Typography variant="body1">{equipment.unit}</Typography>
                                    </Grid>

                                    <Grid xs={6}>
                                        <Typography variant="body1" fontWeight="bold">Description:</Typography>
                                    </Grid>
                                    <Grid xs={6}>
                                        <Typography variant="body1">{equipment.description}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </>
                )}
                {(actionType === 'edit' || actionType === 'add') && (
                    <>
                        <TextField label="Code" name="code" fullWidth margin="dense" value={editedEquipment.code} onChange={handleChange} disabled={isDisabled}/>
                        <TextField label="Name" name="name" fullWidth margin="dense" value={editedEquipment.name}
                                   onChange={handleChange} error={!!errors.name} helperText={errors.name}/>
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
                    <Button onClick={handleUpdate} color="primary">Save</Button>
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
    onFetch: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool.isRequired
};

export default EquipmentPopup;

