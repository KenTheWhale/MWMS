import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import style from '../../styles/manager/ImportRequest.module.css'
import {BsFilter} from "react-icons/bs";
import {getImportRequest, viewRequestDetail} from "../../services/RequestService.js";

function ImportRequest() {

    const [requestList, setRequestList] = useState([]);
    const [filterDate, setFilterDate] = useState("");


    useEffect( () => {
        async function fetchData() {
            return await getImportRequest();
        }
        fetchData().then((response) => {setRequestList(response)});
    }, []);

    const handleDateChange = (event) => {
        setFilterDate(event.target.value);
    };

    const handleViewDetail = async (code) => {
        const requestDetail = await viewRequestDetail(code);
        console.log(requestDetail);
    }


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
                                        <td><Button onClick={() => handleViewDetail(item.code)}>View Detail</Button></td>
                                    </tr>
                                ))
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ImportRequest;