import React, {useEffect, useState} from "react";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Button, Typography, IconButton
} from "@mui/material";
import CategoryPopup from "../popup/CategoryPopup.jsx";
import {getCategoryList} from "../../services/ManagerService.jsx";
import {DeleteForever, ModeEdit, Visibility} from "@mui/icons-material";
import {SearchBarHasSelector} from "../ui/SearchBarHasSelector.jsx";

const columns = [
    {id: "name", label: "Name", minWidth: 170},
    {id: "code", label: "Code", minWidth: 100},
    {id: "description", label: "Description", minWidth: 170}
];

function Category() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isDisabled, setIsDisabled] = useState(false);
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

    async function FetchData() {
        const response = await getCategoryList();
            setCategories(response.data);
    }

    useEffect(() => {
        FetchData();
    }, []);

    const handleClose = () => setShowModal(false);

    const handleAddClick = () => {
        setSelectedCategory(null);
        setActionType('add');
        setShowModal(true);
    };

    const handleViewClick = (category) => {
        setSelectedCategory(category);
        setActionType('view');
        setShowModal(true);
    };

    const handleEditClick = (category) => {
        setIsDisabled(true)
        setSelectedCategory(category);
        setActionType('edit');
        setShowModal(true);
    };

    const handleDeleteClick = (category) => {
        setSelectedCategory(category);
        setActionType('delete');
        setShowModal(true);
    };

    const filteredCategories = categories.filter(cate =>
        searchValue.name
            ? cate.name.toLowerCase().includes(searchValue.keyword.toLowerCase())
            : cate.code.toLowerCase().includes(searchValue.keyword.toLowerCase())
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
                <Typography variant="h2" color="textPrimary">Category</Typography>
            </div>
            <div className="d-flex justify-content-center mb-3">
                <Button variant="contained" color="primary" onClick={handleAddClick}>Add Category</Button>
            </div>
            <SearchBarHasSelector {...searchProps} />

            <Paper sx={{width: "100%", overflow: "hidden"}}>
                <TableContainer sx={{maxHeight: 440}}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{fontWeight: 'bold'}}>No.</TableCell>
                                <TableCell align="center" sx={{fontWeight: 'bold'}}>Code</TableCell>
                                <TableCell align="center" sx={{fontWeight: 'bold'}}>Name</TableCell>
                                <TableCell align="center" sx={{fontWeight: 'bold'}}>Description</TableCell>
                                <TableCell align="center" sx={{fontWeight: 'bold'}}>Status</TableCell>
                                <TableCell align="center" sx={{fontWeight: 'bold'}}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cate, index) => (
                                <TableRow hover key={cate.id}>
                                    <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{cate.code}</TableCell>
                                    <TableCell>{cate.name}</TableCell>
                                    <TableCell>{cate.description}</TableCell>
                                    <TableCell>{cate.status}</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="warning" onClick={() => handleEditClick(cate)}>
                                            <ModeEdit/>
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDeleteClick(cate)}>
                                            <DeleteForever/>
                                        </IconButton>
                                        <IconButton color="primary" onClick={() => handleViewClick(cate)}>
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
                    count={filteredCategories.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <CategoryPopup
                    category={selectedCategory}
                    show={showModal}
                    handleClose={handleClose}
                    actionType={actionType}
                    onFetch={FetchData}
                    isDisabled={isDisabled}
                />
            </Paper>
        </Box>
    );
}

export default Category;
