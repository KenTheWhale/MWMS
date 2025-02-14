import style from '../../styles/manager/TaskPage.module.css'
import {Button, Form, Modal, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {url} from "../../config/AxiosConfig.js";

/* eslint-disable react/prop-types */
function GenerateTable() {
    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>No</th>
                <th>Code</th>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Assigned date</th>
            </tr>
            </thead>
            <tbody>
            {
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num, index) => {
                    return (
                        <tr key={index}>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                        </tr>
                    )
                })
            }
            </tbody>
        </Table>
    )
}

function GenerateRequestViewModal({modalVisible, setModalVisible}) {
    const [staffs, setStaffs] = useState([]);

    useEffect(() => {
        url.get("/manager/staff/list", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiTUFOQUdFUiIsInN1YiI6Im1hbmFnZXIiLCJpYXQiOjE3MzkzNDMxMTAsImV4cCI6MTczOTM1MzkxMH0.F741pLrBCKeD9aX4g6iT4egrh7K1GxxxSN2_o_psc2HnKyUTItBycZwrXSteEw6WNkJktdiCXBU2eoDeptsQhQ`
            }
        }).then(res => {
            setStaffs(res.data.data);
        }).catch(err => {
            console.log(err.response.status);
        });
    }, []);

    return (
        <Modal show={modalVisible} onHide={() => setModalVisible(false)} size={"lg"} centered>
            <Modal.Header closeButton>
                <Modal.Title>Request List</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Assigned to</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>
                            <Form.Select>
                                <option disabled selected>Select a staff...</option>
                                {staffs.map((staff, index) => (
                                    <option key={index} value={staff.username}>{staff.username}</option>
                                ))}
                            </Form.Select>
                        </td>
                    </tr>
                    </tbody>
                </Table>
                <div className={style.save_btn}>
                    <Button variant={"success"}>Save</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default function TaskPage() {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <div className={style.main}>
            <h1 className={style.title}>Task</h1>
            <div className={style.alert}>
                <p>There are requests not yet be assigned.&nbsp;<span
                    onClick={() => setModalVisible(true)}>Assign now</span></p>
            </div>
            <div className={style.table_container}>
                <GenerateTable/>
            </div>
            {modalVisible && <GenerateRequestViewModal modalVisible={modalVisible} setModalVisible={setModalVisible}/>}

        </div>
    )
}