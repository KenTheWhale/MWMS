import {Button, Form, Table} from "react-bootstrap";
import style from "../../styles/partner/Request.module.css";
import {useEffect, useState} from "react";
import RequestPopup from "../popup/RequestPopup.jsx";
import {FaCheck} from "react-icons/fa";
import {FaX} from "react-icons/fa6";
import {getSupplierRequestList} from "../../services/RequestService.js";

function Request() {

    const [requests, setRequest] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchData() {
            let username = localStorage.getItem('username');
            return await getSupplierRequestList(username);
        }
        fetchData().then((data) => {
            setRequest(data);
        });
    }, [requests]);

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

    const handleAddClick = () => {
        setSelectedRequest(null);
        setShowModal(true);
    }

    return (
        <div className={style.main}>
            <div className={style.title_area}>
                <h1 className={`text-light`}>Request</h1>
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
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/*{requests.map((request, index) => (*/}
                    {/*    <tr key={index}>*/}
                    {/*        <td>{index + 1}</td>*/}
                    {/*        <td>{request.code}</td>*/}
                    {/*        <td>{request.requestDate}</td>*/}
                    {/*        <td>{request.lastModifiedDate}</td>*/}
                    {/*        <td>{request.status}</td>*/}
                    {/*        <td>*/}
                    {/*            <Button variant="warning"*/}
                    {/*                    onClick={(e) => {*/}
                    {/*                        e.stopPropagation();*/}
                    {/*                        handleAcceptClick(request);*/}
                    {/*                    }}>*/}
                    {/*                <FaCheck/>*/}
                    {/*            </Button>*/}
                    {/*            <Button variant="danger"*/}
                    {/*                    onClick={(e) => {*/}
                    {/*                        e.stopPropagation();*/}
                    {/*                        handleRejectClick(request);*/}
                    {/*                    }}>*/}
                    {/*                <FaX/>*/}
                    {/*            </Button>*/}
                    {/*        </td>*/}
                    {/*    </tr>*/}
                    {/*))}*/}
                    </tbody>
                </Table>
            </div>
            <RequestPopup
                request={selectedRequest}
                show={showModal}
                handleClose={handleCloseModal}
                onAccept={handleAcceptClick}
                onReject={handleRejectClick}/>
        </div>
    );
}

export default Request;