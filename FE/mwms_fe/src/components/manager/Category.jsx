import style from "../../styles/manager/Category.module.css";
import {Button, Form, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import CategoryPopup from "../popup/CategoryPopup.jsx";
import {FaEdit, FaTrash} from "react-icons/fa";
import {getCategoryList} from "../../services/ManagerService.jsx";
import {enqueueSnackbar} from "notistack";


function Category() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState('');

    async function FetchData() {
        const response = await getCategoryList();
        if (response.success){
            setCategories(response.data) ;
        }
    }

    useEffect(() => {
        FetchData();
    }, []);

    const handleRowClick = (cate) => {
        setSelectedCategory(cate);
        setActionType('view');
        setShowModal(true);
    };

    const handleEditClick = (cate) => {
        setSelectedCategory(cate);
        setActionType('edit');
        setShowModal(true);
    };

    const handleDeleteClick = (cate) => {
        setSelectedCategory(cate);
        setActionType('delete');
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSaveCategory = (updateCategory) => {
        if (actionType === 'add') {
            const newCategory = {
                ...updateCategory,
                id: categories.length + 1
            };
            setCategories([...categories, newCategory]);
        } else {
            const updatedCategories = categories.map((cate) =>
                cate.id === updateCategory.id ? updateCategory : cate
            );
            setCategories(updatedCategories);
        }
        setShowModal(false);
    };

    const handleDeleteCategory = (categoryId) => {
        const updatedCategories = categories.filter((cate) => cate.id !== categoryId);
        setCategories(updatedCategories);
        setShowModal(false);
    };

    return (
        <div className={style.main}>
            <div className={style.title_area}>
                <h1 className={`text-light`}>Category</h1>
            </div>
            <div className={style.add_button_area}>
                <button
                    onClick={() => {
                        setSelectedCategory(null);
                        setActionType('add');
                        setShowModal(true);
                    }}
                    className={`btn btn-primary`}>Add Category
                </button>
            </div>
            <div className={style.table_area}>
                <Table striped bordered hover onClick={(e) => {
                    const row = e.nativeEvent.target.closest('tr');
                    if (row && categories[row.rowIndex - 1]) {
                        handleRowClick(categories[row.rowIndex - 1]);
                    }
                }}>
                    <thead>
                    <tr>
                        <th>No.</th>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((cate, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{cate.name}</td>
                            <td>{cate.code}</td>
                            <td>{cate.description}</td>
                            <td>
                                <Button variant="warning"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditClick(cate);
                                        }}>
                                    <FaEdit/>
                                </Button>
                                <Button variant="danger"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(cate);
                                        }}>
                                    <FaTrash/>
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
            <CategoryPopup
                category={selectedCategory}
                show={showModal}
                handleClose={handleCloseModal}
                actionType={actionType}
                onSave={handleSaveCategory}
                onDelete={handleDeleteCategory}/>
        </div>
    );
}

export default Category;