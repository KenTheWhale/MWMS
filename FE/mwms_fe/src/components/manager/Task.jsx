import style from '../../styles/manager/Task.module.css'
import {Accordion, Button, Modal, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {getTaskList} from "../../services/TaskService.js";
import {getUnAssignedItemGroup} from "../../services/ManagerService.js";
import {MdOutlineAssignmentInd} from "react-icons/md";
import {getStaffList} from "../../services/StaffService.js";
import {SearchBarNoSelector} from "../ui/SearchBarNoSelector.jsx";
import {InputLabel, MenuItem, OutlinedInput, Select, TextField} from "@mui/material";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";

/* eslint-disable react/prop-types */
function RenderTable({tasks}) {
    const [search, setSearch] = useState({
        value: "",
        code: true
    });

    function HandleKeyword(keyword, type) {
        setSearch(
            {
                ...search,
                value: keyword,
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
        ph: "Enter code to search...",
    }

    return (
        <>
            <SearchBarNoSelector {...prop}/>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Code</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Assigned date</th>
                    <th>Staff</th>
                </tr>
                </thead>
                <tbody>
                {
                    tasks.filter(
                        task => task.code.toLowerCase().includes(search.value)
                    ).map((task, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{task.code}</td>
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

function RenderGroupModal({modalVisible, CloseModal, OpenDetailModal, groups, setGroupFunc}) {

    return (
        <Modal show={modalVisible} onHide={CloseModal} size={"xl"} centered>
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
                        <th>Assign</th>
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
                                    setGroupFunc(group, index)
                                    CloseModal()
                                    OpenDetailModal()
                                }}>
                                    <MdOutlineAssignmentInd/>
                                </Button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </Table>
                <div className={style.save_btn}>
                    <Button variant={"success"} onClick={CloseModal}>Finish</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

function RenderDetailModal({modalVisible, group, staffs}) {
    const [selectedStaff, setSelectedStaff] = useState("")
    const [assignedStaffArea, setAssignedStaffArea] = useState(false)
    // const [selectedDate, setSelectedDate] = useState(new Date())


    return (
        <Modal show={modalVisible} backdrop={"static"} keyboard={false} size={"lg"} centered>
            <Modal.Header>
                <Modal.Title>{"Group Detail"}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={style.detail}>
                <h5>
                    <InputLabel shrink>
                        No
                    </InputLabel>
                    <OutlinedInput
                        id="component-outlined"
                        defaultValue={group.index + 1}
                        readOnly
                        style={{width: '100%'}}
                        size={"small"}
                    />
                </h5>
                <h5>
                    <InputLabel shrink>
                        Partner
                    </InputLabel>
                    <OutlinedInput
                        id="component-outlined"
                        defaultValue={group.data.partner}
                        readOnly
                        style={{width: '100%'}}
                        size={"small"}
                    />
                </h5>
                <h5>
                    <InputLabel shrink>
                        Delivery date
                    </InputLabel>
                    <OutlinedInput
                        id="component-outlined"
                        defaultValue={group.data.delivery}
                        readOnly
                        style={{width: '100%'}}
                        size={"small"}
                    />
                </h5>
                <h5>
                    <InputLabel shrink>
                        Carrier name
                    </InputLabel>
                    <OutlinedInput
                        id="component-outlined"
                        defaultValue={group.data.cName}
                        readOnly
                        style={{width: '100%'}}
                        size={"small"}
                    />
                </h5>
                <h5>
                    <InputLabel shrink>
                        Carrier phone
                    </InputLabel>
                    <OutlinedInput
                        id="component-outlined"
                        defaultValue={group.data.cPhone}
                        readOnly
                        style={{width: '100%'}}
                        size={"small"}
                    />
                </h5>
                <h5>
                    <InputLabel shrink>
                        Type
                    </InputLabel>
                    <OutlinedInput
                        id="component-outlined"
                        defaultValue={group.data.request.type}
                        readOnly
                        style={{width: '100%'}}
                        size={"small"}
                    />
                </h5>
                <h5>
                    <InputLabel shrink>
                        Status
                    </InputLabel>
                    <OutlinedInput
                        id="component-outlined"
                        defaultValue={group.data.request.status}
                        readOnly
                        style={{width: '100%'}}
                        size={"small"}
                    />
                </h5>
                <Button variant={"primary"} onClick={() => setAssignedStaffArea(!assignedStaffArea)}>Assign</Button>
                {
                    assignedStaffArea &&
                    <>
                        <h5>
                            <InputLabel shrink>Staff</InputLabel>
                            <Select
                                value={selectedStaff}
                                onChange={(e) => setSelectedStaff(e.target.value)}
                                autoWidth
                                input={<OutlinedInput/>}
                                displayEmpty
                                className={style.select}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {staffs.map((staff, index) => (
                                    <MenuItem key={index + 1} value={staff.id}>{staff.username}</MenuItem>
                                ))}
                            </Select>
                        </h5>
                        <h5>
                            <InputLabel shrink>Description</InputLabel>
                            <TextField
                                multiline
                                maxRows={4}
                                fullWidth
                                size={"small"}

                            />
                        </h5>
                        <h5>
                            <InputLabel shrink>Assign date</InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    defaultValue={dayjs()} disablePast/>
                            </LocalizationProvider>
                        </h5>
                    </>

                }
                <Accordion>
                    <Accordion.Item eventKey={"1"}>
                        <Accordion.Header>
                            Request Data
                        </Accordion.Header>
                        <Accordion.Body>
                            <h6><span>Code: </span>{group.data.request.code}</h6>
                            <h6><span>Requested date: </span>{group.data.request.requestDate}</h6>
                            <h6><span>Modified date: </span>{group.data.request.lastModified}</h6>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={"2"}>
                        <Accordion.Header>
                            Batches Data
                        </Accordion.Header>
                        <Accordion.Body>
                            <Accordion>
                                {
                                    group.data.items.map((item, index) => (
                                        <Accordion.Item key={index} eventKey={"2." + (index + 1)}>
                                            <Accordion.Header>
                                                {item.equipment + " - " + item.category}
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <h6><span>Quantity: </span>{item.quantity + " " + item.unit}
                                                </h6>
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
                <Button variant="danger">Back</Button>
                <Button variant="success">Save</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default function Task() {
    const [groups, setGroups] = useState([])
    const [staffs, setStaffs] = useState([])
    const [tasks, setTasks] = useState([]);

    const [modalVisible, setModalVisible] = useState({
        group: false,
        detail: false
    });

    const [currentGrp, setCurrentGrp] = useState({
        data: null,
        index: 0
    })


    //fetch group
    useEffect(() => {
        async function loadGrp() {
            return await getUnAssignedItemGroup();
        }

        loadGrp().then(res => setGroups(res.data));
    }, [])

    //fetch staff
    useEffect(() => {
        async function getStaffs() {
            return await getStaffList()
        }

        getStaffs().then(res => setStaffs(res.data))
    }, [])

    //fetch task
    useEffect(() => {
        async function fetchTasks() {
            return await getTaskList();
        }

        fetchTasks().then(res => setTasks(res.data));
    }, [])

    function SetGroup(data, index){
        setCurrentGrp({...currentGrp, data: data, index: index});
    }

    function CloseGroupModal(){
        setModalVisible({...modalVisible, group: false});
    }

    function OpenGroupModal(){
        setModalVisible({...modalVisible, group: true})
    }

    function OpenDetailModal(){
        setModalVisible({...modalVisible, detail: true, group: false})
    }

    console.log(modalVisible.group)

    return (
        <div className={style.main}>
            <h1 className={style.title}>Task</h1>
            {groups.length > 0 &&
                <div className={style.alert}>
                    <p>There are requests not yet be assigned.&nbsp;<span
                        onClick={OpenGroupModal}>Assign now</span></p>
                </div>
            }
            <div className={style.table_container}>
                <RenderTable tasks={tasks}/>
            </div>
            <RenderGroupModal
                modalVisible={modalVisible.group}
                CloseModal={CloseGroupModal}
                groups={groups}
                setGroupFunc={SetGroup}
                OpenDetailModal={OpenDetailModal}
            />
            {modalVisible.detail &&
                <RenderDetailModal
                group={currentGrp}
                modalVisible={modalVisible.detail}
                staffs={staffs}
            />
            }
        </div>
    )
}