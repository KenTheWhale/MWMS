import { useEffect, useState, useCallback } from "react";
import { Button, Modal, Table, Card } from "react-bootstrap";
import style from "../../styles/manager/ImportRequest.module.css";
import { BsFilter } from "react-icons/bs";
import { getImportRequest, viewDetail } from "../../services/RequestService.js";
import {FaSearch} from "react-icons/fa";

function ImportRequest() {
    const [requestList, setRequestList] = useState([]);
    const [filterDate, setFilterDate] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [show, setShow] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState({});

    // Lấy danh sách Import Request
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getImportRequest();
                setRequestList(response.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách request:", error);
            }
        }
        fetchData();
    }, []);

    const handleViewDetail = useCallback(async (code) => {
        try {
            const response = await viewDetail(code);
            setSelectedRequest(response.data);
            setShow(true);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết request:", error);
        }
    }, []);

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
                    <Button className={style.addRequestBtn}>Add Request</Button>
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
                            .map((item, index) => (
                                <tr key={index}>
                                    <td>{item.code}</td>
                                    <td>{item.requestDate}</td>
                                    <td>{item.lastModifiedDate}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <Button onClick={() => handleViewDetail(item.code)}>View Detail</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

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
                                                    <FaSearch /> View
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
            </Modal>
        </div>
    );
}

export default ImportRequest;
