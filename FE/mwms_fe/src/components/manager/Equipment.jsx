import {useEffect, useState} from "react";
import {Box, Button, IconButton, Typography} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import EquipmentPopup from "../popup/EquipmentPopup.jsx";
import {getEquipmentList} from "../../services/ManagerService.jsx";
import {SearchBarHasSelector} from "../ui/SearchBarHasSelector.jsx";
import {DeleteForever, ModeEdit, Visibility} from "@mui/icons-material";

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
        })
    }

    async function FetchData() {
        const response = await getEquipmentList();
        setEquipments(response.data);
    }

    useEffect(() => {
        FetchData();
    }, []);

    const handleViewClick = (equipment) => {
        setSelectedEquipment(equipment);
        setActionType('view');
        setShowModal(true);
    }

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
    );

    const columns = [
        { field: 'index', headerName: 'No.', width: 80, headerAlign: 'center', align: 'center'},
        { field: 'code', headerName: 'Code', width: 300, headerAlign: 'center', align: 'left' },
        { field: 'name', headerName: 'Name', width: 270, headerAlign: 'center', align: 'left' },
        { field: 'category', headerName: 'Category', width: 200, headerAlign: 'center', align: 'left' },
        { field: 'quantity', headerName: 'Quantity', width: 130, headerAlign: 'center', align: 'right' },
        { field: 'unit', headerName: 'Unit', width: 130, headerAlign: 'center', align: 'left' },
        { field: 'status', headerName: 'Status', width: 130, headerAlign: 'center', align: 'left' },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 190,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <>
                    <IconButton color="warning" onClick={() => handleEditClick(params.row)}>
                        <ModeEdit/>
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(params.row)}>
                        <DeleteForever/>
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleViewClick(params.row)}>
                        <Visibility/>
                    </IconButton>
                </>
            )
        }
    ];

    return (
        <Box sx={{width: '100%', p: 2}}>
            <div className={`d-flex justify-content-center mb-3`}>
                <Typography variant={'h2'} color={'textPrimary'}>Equipment</Typography>
            </div>
            <div className={`d-flex justify-content-center mb-3`}>
                <Button variant="contained" color="primary" onClick={handleAddClick}>Add Equipment</Button>
            </div>
            <SearchBarHasSelector {...searchProps}/>
            <Box sx={{height: 550, width: '100%', mt: 2}}>
                <DataGrid
                    rows={filteredEquipments.reverse()}
                    columns={columns}
                    pageSize={rowsPerPage}
                    pagination
                    paginationMode="server"
                    rowCount={filteredEquipments.length}
                    page={page}
                    onPageChange={(newPage) => setPage(newPage)}
                    onPageSizeChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
                />
            </Box>
            <EquipmentPopup
                equipment={selectedEquipment}
                show={showModal}
                handleClose={() => setShowModal(false)}
                actionType={actionType}
                onFetch={FetchData}/>
        </Box>
    );
}

export default Equipment;
