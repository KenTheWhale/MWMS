import style from "../../styles/CategoryPage.module.css";
import {Button, Col, Form, Row, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import CategoryPopup from "../../components/CategoryPopup.jsx";
import {useNavigate} from "react-router-dom";
import {FaEdit, FaTrash} from "react-icons/fa";
import {getCategoryList} from "../../services/CategoryService.js";


function CategoryPage() {

    // const [categories, setCategories] = useState([
    //         {
    //             id: 1,
    //             name: 'Diagnostic Equipment',
    //             code: 'DE',
    //             description: 'Equipment used to diagnose disease includes ultrasound, ECG, X-ray machines.'
    //         },
    //         {
    //             id: 2,
    //             name: 'Surgical Equipment',
    //             code: 'DE',
    //             description: 'Surgical instruments include scalpels, surgical forceps, cutting instruments.'
    //         },
    //         {
    //             id: 3,
    //             name: 'Monitoring Equipment',
    //             code: 'DE',
    //             description: 'Patient monitoring equipment, including cardiac monitors, blood pressure monitors, patient monitors.'
    //         },
    //         {
    //             id: 4,
    //             name: 'Anesthesia Equipment',
    //             code: 'DE',
    //             description: 'Equipment used in anesthesia and patient support during surgery, including anesthesia machines and syringe pumps.'
    //         },
    //         {
    //             id: 5,
    //             name: 'Therapeutic Equipment',
    //             code: 'DE',
    //             description: 'Therapeutic support equipment, including electrotherapy machines, electropulse machines, and heat therapy machines.'
    //         },
    //         {
    //             id: 6,
    //             name: 'Rehabilitation Equipment',
    //             code: 'DE',
    //             description: 'Rehabilitation equipment, including massage chairs, walking aids, rehabilitation machines.'
    //         },
    //         {
    //             id: 7,
    //             name: 'Imaging Equipment',
    //             code: 'DE',
    //             description: 'Imaging equipment, including MRI machines, CT scanners, X-ray machines.'
    //         },
    //         {
    //             id: 8,
    //             name: 'Infusion Equipment',
    //             code: 'DE',
    //             description: 'Devices used for infusing fluids and drugs, including electronic syringe pumps and infusion pumps.'
    //         },
    //         {
    //             id: 9,
    //             name: 'Respiratory Equipment',
    //             code: 'DE',
    //             description: 'Respiratory support equipment, including ventilators, suction machines, and oxygen therapy.'
    //         },
    //         {
    //             id: 10,
    //             name: 'Laboratory Equipment',
    //             code: 'DE',
    //             description: 'Laboratory equipment, including blood analyzers, urinalysis machines, and biochemistry analyzers.'
    //         }
    //     ]
    // );

    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState('');

    useEffect(() => {
        async function fetchData() {
            return await getCategoryList();
        }
        fetchData().then((data) => {
            setCategories(data);
        });
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

    useEffect(() => {
        async function fetchData() {
            return await getCategoryList();
        }
        fetchData().then((data) => {
            setCategories(data);
        });
    }, []);

    return (
        <div className={`container-fluid ${style.tbl_container}`}>
            <div className={`row`}>
                <h1 className={`text-light`}>Category</h1>
            </div>
            <div className={`row`}>
                <button
                    onClick={() => {
                        setSelectedCategory(null);
                        setActionType('add');
                        setShowModal(true);
                    }}
                    className={`btn btn-primary ${style.add}`}>Add Category
                </button>
            </div>
            <div className={`row ${style.row}`}>
                    <Row className="mb-3">
                        <Col xs={11}>
                            <Form.Group controlId="formGridSearch">
                                <Form.Control type="email" placeholder="Enter name, code,..." />
                            </Form.Group>
                        </Col>

                        <Col xs={1}>
                            <Button variant="primary" type="submit" style={{ width: "100%" }}>
                                Search
                            </Button>
                        </Col>
                    </Row>
            </div>
            <div className={`row ${style.row}`}>
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

export default CategoryPage;