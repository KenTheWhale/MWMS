import {useEffect, useState} from "react";
import {Button, Card, Form, Modal, Table} from "react-bootstrap";
import style from "../../styles/manager/ImportRequest.module.css";
import {
    createRequestApplication,
    getImportRequest,
    getSupplierEquipment,
    getSupplierList,
    viewDetail
} from "../../services/RequestService.js";
import {FaSearch} from "react-icons/fa";
import {GrView} from "react-icons/gr";
import {CgAddR} from "react-icons/cg";
import {axiosClient} from "../../config/api.jsx";

function ImportRequest() {
    const [requestList, setRequestList] = useState([]);
    const [filterDate, setFilterDate] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [show, setShow] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState({});
    const [showAddCard, setShowAddCard] = useState(false);
    const [partners, setPartners] = useState([]);
    const [equipments, setEquipments] = useState([]);
    const [rows, setRows] = useState([{name: "", description: "", quantity: "", unit: ""}]);


    const [newRequest, setNewRequest] = useState({
        partnerId: "",
        equipmentId: "",
        description: "",
        quantity: 1,
        unit: "",
    });

    useEffect(() => {
        async function fetchData() {
            const response = await getImportRequest();
            setRequestList(response.data || []);
        }

        fetchData();
    }, []);

    const handleViewDetail = async (code) => {
        const response = await viewDetail(code);
        setSelectedRequest(response.data);
        setShow(true);
    };

    const toggleGroup = (groupId) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupId]: !prev[groupId],
        }));
    };

    const handleDateChange = (event) => {
        setFilterDate(event.target.value);
    };

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
            const requestItems = rows.map(row => ({
                equipmentId: equipments.find(e => e.name === row.name)?.id,
                partnerId: row.partner,
                quantity: parseInt(row.quantity, 10),
            }))
            const response = createRequestApplication(requestItems);
            return response.message;
        }

        createRequest();
        setShowAddCard(false);
        window.location.reload();
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <h1 className="d-flex justify-content-center text-light">Import Request</h1>
            </div>

            <div className="row">
                <div className="col-12 d-flex justify-content-end align-items-center gap-2">
                    <label className="text-light">Request Date: </label>
                    <input
                        type="date"
                        className="form-control w-auto"
                        onChange={handleDateChange}
                        value={filterDate}
                    />
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
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {requestList
                            .filter((item) => item.requestDate.includes(filterDate))
                            .reverse()
                            .map((item, index) => (
                                <tr key={index}>
                                    <td>{item.code}</td>
                                    <td>{item.requestDate}</td>
                                    <td>{item.lastModifiedDate}</td>
                                    <td>{item.status}</td>
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
                    <Card.Body>
                        <h3>Add New Request Items</h3>
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
                                                     onChange={(e) => handleInputRow(index, "partner", e.target.value)}>
                                            <option value="">Select Partner</option>
                                            {partners.map((partner) => (
                                                <option key={partner.partnerId} value={partner.partnerId}>
                                                    {partner.partnerName}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </td>

                                    <td>
                                        <Form.Select
                                            className="m-2"
                                            value={row.name}
                                            onChange={(e) => handleInputRow(index, "name", e.target.value)}
                                        >
                                            <option value="">Select Equipment</option>
                                            {equipments.map((equipment) => (
                                                <option key={equipment.id} value={equipment.name}>
                                                    {equipment.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </td>

                                    <td>
                                        <Form.Control
                                            className="m-2"
                                            type="text"
                                            value={row.description}
                                            readOnly
                                        >{equipments.description}</Form.Control>
                                    </td>

                                    <td>
                                        <Form.Control
                                            className="m-2"
                                            type="number"
                                            min="1"
                                            value={row.quantity}
                                            onChange={(e) => handleInputRow(index, "quantity", e.target.value)}
                                        />
                                    </td>

                                    <td>
                                        <Form.Control
                                            className="m-2"
                                            type="text"
                                            value={row.unit}
                                            readOnly
                                        >{equipments.unit}</Form.Control>
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
                    </Card.Body>
                    <Card.Footer>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </Card.Footer>
                </Card>
            )}


            <Modal
                size="xl"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}

            >
                <Modal.Header closeButton>
                    <Modal.Title>Request Detail - {selectedRequest?.code}</Modal.Title>
                </Modal.Header>
                <Modal.Body className={style.modalBody}>
                    {selectedRequest ? (
                        <div>
                            <div className="mb-3">
                                <p><strong>Request Date:</strong> {selectedRequest.requestDate}</p>
                                <p><strong>Last Modified:</strong> {selectedRequest.lastModified}</p>
                                <p><strong>Status:</strong> {selectedRequest.status}</p>
                            </div>

                            {selectedRequest.itemGroups && selectedRequest.itemGroups.length > 0 ? (
                                selectedRequest.itemGroups.map((group) => (
                                    <Card key={group.groupId} className="mb-3">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <Card.Title>
                                                    {group.partner} - {group.carrierName}
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
                                                Carrier Phone: {group.carrierPhone}
                                            </Card.Subtitle>
                                            <Card.Text>Delivery Date: {group.deliveryDate}</Card.Text>

                                            {expandedGroups[group.groupId] && (
                                                <Table striped bordered hover className="mt-3 table">
                                                    <thead>
                                                    <tr>
                                                        <th>Equipment Name</th>
                                                        <th>Description</th>
                                                        <th>Quantity</th>
                                                        <th>Unit</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {group.requestItems.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item.equipmentName}</td>
                                                            <td>{item.equipmentDescription}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>{item.unit}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </Table>
                                            )}
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
                    <Button>Update</Button>
                    <Button className={`btn btn-danger`} onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ImportRequest;
