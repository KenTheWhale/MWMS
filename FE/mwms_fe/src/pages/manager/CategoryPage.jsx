import style from "../../styles/CategoryPage.module.css";
import {Button, Col, Form, Row, Table} from "react-bootstrap";
import {useState} from "react";
import CategoryPopup from "../../components/CategoryPopup.jsx";


function CategoryPage() {

    const [categories, setCategories] = useState([
        {
            id: 1,
            name: 'Diagnostic Equipment',
            code: 'DE',
            description: 'Thiết bị dùng để chẩn đoán bệnh, bao gồm máy siêu âm, ECG, máy chụp X-quang.'
        },
        {
            id: 2,
            name: 'Surgical Equipment',
            code: 'DE',
            description: 'Dụng cụ phẫu thuật bao gồm dao mổ, kẹp phẫu thuật, dụng cụ cắt.'
        },
        {
            id: 3,
            name: 'Monitoring Equipment',
            code: 'DE',
            description: 'Thiết bị theo dõi bệnh nhân, bao gồm máy theo dõi tim, máy đo huyết áp, máy theo dõi bệnh nhân.'
        },
        {
            id: 4,
            name: 'Anesthesia Equipment',
            code: 'DE',
            description: 'Thiết bị dùng trong gây mê và hỗ trợ bệnh nhân trong quá trình phẫu thuật, bao gồm máy gây mê, bơm tiêm.'
        },
        {
            id: 5,
            name: 'Therapeutic Equipment',
            code: 'DE',
            description: 'Thiết bị hỗ trợ trị liệu, bao gồm máy trị liệu bằng điện, máy xung điện, máy điều trị nhiệt.'
        },
        {
            id: 6,
            name: 'Rehabilitation Equipment',
            code: 'DE',
            description: 'Thiết bị phục hồi chức năng, bao gồm ghế massage, thiết bị hỗ trợ đi lại, máy tập phục hồi.'
        },
        {
            id: 7,
            name: 'Imaging Equipment',
            code: 'DE',
            description: 'Thiết bị chụp hình ảnh, bao gồm máy chụp MRI, máy chụp CT, máy chụp X-quang.'
        },
        {
            id: 8,
            name: 'Infusion Equipment',
            code: 'DE',
            description: 'Thiết bị dùng để truyền dịch và thuốc, bao gồm bơm tiêm điện tử, bơm truyền dịch.'
        },
        {
            id: 9,
            name: 'Respiratory Equipment',
            code: 'DE',
            description: 'Thiết bị hỗ trợ hô hấp, bao gồm máy thở, máy hút đàm, oxy liệu pháp.'
        },
        {
            id: 10,
            name: 'Laboratory Equipment',
            code: 'DE',
            description: 'Thiết bị trong phòng thí nghiệm, bao gồm máy phân tích máu, máy xét nghiệm nước tiểu, máy kiểm tra sinh hóa.'
        }
    ]);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState('');

    const handleRowClick = (equipment) => {
        setSelectedCategory(equipment);
        setActionType('view');
        setShowModal(true);
    };

    const handleEditClick = (equipment) => {
        setSelectedCategory(equipment);
        setActionType('edit');
        setShowModal(true);
    };

    const handleDeleteClick = (equipment) => {
        setSelectedCategory(equipment);
        setActionType('delete');
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSaveEquipment = (updatedEquipment) => {
        if (actionType === 'add') {
            const newEquipment = {
                ...updatedEquipment,
                id: categories.length + 1
            };
            setCategories([...categories, newEquipment]);
        } else {
            const updatedEquipments = categories.map((eq) =>
                eq.code === updatedEquipment.code ? updatedEquipment : eq
            );
            setCategories(updatedEquipments);
        }
        setShowModal(false);
    };

    const handleDeleteEquipment = (equipmentId) => {
        const updatedEquipments = categories.filter((equipment) => equipment.id !== equipmentId);
        setCategories(updatedEquipments);
        setShowModal(false);
    };

    return (
        <div>
            <div className={`${style.tbl_container}`}>
                <div className={`row ${style.row}`}>
                    <h1 className={`text-light`}>Category</h1>
                    <div>
                        <button
                            onClick={() => {
                                setSelectedCategory(null);
                                setActionType('add');
                                setShowModal(true);
                            }}
                            className="btn btn-primary">Add Category
                        </button>
                    </div>
                    <div className={`row ${style.row}`}>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col} xs={11} controlId="formGridEmail">
                                    <Form.Control type="email" placeholder="Enter name, code,..."/>
                                </Form.Group>

                                <Form.Group as={Col} xs={1} controlId="searchButton">
                                    <Button variant="primary" type="submit">
                                        Search
                                    </Button>
                                </Form.Group>
                            </Row>
                        </Form>
                    </div>
                    <Table striped bordered variant={`dark`} onClick={(e) => {
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
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(cate);
                                        }}
                                        className="btn btn-danger">Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </div>
            <CategoryPopup
                category={selectedCategory}
                show={showModal}
                handleClose={handleCloseModal}
                actionType={actionType}
                onSave={handleSaveEquipment}
                onDelete={handleDeleteEquipment}/>
        </div>
    );
}

export default CategoryPage;