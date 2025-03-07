import {useEffect, useState} from "react";
import {Button, Card, Form, Modal, Table} from "react-bootstrap";
import style from "../../styles/manager/ImportRequest.module.css";
import {
    createRequestApplication,
    getImportRequest,
    getSupplierEquipment,
    getSupplierList, updateRequestApplication,
    viewDetail
} from "../../services/ManagerService.jsx";
import {FaSearch} from "react-icons/fa";
import {GrUpdate, GrView} from "react-icons/gr";
import {CgAddR} from "react-icons/cg";
import {CustomAlertHUY} from "../CustomAlert.jsx";
import {LuSave} from "react-icons/lu";
import {MdOutlineCancel} from "react-icons/md";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";

function ImportRequest() {
    const [requestList, setRequestList] = useState([]);
    const [filterDate, setFilterDate] = useState({
        value: null,
        format: ""
    });
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [show, setShow] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState({});
    const [showAddCard, setShowAddCard] = useState(false);
    const [partners, setPartners] = useState([]);
    const [equipments, setEquipments] = useState([]);
    const [rows, setRows] = useState([{name: "", description: "", quantity: "", unit: ""}]);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [editRows, setEditRows] = useState({});
    const [equipmentForUpdate, setEquipmentForUpdate] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await getImportRequest();
            setRequestList(response.data || []);
        }

        fetchData();
    }, []);

    const handleViewDetail = async (code) => {
        try {
            const response = await viewDetail(code);
            if (!response || !response.data) {
                console.error("viewDetail API returned null or invalid data.");
                return;
            }
            setSelectedRequest(response.data);
            setShow(true);
        } catch (error) {
            console.error("Error in handleViewDetail:", error);
        }
    };


    const toggleGroup = (groupId) => {
        setExpandedGroups((previousState) => {
            const updatedState = { ...previousState };

            updatedState[groupId] = !previousState[groupId];

            return updatedState;
        });
    };

    const handleDateChange = (value) => {
        setFilterDate({
            ...filterDate, value: value, format: value.format("YYYY-MM-DD")
        });
    };

    const clearDatePicker = () => {
        setFilterDate({
            ...filterDate, value: null, format: ""
        });    }

    const handleClose = () => setShow(false);

    const handleAddClick = () => {

        async function GetSuppliers() {
            const response = await getSupplierList();
            console.log(response.data);
            if (response && response.data) {
                setPartners(response.data);
            } else {
                setPartners([]);
            }
        }

        GetSuppliers();
        setShowAddCard(!showAddCard);
    };

    const handleAddRow = () => {
        setRows([
            ...rows,
            {name: "", description: "", quantity: "", unit: "", partner: ""}
        ]);
    };

    const handleInputRow = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;

        if (field === "name") {
            const selectedEquipment = equipments.find(e => e.name === value);
            if (selectedEquipment) {
                updatedRows[index]["description"] = selectedEquipment.description || "";
                updatedRows[index]["unit"] = selectedEquipment.unit || "";
            }
        }
        if (field === "partner") {
            async function getSupplierEq() {
                const response = await getSupplierEquipment(value)
                console.log(response.data);
                setEquipments(response.data || []);
            }

            getSupplierEq();
        }

        setRows(updatedRows);
    };

    const handleRemoveRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };

    const handleSubmit = () => {
        async function createRequest() {

            if (rows.length === 0 || rows.every(row => !row.partner || !row.name || !row.quantity)) {
                setAlertMessage("Please fill in at least one item.");
                setAlertType("danger");
                return;
            }

            const requestItems = rows.map(row => ({
                equipmentId: equipments.find(e => e.name === row.name)?.id,
                partnerId: row.partner,
                quantity: parseInt(row.quantity, 10),
            }))
            const response = await createRequestApplication(requestItems);

            if (response) {
                setAlertMessage(response.message);
                setAlertType("success");
                const updatedRequests = await getImportRequest();
                setRequestList(updatedRequests.data || []);
            } else {
                setAlertMessage(response.message);
                setAlertType("danger");
            }
        }

        createRequest();
        setShowAddCard(false);

    }

    const handleEditRow = async (groupId, index, item) => {
        const selectedGroup = selectedRequest?.itemGroups.find(group => group.groupId === groupId);
        if (!selectedGroup) return;

        const existingEquipmentIds = selectedGroup?.requestItems?.map(item => item.eqId) || [];

        getSupplierEquipment(selectedGroup.partnerId).then(response => {
            const filteredEquipments = response.data.filter(eq =>
                !(existingEquipmentIds.includes(eq.id) && eq.id === item.eqId)
            );

            setEquipmentForUpdate(filteredEquipments);
            setEditRows(prev => ({
                ...prev,
                [`${groupId}-${index}`]: true,
            }));
        });
    };


    const cancelEditRow = (groupId, index) => {
        setEditRows(prev => {
            const updatedEditRows = { ...prev };
            delete updatedEditRows[`${groupId}-${index}`];
            return updatedEditRows;
        });
    };


    const handleUpdateChange = (groupId, index, field, value) => {
        const rowKey = `${groupId}-${index}`;
        setEditRows(prev => ({
            ...prev,
            [rowKey]: {
                ...prev[rowKey],
                [field]: value
            }
        }));
    };


    const handleUpdateSave = async (groupId, index, item) => {
        const rowKey = `${groupId}-${index}`;
        const editData = editRows[rowKey];

        if (!editData) return;


            const response = await updateRequestApplication(
                item.itemId,
                editData.selectedEquipmentId || item.eqId,
                editData.quantity || item.quantity
            );

            if (response.success) {
                setSelectedRequest(prev => {
                    const newItemGroups = prev.itemGroups.map(group => {
                        if (group.groupId === groupId) {
                            return {
                                ...group,
                                requestItems: group.requestItems.map((reqItem, idx) =>
                                    idx === index ? { ...reqItem, ...editData } : reqItem
                                )
                            };
                        }
                        return group;
                    });

                    return { ...prev, itemGroups: newItemGroups };
                });

                setEditRows(prev => {
                    const newRows = { ...prev };
                    delete newRows[rowKey];
                    return newRows;
                });
                handleViewDetail(selectedRequest.code)
                setAlertMessage("update successfully");
                setAlertType("success");
            } else {
                setAlertMessage("update false please try again");
                setAlertType("danger");
            }
    };

    return (
        <div className="container-fluid">
            <CustomAlertHUY message={alertMessage} type={alertType} onClose={() => setAlertMessage("")}/>
            <div className="row">
                <label className="d-flex justify-content-center fs-1">Import Request</label>
            </div>

            <div className="row">
                <div className="col-12 d-flex justify-content-end align-items-center gap-2">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker slotProps={{field:{clearable:true,onClear:clearDatePicker}}}
                                    format={"YYYY-MM-DD"} timezone={"system"}
                                    onChange={handleDateChange}
                                    value={filterDate.value}
                                    label="Request Date" />
                    </LocalizationProvider>
                    <Button onClick={handleAddClick}><CgAddR/></Button>
                </div>
            </div>

            <div className="row">
                <div className={style.importTable}>
                    <table>
                        <thead>
                        <tr>
                            <th>Code</th>
                            <th>Request Date</th>
                            <th>Last Modified</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {requestList
                            .filter((item) => item.requestDate.includes(filterDate.format))
                            .reverse()
                            .map((item, index) => (
                                <tr key={index}>
                                    <td>{item.code}</td>
                                    <td>{item.requestDate}</td>
                                    <td>{item.lastModifiedDate}</td>
                                    <td>
                                        <Button onClick={() => handleViewDetail(item.code)}><GrView/></Button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddCard && (
                <Card className={`${style.addCard} mt-3 p-3`}>
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Partner Name</th>
                                <th>Equipment Name</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {rows.map((row, index) => (
                                <tr key={index}>
                                    <td>
                                        <Form.Select className="m-2" value={row.partner}
                                                     onChange={(e) => handleInputRow(index, "partner", e.target.value)}
                                                     required>
                                            <option value="">Select Partner</option>
                                            {partners.map((partner) => (
                                                <option key={partner.partnerId} value={partner.partnerId}>
                                                    {partner.partnerName}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </td>

                                    <td>
                                        <Form.Select className="m-2" value={row.name || ""}
                                                     onChange={(e) => handleInputRow(index, "name", e.target.value)}
                                                     required
                                                    disabled={!row.partner}>
                                            <option value="">Select Equipment</option>
                                            {equipments.filter(eq =>
                                                    eq.name === row.name ||
                                                    !rows.some(r => r.partner === row.partner && r.name === eq.name)
                                                )
                                                .map(equipment => (
                                                    <option key={equipment.id} value={equipment.name}>
                                                        {equipment.name}
                                                    </option>
                                                ))}
                                        </Form.Select>

                                    </td>

                                    <td>
                                        <Form.Control className="m-2" type="text" value={row.description} readOnly/>
                                    </td>

                                    <td>
                                        <Form.Control className="m-2" type="number" min="1" value={row.quantity}
                                                      onChange={(e) => handleInputRow(index, "quantity", e.target.value)}
                                                      required/>
                                    </td>

                                    <td>
                                        <Form.Control className="m-2" type="text" value={row.unit} readOnly/>
                                    </td>

                                    <td>
                                        <Button variant="danger" className="m-2" onClick={() => handleRemoveRow(index)}>
                                            -
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>

                        <Button variant="primary" onClick={handleAddRow}>+</Button>

                        <Card.Footer>
                            <Button type="submit">Submit</Button>
                        </Card.Footer>
                    </Form>
                </Card>
            )}


            <Modal
                size="xl"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                className={`${style.modalDetail}`}
            >
                <Modal.Header closeButton>
                    <div className={`${style.titleModal}`}>
                        <Modal.Title>Request Detail - {selectedRequest?.code}</Modal.Title>
                    </div>

                </Modal.Header>
                <Modal.Body className={style.modalBody}>
                    {selectedRequest ? (
                        <div>
                            <div className="mb-3">
                                <p><strong>Request Date:</strong> {selectedRequest.requestDate}</p>
                                <p><strong>Last Modified:</strong> {selectedRequest.lastModified}</p>
                            </div>

                            {selectedRequest.itemGroups && selectedRequest.itemGroups.length > 0 ? (
                                selectedRequest.itemGroups.map((group) => (
                                    <Card key={group.groupId} className={`mb-3`}>
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <Card.Title>
                                                    Partner : {group.partner}
                                                </Card.Title>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => toggleGroup(group.groupId)}
                                                >
                                                    <FaSearch/> View
                                                </Button>
                                            </div>

                                            <Card.Subtitle className="mb-2 text-muted">
                                                Carrier Name : {group.carrierName}

                                            </Card.Subtitle>
                                            <Card.Subtitle className="mb-2 text-muted">
                                                Carrier Phone: {group.carrierPhone}
                                            </Card.Subtitle>
                                            <Card.Text>Delivery Date: {group.deliveryDate}</Card.Text>
                                            <Card.Text>Status: {group.status}</Card.Text>

                                            {expandedGroups[group.groupId] &&
                                                <>
                                                    <Table striped bordered hover className="mt-3 table">
                                                        <thead>
                                                        <tr>
                                                            <th>Equipment Name</th>
                                                            <th>Description</th>
                                                            <th>Quantity</th>
                                                            <th>Unit</th>
                                                            <th>Action</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {group.requestItems.map((item, index) => {
                                                            const rowKey = `${group.groupId}-${index}`;
                                                            const isEditing = editRows[rowKey];

                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {isEditing ? (
                                                                            <Form.Select
                                                                                value={isEditing.selectedEquipmentId || item.eqId}
                                                                                onChange={(e) => handleUpdateChange(group.groupId, index, "selectedEquipmentId", parseInt(e.target.value, 10))}>
                                                                                {equipmentForUpdate.map(eq => (
                                                                                    <option key={eq.id} value={eq.id}>{eq.name}</option>
                                                                                ))}
                                                                            </Form.Select>

                                                                        ) : (
                                                                            item.equipmentName
                                                                        )}
                                                                    </td>
                                                                    <td>{item.equipmentDescription}</td>
                                                                    <td>
                                                                        {isEditing ? (
                                                                            <Form.Control
                                                                                type="number"
                                                                                value={isEditing.quantity || item.quantity}
                                                                                onChange={(e) => handleUpdateChange(group.groupId, index, "quantity", parseInt(e.target.value, 10) || 1)}
                                                                            />

                                                                        ) : (
                                                                            item.quantity
                                                                        )}
                                                                    </td>
                                                                    <td>{item.unit}</td>
                                                                    <td>
                                                                        {isEditing ? (
                                                                            <div>
                                                                                <Button onClick={() => handleUpdateSave(group.groupId, index, item)}>
                                                                                    <LuSave />
                                                                                </Button>

                                                                                <Button variant="danger" onClick={() => cancelEditRow(group.groupId, index)}>
                                                                                    <MdOutlineCancel />
                                                                                </Button>
                                                                            </div>
                                                                        ) : (
                                                                            <Button variant="outline-primary">
                                                                                <GrUpdate
                                                                                    onClick={() => handleEditRow(group.groupId, index, item)}/>
                                                                            </Button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                        </tbody>

                                                    </Table>
                                                    <div>
                                                        <Button>+</Button>
                                                    </div>
                                                    <div className={style.footCard}>
                                                        <Button className={`btn btn-danger`}>Cancel</Button>
                                                    </div>

                                                </>
                                            }
                                        </Card.Body>
                                    </Card>
                                ))

                            ) : (
                                <p className="text-center">No groups available</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-center">No request detail</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button className={`btn btn-danger`} onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>

    );
}

export default ImportRequest;
