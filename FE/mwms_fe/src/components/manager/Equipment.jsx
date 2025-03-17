import {useEffect, useState} from "react";
import {
    Box, Button, IconButton, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TablePagination, TableRow
} from "@mui/material";
import {DeleteForever, ModeEdit, Visibility} from "@mui/icons-material";
import EquipmentPopup from "../popup/EquipmentPopup.jsx";
import {getEquipmentList} from "../../services/ManagerService.jsx";
import {SearchBarHasSelector} from "../ui/SearchBarHasSelector.jsx";

function Equipment() {
    const [equipments, setEquipments] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchValue, setSearchValue] = useState({
        keyword: "",
        name: false,
        code: false
    });

    const searchProps = {
        mainWidth: 73.3,
        mainMarginBottom: 1,
        mainMarginTop: 1,
        height: 5,
        searchInputParams: {
            grow: 4,
            mr: 1,
            ph: 'Enter keyword to search...'
        },
        searchSelectorParams: {
            value: ['code', 'name'],
            grow: 1,
            mr: 0
        },
        searchFunc: SearchFunc
    }

    function SearchFunc(keyword, type) {
        setSearchValue({
            ...searchValue,
            keyword: keyword,
            name: type === 'name',
            code: type === 'code'
        });
    }


    const handleClose = () => {
        setShowModal(false);
        setSelectedEquipment(null);
    }

    async function FetchData() {
        const response = await getEquipmentList();
        setEquipments(response.data);
    }

    useEffect(() => {
        FetchData();
    }, [showModal]);

    const handleViewClick = (equipment) => {
        setSelectedEquipment(equipment);
        setActionType('view');
        setShowModal(true);
    };

    const handleEditClick = (equipment) => {
        setSelectedEquipment(equipment);
        setActionType('edit');
        setShowModal(true);
    };

    const handleDeleteClick = (equipment) => {
        setSelectedEquipment(equipment);
        setActionType('delete');
        setShowModal(true);
    };

    const handleAddClick = () => {
        setSelectedEquipment(null);
        setActionType('add');
        setShowModal(true);
    };

    const filteredEquipments = equipments.filter(equipment =>
        searchValue.name
            ? equipment.name.toLowerCase().includes(searchValue.keyword.toLowerCase())
            : equipment.code.toLowerCase().includes(searchValue.keyword.toLowerCase())
    ).reverse();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Box sx={{width: '100%', p: 2}}>
            <div className="d-flex justify-content-center mb-3">
                <Typography variant="h2" color="textPrimary">Equipment</Typography>
            </div>
            <div className="d-flex justify-content-center mb-3">
                <Button variant="contained" color="primary" onClick={handleAddClick}>Add Equipment</Button>
            </div>
            <SearchBarHasSelector {...searchProps} />

            <Paper sx={{width: '100%', overflow: 'hidden', mt: 2}}>
                <TableContainer sx={{maxHeight: 550}}>
                    <Table stickyHeader aria-label="equipment table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{fontWeight: 'bold'}}>No.</TableCell>
                                <TableCell align="center" sx={{fontWeight: 'bold'}}>Code</TableCell>
                                <TableCell align="center" sx={{fontWeight: 'bold'}}>Name</TableCell>
                                <TableCell align="center" sx={{fontWeight: 'bold'}}>Category</TableCell>
                                <TableCell align="center" sx={{fontWeight: 'bold'}}>Quantity</TableCell>
                                <TableCell align="center" sx={{fontWeight: 'bold'}}>Unit</TableCell>
                                <TableCell align="center" sx={{fontWeight: 'bold'}}>Status</TableCell>
                                <TableCell align="center" sx={{fontWeight: 'bold'}}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEquipments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((equipment, index) => (
                                <TableRow hover key={equipment.code}>
                                    <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell align="left">{equipment.code}</TableCell>
                                    <TableCell align="left">{equipment.name}</TableCell>
                                    <TableCell align="left">{equipment.category}</TableCell>
                                    <TableCell align="right">{equipment.quantity}</TableCell>
                                    <TableCell align="left">{equipment.unit}</TableCell>
                                    <TableCell align="left">{equipment.status}</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="warning" onClick={() => handleEditClick(equipment)}>
                                            <ModeEdit/>
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDeleteClick(equipment)}>
                                            <DeleteForever/>
                                        </IconButton>
                                        <IconButton color="primary" onClick={() => handleViewClick(equipment)}>
                                            <Visibility/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredEquipments.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <EquipmentPopup
                equipment={selectedEquipment}
                show={showModal}
                handleClose={handleClose}
                actionType={actionType}
                onFetch={FetchData}
            />
        </Box>
    );
}

export default Equipment;

