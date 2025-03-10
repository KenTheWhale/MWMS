import {Button, Form, Table} from "react-bootstrap";
import style from "../../styles/partner/Request.module.css";
import {useEffect, useState} from "react";
import RequestPopup from "../popup/RequestPopup.jsx";
import {getSupplierRequestList} from "../../services/ManagerService.jsx";

function Request() {
    const [requests, setRequest] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchData() {
            let username = JSON.parse(localStorage.getItem('user')).name;
            const response = await getSupplierRequestList(username);
            return response.data;
        }

        fetchData().then((data) => {
            setRequest(data);
        });
    }, []);

    const handleRowClick = (request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    const handleAcceptClick = (request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    const handleRejectClick = (request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    return (
        <div className={style.main}>
            <div className={style.title_area}>
                <label className={`fs-1`}>Warehouse Request</label>
            </div>
            <div className={style.search_area}>
                <div className={style.search_input}>
                    <Form.Group controlId="formGridSearch">
                        <Form.Control type="email" placeholder="Enter warehouse name..."/>
                    </Form.Group>
                </div>
                <div className={style.search_button}>
                    <Button variant="primary" type="submit" style={{width: "100%"}}>
                        Search
                    </Button>
                </div>
            </div>
            <div className={style.table_area}>
                <Table striped bordered hover variant={`lightcyan`} onClick={(e) => {
                    const row = e.nativeEvent.target.closest('tr');
                    if (row && requests[row.rowIndex - 1]) {
                        handleRowClick(requests[row.rowIndex - 1]);
                    }
                }}>
                    <thead>
                    <tr>
                        <th>No.</th>
                        <th>Code</th>
                        <th>Request Date</th>
                        <th>Last Modified Date</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {requests.map((request, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{request.code}</td>
                            <td>{request.requestDate}</td>
                            <td>{request.lastModifiedDate}</td>
                            <td>{request.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
            <RequestPopup
                request={selectedRequest}
                show={showModal}
                handleClose={handleCloseModal}
                onAccept={handleAcceptClick}
                onReject={handleRejectClick}
                setRequest={setRequest}/>
        </div>
    );
}

export default Request;