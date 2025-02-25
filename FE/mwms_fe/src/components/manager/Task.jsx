import style from '../../styles/manager/Task.module.css'
import {Accordion, Button, Modal, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {getTaskList} from "../../services/TaskService.js";
import {SearchBarHasSelector} from "../ui/SearchBarHasSelector.jsx";
import {getUnAssignedItemGroup} from "../../services/ManagerService.js";

/* eslint-disable react/prop-types */
function GenerateTable() {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState({
        value: "",
        name: true,
        code: false
    });

    function HandleKeyword(keyword, type) {
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
        searchInputParams: {
            grow: 5,
            mr: 2,
            ph: "Enter keyword to search...",
        },
        searchSelectorParams: {
            value: ["name", "code"],
            grow: 1,
            mr: 0,
        }
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

function GenerateUnassignedGroupModal({modalVisible, setModalVisible}) {
    const [groups, setGroups] = useState([])
    const [detailModalVisible, setDetailModalVisible] = useState(false)
    const [currentGrp, setCurrentGrp] = useState({
        data: null,
        index: 0
    })

    useEffect(() => {
        async function fetchUnassignedGroup() {
            try {
                return await getUnAssignedItemGroup()
            } catch (err) {
                if (err.response) {
                    alert(err.response.data.message)
                }
            }
        }

        fetchUnassignedGroup().then(res => {
            setGroups(res.data)
        })
    }, [])

    function RenderGroupModal() {
        return (
            <Modal show={modalVisible} onHide={() => setModalVisible(false)} size={"xl"} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Group List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover className={style.group_table}>
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Item Amount</th>
                            <th>Partner</th>
                            <th>Delivery Date</th>
                            <th>Carrier Name</th>
                            <th>Carrier Phone</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            groups.map((group, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{group.items.length + " " + group.items[0].unit}</td>
                                    <td>{group.partner}</td>
                                    <td>{group.delivery}</td>
                                    <td>{group.cName}</td>
                                    <td>{group.cPhone}</td>
                                    <td><Button variant={"success"} onClick={() => {
                                        setDetailModalVisible(true)
                                        setCurrentGrp({
                                            ...currentGrp,
                                            data: group,
                                            index: index
                                        })
                                    }}>View and assign staff</Button></td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </Table>
                    <div className={style.save_btn}>
                        <Button variant={"success"} onClick={() => setModalVisible(false)}>Finish</Button>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }

    function RenderDetailModal() {

        return (
            <Modal show={detailModalVisible} backdrop={"static"} keyboard={false} size={"lg"} centered>
                <Modal.Header>
                    <Modal.Title>{currentGrp.data.request.type + " Group Detail"}</Modal.Title>
                </Modal.Header>
                <Modal.Body className={style.detail}>
                    <h5><span>No: </span>{currentGrp.index + 1}</h5>
                    <h5><span>Partner: </span>{currentGrp.data.partner}</h5>
                    <h5><span>Delivery date: </span>{currentGrp.data.delivery}</h5>
                    <h5><span>Carrier name: </span>{currentGrp.data.cName}</h5>
                    <h5><span>Carrier phone: </span>{currentGrp.data.cPhone}</h5>
                    <h5><span>Type: </span>{currentGrp.data.request.type}</h5>
                    <h5><span>Status: </span>{currentGrp.data.request.status}</h5>
                    <h5>
                        <span>Staff: </span>
                        <select>
                            <option>A</option>
                            <option>B</option>
                        </select>
                    </h5>
                    <Accordion>
                        <Accordion.Item eventKey={"1"}>
                            <Accordion.Header>
                                Request Data
                            </Accordion.Header>
                            <Accordion.Body>
                                <h6><span>Code: </span>{currentGrp.data.request.code}</h6>
                                <h6><span>Requested date: </span>{currentGrp.data.request.requestDate}</h6>
                                <h6><span>Modified date: </span>{currentGrp.data.request.lastModified}</h6>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey={"2"}>
                            <Accordion.Header>
                                Batches Data
                            </Accordion.Header>
                            <Accordion.Body>
                                <Accordion>
                                    {
                                        currentGrp.data.items.map((item, index) => (
                                            <Accordion.Item key={index} eventKey={"2." + (index + 1)}>
                                                <Accordion.Header>
                                                    {item.equipment + " - " + item.category}
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    <h6><span>Quantity: </span>{item.quantity + " " + item.unit}</h6>
                                                    <h6>
                                                        <span>Price: </span>{item.price > 0 ? "$" + item.price : "Not yet set"}
                                                    </h6>
                                                    <h6><span>Batch length: </span>{item.length + "m"}</h6>
                                                    <h6><span>Batch width: </span>{item.width + "m"}</h6>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))
                                    }
                                </Accordion>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={"danger"} onClick={() => setDetailModalVisible(false)}>Back</Button>
                    <Button variant={"success"}>Save</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    return (
        <>
            {detailModalVisible && currentGrp.data ?
                <RenderDetailModal/> : <RenderGroupModal/>
            }
        </>
    )
}

export default function Task() {
    const [modalVisible, setModalVisible] = useState(false);
    const [assignedGrpSize, setAssignedGrpSize] = useState(0);

    useEffect(() => {
        async function loadGrp() {
            return await getUnAssignedItemGroup();
        }

        loadGrp().then(res => setAssignedGrpSize(res.data.length));
    }, [])


    return (
        <div className={style.main}>
            <h1 className={style.title}>Task</h1>
            {assignedGrpSize > 0 &&
                <div className={style.alert}>
                    <p>There are requests not yet be assigned.&nbsp;<span
                        onClick={() => setModalVisible(true)}>Assign now</span></p>
                </div>
            }
            <div className={style.table_container}>
                <GenerateTable/>
            </div>
            {modalVisible &&
                <GenerateUnassignedGroupModal modalVisible={modalVisible} setModalVisible={setModalVisible}/>}

        </div>
    )
}