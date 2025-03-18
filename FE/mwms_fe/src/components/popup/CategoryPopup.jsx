import PropTypes from 'prop-types';
import {useState, useEffect} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography, CardContent, Grid, Card
} from '@mui/material';
import {enqueueSnackbar} from "notistack";
import {addCategory, deleteCategory, updateCategory} from "../../services/ManagerService.jsx";

const CategoryPopup = ({category, show, handleClose, actionType, onFetch, isDisabled}) => {
    const [editedCategory, setEditedCategory] = useState({
        code: '',
        name: '',
        description: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let newErrors = {};
        if (!editedCategory.name.trim()) newErrors.name = "Name is required";
        if (!editedCategory.code) newErrors.code = "Category code is required";
        if (!editedCategory.description.trim()) newErrors.description = "Description is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (actionType === 'edit' && category) {
            setEditedCategory({
                id: category.id,
                code: category.code || '',
                name: category.name || '',
                description: category.description || ''
            });
        } else if (actionType === 'add') {
            setEditedCategory({id: null, code: '', name: '', description: ''});
        } else if (actionType === 'delete') {
            setEditedCategory({...category});
        }
    }, [category, actionType]);

    const handleChange = (e) => {
        setEditedCategory({
            ...editedCategory,
            [e.target.name]: e.target.value,
        });
    };

    const handleAdd = async () => {
        if (!validateForm()) return;
        if (actionType === 'add') {
            const response = await addCategory(
                editedCategory.code,
                editedCategory.name,
                editedCategory.description
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
        const response = await updateCategory(
            editedCategory.code,
            editedCategory.name,
            editedCategory.description
        );
        enqueueSnackbar(response.message, {variant: response.success ? 'success' : 'error'});
        if (response.success) {
            onFetch();
            handleClose();
        }
    }

    const handleDelete = async () => {
        const response = await deleteCategory(editedCategory.code);
        enqueueSnackbar(response.message, {variant: response.success ? 'success' : 'error'});
        if (response.success) {
            onFetch();
            handleClose();
        }
    };

    return (
        <Dialog open={show} onClose={handleClose} fullWidth>
            <div className={`d-flex justify-content-center`}>
                <DialogTitle component={'div'}>
                    <Typography variant="h4" color={'textPrimary'}>
                        {actionType === 'edit' ? 'Edit Category' : actionType === 'add'
                            ? 'Add Category' : actionType === 'delete'
                                ? 'Warning' : 'Category Detail'}
                    </Typography>
                </DialogTitle>
            </div>
            <DialogContent>
                {actionType === 'view' && category && (
                    <>
                        <Card sx={{maxWidth: 500, mx: "auto", p: 3, boxShadow: 3, borderRadius: 2}}>
                            <CardContent>
                                <Grid container spacing={2} rowSpacing={1}>
                                    <Grid item xs={6}>
                                        <Typography variant="body1" fontWeight="bold">Code:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">{category.code}</Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="body1" fontWeight="bold">Name:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">{category.name}</Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="body1" fontWeight="bold">Description:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">{category.description}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </>
                )}
                {(actionType === 'edit' || actionType === 'add') && (
                    <>
                        <TextField label="Code" name="code" fullWidth margin="dense" value={editedCategory.code}
                                   onChange={handleChange} disabled={isDisabled}/>
                        <TextField label="Name" name="name" fullWidth margin="dense" value={editedCategory.name}
                                   onChange={handleChange} error={!!errors.name} helperText={errors.name}/>
                        <TextField label="Description" name="description" fullWidth multiline rows={3} margin="dense"
                                   value={editedCategory.description} onChange={handleChange}
                                   error={!!errors.description} helperText={errors.description}/>
                    </>
                )}
                {actionType === 'delete' && (
                    <Typography>Are you sure you want to delete this category?</Typography>
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

CategoryPopup.propTypes = {
    category: PropTypes.object,
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    actionType: PropTypes.string.isRequired,
    onFetch: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool
};

export default CategoryPopup;

