import {useState} from "react";
import style from "../../styles/Batch.module.css";
import {Button} from "react-bootstrap";

function BatchManagePage() {
    const [batchList, setBatchList] = useState([
        {
            code: "BA1",
            equipmentName: "Thermometer",
            batchQuantity: 10,
            createDate: "2025-01-05",
            updateDate: "2025-05-05",
        }, {
            code: "BA2",
            equipmentName: "Syringe",
            batchQuantity: 5,
            createDate: "2025-01-05",
            updateDate: "2025-05-05",
        }, {
            code: "BA3",
            equipmentName: "Blood Pressure Monitor",
            batchQuantity: 10,
            createDate: "2025-01-05",
            updateDate: "2025-05-05",
        },
        {
            code: "BA4",
            equipmentName: "Pulse Oximetry",
            batchQuantity: 10,
            createDate: "2025-01-05",
            updateDate: "2025-05-05",
        },
        {
            code: "BA5",
            equipmentName: "Syringe",
            batchQuantity: 2,
            createDate: "2025-01-05",
            updateDate: "2025-05-05",
        }
    ]);
    return (
        <div className={`container-fluid`}>
            <div className={`row`}>
                <h1 className={`d-flex justify-content-center text-light`}>Batch</h1>
            </div>
            <div className={`row`}>
                <div className={`col-md-12`}>
                    <input className={`${style.inputField}`} type={"text"} placeholder={"Enter Equipment name..."}/>
                    <Button className={`${style.searchBtn}`}>Search</Button>
                </div>

            </div>
            <div className={`row`}>
                <table className={`${style.batchTable}`}>
                    <thead>
                    <tr>
                        <th>Code</th>
                        <th>Equipment Name</th>
                        <th>Batch Quantity</th>
                        <th>Create Date</th>
                        <th>Update Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        batchList.map((batch, index) => (
                            <tr key={index}>
                                <td>{batch.code}</td>
                                <td>{batch.equipmentName}</td>
                                <td>{batch.batchQuantity}</td>
                                <td>{batch.createDate}</td>
                                <td>{batch.updateDate}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default BatchManagePage;