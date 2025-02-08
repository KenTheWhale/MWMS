import {useState} from "react";
import {Button} from "react-bootstrap";
import style from '../../styles/ImportRequest.module.css'
import { BsFilter } from "react-icons/bs";

function ImportRequestPage() {

    function handleViewDetail(request){
        alert("Import Request Detail");
    }

    const [requestList, setRequestList] = useState([
        {
            code: "RE1",
            requestDate: "2025-01-01",
            deliveryDate: "2025-01-05",
            status: "Pending",
            detail: "Detail 1",
            type: "import",
            requestItem: [
                {name: "Blood Pressure Monitor", description: "Máy đo huyết áp tự động", quantity: 1},
                {name: "Pulse Oximeter", description: "Thiết bị đo nồng độ oxy trong máu", quantity: 3},
                {name: "Thermometer", description: "Thiết bị đo nhiệt độ cơ thể", quantity: 4}
            ]
        },
        {
            code: "RE2",
            requestDate: "2025-01-02",
            deliveryDate: "2025-01-06",
            status: "Approved",
            detail: "Detail 2",
            type: "import",
            requestItem: [
                {name: "Blood Pressure Monitor", description: "Máy đo huyết áp tự động", quantity: 1},
                {name: "Pulse Oximeter", description: "Thiết bị đo nồng độ oxy trong máu", quantity: 3},
                {name: "Thermometer", description: "Thiết bị đo nhiệt độ cơ thể", quantity: 4}
            ]
        },
        {
            code: "RE3",
            requestDate: "2025-01-03",
            deliveryDate: "2025-01-07",
            status: "Rejected",
            detail: "Detail 3",
            type: "import",
            requestItem: [
                {name: "Stethoscope", description: "Ống nghe y tế dùng để kiểm tra nhịp tim", quantity: 2},
                {name: "Syringe", description: "Kim tiêm dùng một lần", quantity: 10},
                {name: "Pulse Oximeter", description: "Thiết bị đo nồng độ oxy trong máu", quantity: 1}
            ]
        },
        {
            code: "RE4",
            requestDate: "2025-01-04",
            deliveryDate: "2025-01-08",
            status: "Pending",
            detail: "Detail 4",
            type: "import",
            requestItem: [
                {name: "Thermometer", description: "Thiết bị đo nhiệt độ cơ thể", quantity: 2},
                {name: "Stethoscope", description: "Ống nghe y tế dùng để kiểm tra nhịp tim", quantity: 1},
                {name: "Syringe", description: "Kim tiêm dùng một lần", quantity: 5}
            ]
        },
        {
            code: "RE5",
            requestDate: "2025-01-05",
            deliveryDate: "2025-01-09",
            status: "Approved",
            detail: "Detail 5",
            type: "import",
            requestItem: [
                {name: "Blood Pressure Monitor", description: "Máy đo huyết áp tự động", quantity: 1},
                {name: "Pulse Oximeter", description: "Thiết bị đo nồng độ oxy trong máu", quantity: 3},
                {name: "Thermometer", description: "Thiết bị đo nhiệt độ cơ thể", quantity: 4}
            ]
        },
        {
            code: "RE6",
            requestDate: "2025-01-06",
            deliveryDate: "2025-01-10",
            status: "Pending",
            detail: "Detail 6",
            type: "export",
            requestItem: [
                { name: "Syringe", description: "Kim tiêm dùng một lần", quantity: 8 },
                { name: "Stethoscope", description: "Ống nghe y tế dùng để kiểm tra nhịp tim", quantity: 2 }
            ]
        },
        {
            code: "RE7",
            requestDate: "2025-01-07",
            deliveryDate: "2025-01-11",
            status: "Approved",
            detail: "Detail 7",
            type: "export",
            requestItem: [
                { name: "Pulse Oximeter", description: "Thiết bị đo nồng độ oxy trong máu", quantity: 5 },
                { name: "Thermometer", description: "Thiết bị đo nhiệt độ cơ thể", quantity: 2 }
            ]
        },
        {
            code: "RE8",
            requestDate: "2025-01-08",
            deliveryDate: "2025-01-12",
            status: "Rejected",
            detail: "Detail 8",
            type: "export",
            requestItem: [
                { name: "Blood Pressure Monitor", description: "Máy đo huyết áp tự động", quantity: 1 },
                { name: "Stethoscope", description: "Ống nghe y tế dùng để kiểm tra nhịp tim", quantity: 3 }
            ]
        },
        {
            code: "RE9",
            requestDate: "2025-01-09",
            deliveryDate: "2025-01-13",
            status: "Pending",
            detail: "Detail 9",
            type: "export",
            requestItem: [
                { name: "Syringe", description: "Kim tiêm dùng một lần", quantity: 15 },
                { name: "Thermometer", description: "Thiết bị đo nhiệt độ cơ thể", quantity: 5 }
            ]
        },
        {
            code: "RE10",
            requestDate: "2025-01-10",
            deliveryDate: "2025-01-14",
            status: "Approved",
            detail: "Detail 10",
            type: "export",
            requestItem: [
                { name: "Pulse Oximeter", description: "Thiết bị đo nồng độ oxy trong máu", quantity: 4 },
                { name: "Stethoscope", description: "Ống nghe y tế dùng để kiểm tra nhịp tim", quantity: 2 }
            ]
        }

    ]);
    return (
        <div className={`container-fluid`}>
            <div className={`row`}>
                <h1 className={`d-flex justify-content-center text-light`}>Import Request</h1>
            </div>
            <div className={`row`}>
                <div className="col-12 d-flex justify-content-end align-items-center gap-2">
                    <label className={`text-light`}>RequestDate : </label>
                    <input type="date" className="form-control w-auto"/>
                    <button  className="btn btn-outline-light">
                        <BsFilter size={20}/>
                    </button>
                    <Button className={`${style.addRequestBtn}`}>Add Request</Button>
                </div>
            </div>
            <div className={`row`}>
                <table className={`${style.importTable}  `}>
                    <thead>
                    <tr>
                        <th scope="col">Code</th>
                        <th scope="col">Request Date</th>
                        <th scope="col">Delivery Date</th>
                        <th scope="col">Status</th>
                        <th scope="col"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        requestList
                            .filter(request => request.type === "import")
                            .map((item, index) => (
                                <tr key={index}>
                                    <td>{item.code}</td>
                                    <td>{item.requestDate}</td>
                                    <td>{item.deliveryDate}</td>
                                    <td>{item.status}</td>
                                    <td><Button onClick={() => handleViewDetail(item)}>View Detail</Button></td>
                                </tr>
                            ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ImportRequestPage;