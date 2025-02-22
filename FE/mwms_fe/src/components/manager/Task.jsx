import style from '../../styles/manager/TaskPage.module.css'
import {Button, Modal, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {getStaffList} from "../../services/StaffService.js";
import {getTaskList} from "../../services/TaskService.js";
import {SearchBarHasSelector} from "../ui/SearchBarHasSelector.jsx";

/* eslint-disable react/prop-types */
function GenerateTable() {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState({
        value: "",
        name: true,
        code: false
    });

    function HandleKeyword(keyword, type){
        setSearch(
            {
                ...search,
                value: keyword,
                name: type === "name",
                code: type === "code"
            }
        );
    }

    const prop = {
        mainWidth: (0.9 * 83),
        mainMarginBottom: 2,
        mainMarginTop: 1,
        searchFunc: HandleKeyword,
        height: 5,
        // searchInputParams: {
        //     grow: 5,
        //     mr: 2,
        //     ph: "Enter keyword to search...",
        // },
        // searchSelectorParams: {
        //     value: ["name", "code"],
        //     grow: 1,
        //     mr: 0,
        // }
        ph: "Enter keyword..."
    }

    useEffect(() => {
        async function fetchTasks() {
            return await getTaskList();
        }

        fetchTasks().then(res => setTasks(res.data));
    }, [])

    return (
        <>
            <SearchBarHasSelector {...prop}/>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Assigned date</th>
                    <th>Staff</th>
                </tr>
                </thead>
                <tbody>
                {
                    tasks.filter(
                        task => search.name ?
                            task.name.toLowerCase().includes(search.value)
                            :
                            task.code.toLowerCase().includes(search.value)
                    ).map((task, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{task.code}</td>
                                <td>{task.name}</td>
                                <td>{task.desc}</td>
                                <td>{task.status}</td>
                                <td>{task.assigned}</td>
                                <td>{task.staff}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </Table>
        </>
    )
}

function GenerateRequestViewModal({modalVisible, setModalVisible}) {
    const [staffs, setStaffs] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect( () => {
        async function getStaffs() {
            return await getStaffList()
        }

        getStaffs().then(data => setStaffs(data));

    }, []);

    useEffect(() => {
        async function getTasks(){
            return await getTaskList()
        }

        getTasks().then(data => setTasks(data.data));
    }, [])

    return (
        <Modal show={modalVisible} onHide={() => setModalVisible(false)} size={"lg"} centered>
            <Modal.Header closeButton>
                <Modal.Title>Request List</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover className={style.detail}>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Assigned to</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.map((task, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{task.code}</td>
                            <td>{task.name}</td>
                            <td>{task.assigned}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <div className={style.save_btn}>
                    <Button variant={"success"}>Save</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default function Task() {
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