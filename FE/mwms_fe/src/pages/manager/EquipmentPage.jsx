import {Button, Col, Form, Row, Table} from "react-bootstrap";
import style from "../../styles/EquipmentPage.module.css";
import {useState} from "react";
import EquipmentPopup from "../../components/EquipmentPopup.jsx";
import {FaEdit, FaTrash} from "react-icons/fa";

function EquipmentPage() {

    const [equipments, setEquipments] = useState(
        [
            {
                id: 1,
                category: 'Diagnostic Equipment',
                name: 'Oxygen Concentrator',
                description: 'An apparatus that concentrates oxygen from the air.',
                code: 'MED001',
                expired_date: new Date('2024-05-31'),
                price: 500.25,
                quantity: 10
            },
            {
                id: 2,
                category: 'Surgical Equipment',
                name: 'Ventilator',
                description: 'A machine that delivers air or oxygen to the lungs for a person who cannot breathe on their own.',
                code: 'MED002',
                expired_date: new Date('2025-12-31'),
                price: 1500.75,
                quantity: 5
            },
            {
                id: 3,
                category: 'Monitoring Equipment',
                name: 'ECG Machine',
                description: 'An electrocardiograph used to record the heart\'s activity.',
                code: 'MED003',
                expired_date: new Date('2023-11-15'),
                price: 800.00,
                quantity: 3
            },
            {
                id: 4,
                category: 'Anesthesia Equipment',
                name: 'Defibrillator',
                description: 'A portable electronic device that delivers an electric shock to the heart of someone who is in cardiac arrest.',
                code: 'MED004',
                expired_date: new Date('2026-01-31'),
                price: 1200.50,
                quantity: 2
            },
            {
                id: 5,
                category: 'Therapeutic Equipment',
                name: 'Infusion Pump',
                description: 'A device that delivers fluids and medications directly into a patient\'s bloodstream.',
                code: 'MED005',
                expired_date: new Date('2024-06-30'),
                price: 950.25,
                quantity: 4
            },
            {
                id: 6,
                category: 'Rehabilitation Equipment',
                name: 'Pulse Oximetry',
                description: 'A medical device that measures the oxygen saturation of hemoglobin in arterial blood.',
                code: 'MED006',
                expired_date: new Date('2023-10-15'),
                price: 700.00,
                quantity: 6
            },
            {
                id: 7,
                category: 'Imaging Equipment',
                name: 'Syringe Pump',
                description: 'A device that automatically controls the flow of liquid from a syringe.',
                code: 'MED007',
                expired_date: new Date('2025-03-31'),
                price: 1100.75,
                quantity: 7
            },
            {
                id: 8,
                category: 'Infusion Equipment',
                name: 'Suction Machine',
                description: 'A device used to remove or reduce mucus and other secretions from the lungs.',
                code: 'MED008',
                expired_date: new Date('2024-09-15'),
                price: 650.50,
                quantity: 8
            },
            {
                id: 9,
                category: 'Respiratory Equipment',
                name: 'Neutralizer',
                description: 'A device used to neutralize harmful substances in the environment.',
                code: 'MED009',
                expired_date: new Date('2026-12-31'),
                price: 1300.25,
                quantity: 9
            },
            {
                id: 10,
                category: 'Laboratory Equipment',
                name: 'Patient Monitor',
                description: 'A device that continuously monitors a patient\'s vital signs such as heart rate and blood pressure.',
                code: 'MED010',
                expired_date: new Date('2024-07-31'),
                price: 850.00,
                quantity: 10
            }
        ]
    )
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState('');

    const handleRowClick = (equipment) => {
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

    const handleCloseModal = () => setShowModal(false);

    const handleSaveEquipment = (updatedEquipment) => {
        if (actionType === 'add') {
            const newEquipment = {
                ...updatedEquipment,
                id: equipments.length + 1
            };
            setEquipments([...equipments, newEquipment]);
        } else {
            const updatedEquipments = equipments.map((eq) =>
                eq.code === updatedEquipment.code ? updatedEquipment : eq
            );
            setEquipments(updatedEquipments);
        }
        setShowModal(false);
    };

    const handleDeleteEquipment = (equipmentId) => {
        const updatedEquipments = equipments.filter((equipment) => equipment.id !== equipmentId);
        setEquipments(updatedEquipments);
        setShowModal(false);
    };

    return (
        <div className={`container-fluid ${style.tbl_container}`}>
            <div className={`row`}>
                <h1 className={`text-light`}>Equipment</h1>
            </div>
            <div className={`row }`}>
                <button
                    onClick={() => {
                        setSelectedEquipment(null);
                        setActionType('add');
                        setShowModal(true);
                    }}
                    className={`btn btn-primary ${style.add}`}>Add Equipment
                </button>
            </div>
            <div className={`row ${style.row}`}>
                <Form>
                    <Row className="mb-3">
                        <Form.Group as={Col} xs={11} controlId="formGridEmail">
                            <Form.Control type="email" placeholder="Enter name, code, category,..."/>
                        </Form.Group>

                        <Form.Group as={Col} xs={1} controlId="searchButton">
                            <Button variant="primary" type="submit">
                                Search
                            </Button>
                        </Form.Group>
                    </Row>
                </Form>
            </div>
            <div className={`row ${style.row}`}>
                <Table striped bordered variant={`dark`} onClick={(e) => {
                    const row = e.nativeEvent.target.closest('tr');
                    if (row && equipments[row.rowIndex - 1]) {
                        handleRowClick(equipments[row.rowIndex - 1]);
                    }
                }}>
                    <thead>
                    <tr>
                        <th>No.</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Unit</th>
                        <th>Quantity</th>
                        <th>Price($)</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {equipments.map((equipment, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{equipment.name}</td>
                            <td>{equipment.category}</td>
                            <td></td>
                            <td>{equipment.quantity}</td>
                            <td>{equipment.price}</td>
                            <td>
                                <Button variant="warning"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(equipment);
                                    }}>
                                    <FaEdit />
                                </Button>
                                <Button variant="danger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(equipment);
                                    }}>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
            <EquipmentPopup
                equipment={selectedEquipment}
                show={showModal}
                handleClose={handleCloseModal}
                actionType={actionType}
                onSave={handleSaveEquipment}
                onDelete={handleDeleteEquipment}/>
        </div>
    );
}

export default EquipmentPage;