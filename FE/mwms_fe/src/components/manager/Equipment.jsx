import {Button, Col, Form, Row, Table} from "react-bootstrap";
import style from "../../styles/manager/Equipment.module.css";
import {useEffect, useState} from "react";
import EquipmentPopup from "../popup/EquipmentPopup.jsx";
import {FaEdit, FaTrash} from "react-icons/fa";
import {getEquipmentList} from "../../services/EquipmentService.js";
import {SearchBarHasSelector} from "../ui/SearchBarHasSelector.jsx";

function Equipment() {

    const [equipments, setEquipments] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState('');
    const [searchValue, setSearchValue] = useState({
        keyword: "",
        name: false,
        code: false
    });


    const searchProps = {
        mainWidth: 80,
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

    useEffect(() => {
        async function fetchData() {
            return await getEquipmentList();
        }

        fetchData().then((data) => {
            setEquipments(data);
        });
    }, [equipments]);

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

    const handleAddClick = () => {
        setSelectedEquipment(null);
        setActionType('add');
        setShowModal(true);
    }

    return (
        <div className={style.main}>
            <div className={style.title_area}>
                <h1 className={`text-light`}>Equipment</h1>
            </div>
            <div className={style.add_button_area}>
                <button
                    onClick={handleAddClick}
                    className={`btn btn-primary ${style.add}`}>Add Equipment
                </button>
            </div>
            <div className={`vw-83 d-flex justify-content-center`}>
                <SearchBarHasSelector {...searchProps}/>
            </div>
            <div className={style.table_area}>
                <Table striped bordered hover variant={`lightcyan`} onClick={(e) => {
                    const row = e.nativeEvent.target.closest('tr');
                    if (row && equipments[row.rowIndex - 1]) {
                        handleRowClick(equipments[row.rowIndex - 1]);
                    }
                }}>
                    <thead>
                    <tr>
                        <th>No.</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Unit</th>
                        <th>Price($)</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {equipments
                        .filter(equipment => searchValue.name
                            ? equipment.name.toLowerCase().includes(searchValue.keyword.toLowerCase())
                            : equipment.code.toLowerCase().includes(searchValue.keyword.toLowerCase()))
                        .map((equipment, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{equipment.code}</td>
                            <td>{equipment.name}</td>
                            <td>{equipment.category}</td>
                            <td>{equipment.unit}</td>
                            <td>{equipment.price}</td>
                            <td>
                                <Button variant="warning"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditClick(equipment);
                                        }}>
                                    <FaEdit/>
                                </Button>
                                <Button variant="danger"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(equipment);
                                        }}>
                                    <FaTrash/>
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

export default Equipment;