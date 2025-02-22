import style from "../../styles/manager/Category.module.css";
import {Button, Form, Table} from "react-bootstrap";
import {useState} from "react";
import CategoryPopup from "../CategoryPopup.jsx";
import {FaEdit, FaTrash} from "react-icons/fa";


function Category() {

    const [categories, setCategories] = useState([
            {
                id: 1,
                name: 'Diagnostic Equipment',
                code: 'DE',
                description: 'Equipment used to diagnose disease includes ultrasound, ECG, X-ray machines.'
            },
            {
                id: 2,
                name: 'Surgical Equipment',
                code: 'DE',
                description: 'Surgical instruments include scalpels, surgical forceps, cutting instruments.'
            },
            {
                id: 3,
                name: 'Monitoring Equipment',
                code: 'DE',
                description: 'Patient monitoring equipment, including cardiac monitors, blood pressure monitors, patient monitors.'
            },
            {
                id: 4,
                name: 'Anesthesia Equipment',
                code: 'DE',
                description: 'Equipment used in anesthesia and patient support during surgery, including anesthesia machines and syringe pumps.'
            },
            {
                id: 5,
                name: 'Therapeutic Equipment',
                code: 'DE',
                description: 'Therapeutic support equipment, including electrotherapy machines, electropulse machines, and heat therapy machines.'
            },
            {
                id: 6,
                name: 'Rehabilitation Equipment',
                code: 'DE',
                description: 'Rehabilitation equipment, including massage chairs, walking aids, rehabilitation machines.'
            },
            {
                id: 7,
                name: 'Imaging Equipment',
                code: 'DE',
                description: 'Imaging equipment, including MRI machines, CT scanners, X-ray machines.'
            },
            {
                id: 8,
                name: 'Infusion Equipment',
                code: 'DE',
                description: 'Devices used for infusing fluids and drugs, including electronic syringe pumps and infusion pumps.'
            },
            {
                id: 9,
                name: 'Respiratory Equipment',
                code: 'DE',
                description: 'Respiratory support equipment, including ventilators, suction machines, and oxygen therapy.'
            },
            {
                id: 10,
                name: 'Laboratory Equipment',
                code: 'DE',
                description: 'Laboratory equipment, including blood analyzers, urinalysis machines, and biochemistry analyzers.'
            }
        ]
    );

    // const navigate = useNavigate();
    //
    // useEffect(() => {
    //     if (!localStorage.getItem('user')){
    //         navigate('/login');
    //     }
    // });
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState('');

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
            <div className={style.search_area}>
                <div className={style.search_input}>
                    <Form.Group controlId="formGridSearch">
                        <Form.Control type="email" placeholder="Enter name, code,..."/>
                    </Form.Group>
                </div>
                <div className={style.search_button}>
                    <Button variant="primary" type="submit" style={{width: "100%"}}>
                        Search
                    </Button>
                </div>
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