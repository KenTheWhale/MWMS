import {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import style from '../../styles/ImportRequest.module.css'
import {BsFilter} from "react-icons/bs";
import {getImportRequest, viewRequestDetail} from "../../services/RequestService.js";

/* eslint-disable react/prop-types */
function ImportRequest() {

    const [requestList, setRequestList] = useState([]);
    const [filterDate, setFilterDate] = useState("");
    const [modalMode, setModalMode] = useState("add");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [show, setShow] = useState(false);
    const [newRequest, setNewRequest] = useState({
        code: "",
        requestDate: "",
        deliveryDate: "",
        lastModifiedDate: "",
        status: "Pending",
        detail: "",
        requestItem: []
    });


    useEffect(() => {
        async function fetchData() {
            return await getImportRequest();
        }

        fetchData().then((response) => {
            setRequestList(response)
        });
    }, []);

    const handleDateChange = (event) => {
        setFilterDate(event.target.value);
    };

    const handleViewDetail = async (code, request) => {
            setModalMode("view")
            setSelectedRequest(request);
            setShow(true)

        const requestDetail = await viewRequestDetail(code);
        console.log(requestDetail);
    }

    const handleAddShow = () => {
        setNewRequest(
            {
                code: "",
                requestDate: "",
                deliveryDate: "",
                status: "Pending",
                detail: "",
                requestItem: []
            }
        )
        setModalMode("add")
        setShow(true)
    };

    const handleClose = () => setShow(false);


    return (
        <div className={`container-fluid`}>
            <div className={`row`}>
                <h1 className={`d-flex justify-content-center text-light`}>Import Request</h1>
            </div>
            <div className={`row`}>
                <div className="col-12 d-flex justify-content-end align-items-center gap-2">
                    <label className={`text-light`}>RequestDate : </label>
                    <input type="date"
                           className="form-control w-auto"
                           onChange={handleDateChange}
                           value={filterDate}/>
                    <button className="btn btn-outline-light">
                        <BsFilter size={20}/>
                    </button>
                    <Button className={`${style.addRequestBtn}`}>Add Request</Button>
                </div>
            </div>
            <div className={`row`}>
                <div className={`${style.importTable}`}>
                    <table>
                        <thead>
                        <tr>
                            <th>Code</th>
                            <th>Request Date</th>
                            <th>Delivery Date</th>
                            <th>Last Modified</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            requestList.filter(item => item.requestDate.includes(filterDate))
                                .map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.code}</td>
                                        <td>{item.requestDate}</td>
                                        <td>{item.deliveryDate}</td>
                                        <td>{item.lastModifiedDate}</td>
                                        <td>{item.status}</td>
                                        <td><Button onClick={() => handleViewDetail(item.code, item)}>View Detail</Button>
                                        </td>
                                    </tr>
                                ))
                        }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={`container-fluid`}>
                <Modal
                    size={`xl`}
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}>
                    <Modal.Header closeButton>
                        {
                            modalMode === "add" ? (
                                <Modal.Title>Request application</Modal.Title>
                            ) : (
                                <Modal.Title>Detail</Modal.Title>
                            )
                        }
                    </Modal.Header>
                    <Modal.Body className={``}>
                        <div>
                            {
                                modalMode === "add" ? (
                                    <div>
                                        <table className="table">
                                            <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Description</th>
                                                <th>Quantity</th>
                                                <th>Partner</th>
                                                <th></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {

                                            }
                                            </tbody>
                                        </table>
                                        <button>+</button>
                                    </div>
                                ) : (
                                    <div>
                                        {
                                            selectedRequest !== null ? (
                                                <div>
                                                    <h5>Request Code: {selectedRequest.code}</h5>
                                                    <h6>Status: {selectedRequest.status}</h6>
                                                    <h6>Request Date: {selectedRequest.requestDate}</h6>
                                                    <h6>Delivery Date: {selectedRequest.deliveryDate}</h6>
                                                </div>
                                            ) : (
                                                <p> no request detail</p>
                                            )
                                        }

                                        <div>
                                            <table className="table">
                                                <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Description</th>
                                                    <th>Quantity</th>
                                                    <th>Partner</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    "requestItem" in selectedRequest ? selectedRequest.requestItem.map(
                                                        (item, index) => (
                                                            <tr key={index}>
                                                                <td>{item.name}</td>
                                                                <td>{item.description}</td>
                                                                <td>{item.quantity}</td>
                                                                <td>{item.partner}</td>
                                                            </tr>
                                                        )
                                                    ) : (
                                                        <>Not have item in request</>
                                                    )
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )
                            }
                        < /div>
                    </Modal.Body>

                    <Modal.Footer>
                        {
                            modalMode === "add" ? (
                                <div>
                                    <Button variant="secondary"
                                            onClick={handleClose}
                                            className={`ms-2`}>
                                        Close
                                    </Button>
                                    <Button variant="primary"
                                            className={`ms-2`}>submit</Button>
                                </div>
                            ) : (
                                selectedRequest.status === "Pending" ? (
                                    <div>
                                        <Button variant="danger"
                                                > Cancel</Button>
                                        <Button variant="secondary"
                                                onClick={handleClose}
                                                className={`ms-2`}>
                                            Close
                                        </Button>
                                    </div>
                                ) : (
                                    <div>
                                        <Button variant="secondary" onClick={handleClose}>
                                            Close
                                        </Button>
                                    </div>
                                )
                            )
                        }
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

export default ImportRequest;