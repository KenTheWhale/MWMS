import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import style from "../../styles/manager/ExportRequest.module.css";
import {BsFilter} from "react-icons/bs";
import {filterRequest, getExportRequest, getImportRequest} from "../../services/RequestService.js";
import {IoReload} from "react-icons/io5";

function ExportRequest() {
    const [requestList, setRequestList] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [filterDate, setFilterDate] = useState("");


    useEffect(() => {
        async function fetchData() {
            const response = await getExportRequest();

            if (response.error) {
                setErrorMessage(response.error);
                setRequestList([]);
            } else {
                setErrorMessage("");
                setRequestList(response);
            }
        }

        fetchData()
    }, [refreshTrigger]);

    const handleDateChange = (event) => {
        setFilterDate(event.target.value);
    };

    const handleFilter = async () => {
        if (!filterDate) {
            setErrorMessage("Please select a date.");
            return;
        }

        const response = await filterRequest(filterDate);
        if (response.error) {
            setErrorMessage(response.error);
            setRequestList([]);
        } else {
            setErrorMessage("");
            setRequestList(response);
        }
    };

    const refreshData = () => setRefreshTrigger(prev => prev + 1);
    return (
        <div className={`container-fluid`}>
            <div className={`row`}>
                <h1 className={`d-flex justify-content-center text-light`}>Export Request</h1>
            </div>
            <div className={`row`}>
                <div className="col-12 d-flex justify-content-end align-items-center gap-2">
                    <label className={`text-light`}>RequestDate : </label>
                    <input type="date"
                           className="form-control w-auto"
                           onChange={handleDateChange}
                           value={filterDate}/>
                    <button className="btn btn-outline-light"
                            onClick={handleFilter}>
                        <BsFilter size={20}/>
                    </button>
                    <button className="btn btn-info"
                            onClick={() => window.location.reload()}>
                        <IoReload size={20}/>
                    </button>
                </div>
            </div>
            <div className={`row`}>
                <div className={`${style.exportTable}`}>
                    {
                        errorMessage ? (
                            <div className="alert alert-danger text-center">{errorMessage}</div>
                        ) : (
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
                                    requestList.map((request, index) => (
                                        <tr key={index}>
                                            <td>{request.code}</td>
                                            <td>{request.requestDate}</td>
                                            <td>{request.deliveryDate}</td>
                                            <td>{request.lastModifiedDate}</td>
                                            <td>{request.status}</td>
                                            <td><Button>View Detail</Button></td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ExportRequest;