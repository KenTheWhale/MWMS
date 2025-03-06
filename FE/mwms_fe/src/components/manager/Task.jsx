import style from '../../styles/manager/Task.module.css'
import {Accordion, Button, Modal, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {getTaskList} from "../../services/TaskService.js";
import {getUnAssignedItemGroup} from "../../services/ManagerService.js";
import {MdOutlineAssignmentInd} from "react-icons/md";
import {assignStaff, getStaffList} from "../../services/StaffService.js";
import {SearchBarNoSelector} from "../ui/SearchBarNoSelector.jsx";
import {InputLabel, MenuItem, OutlinedInput, Select, TextField} from "@mui/material";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {CustomAlertQUOC} from "../CustomAlert.jsx";

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

function RenderGroupModal({modalVisible, CloseGroupModal, OpenDetailModal, groups, setGroupFunc}) {

    return (
        <Modal show={modalVisible} backdrop={false} onHide={() => CloseGroupModal('group', false)} size={"xl"} centered>
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
                                OpenDetailModal("detail", true)
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
                <Button variant={"success"} onClick={() => CloseGroupModal("group", false)}>Finish</Button>
            </div>
        </Modal.Body>
    </Modal>
    )
}

function RenderDetailModal({modalVisible, group, staffs, CloseDetailModal, AlertFunc}) {
    const [selectedAssignData, setSelectedAssignData] = useState({
        staffId: 0,
        description: '',
        assignDate: dayjs().add(1, "day"),
    })
    const [isAssignOpen, setIsAssignOpen] = useState(false)

    const handleAssignStaff = async (staffId, groupId, description, assignDate) => {
        try {
            const date = assignDate.format('YYYY-MM-DD');
            const res = await assignStaff(staffId, groupId, description, date);
            AlertFunc(true, res.success, res.message)
            if (res.success) {
                CloseDetailModal("detail", false)
            }

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Modal show={modalVisible} backdrop={false} keyboard={false} size={"lg"} centered scrollable>
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
                        defaultValue={group.data.status}
                        readOnly
                        style={{width: '100%'}}
                        size={"small"}
                    />
                </h5>
                <Button variant={"primary"} onClick={() => setIsAssignOpen(!isAssignOpen)}>Assign</Button>
                {
                    isAssignOpen &&
                    <>
                        <h5>
                            <InputLabel shrink>Staff</InputLabel>
                            <Select
                                value={selectedAssignData.staffId}
                                onChange={(e) => setSelectedAssignData({
                                    ...selectedAssignData,
                                    staffId: e.target.value
                                })}
                                autoWidth
                                input={<OutlinedInput/>}
                                displayEmpty
                            >
                                <MenuItem disabled value={0}>
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
                                onChange={(e) => setSelectedAssignData({
                                    ...selectedAssignData,
                                    description: e.target.value
                                })}
                                value={selectedAssignData.description}
                            />
                        </h5>
                        <h5>
                            <InputLabel shrink>Assign date</InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en"}>
                                <DatePicker
                                    defaultValue={selectedAssignData.assignDate}
                                    minDate={dayjs().add(1, 'day')}
                                    format={'DD-MM-YYYY'}
                                    onChange={(e) => setSelectedAssignData({...selectedAssignData, assignDate: e})}
                                />
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
                <Button variant="danger" onClick={() => CloseDetailModal("detail", false)}>Back</Button>
                <Button variant={selectedAssignData.staffId === 0 ? "dark" : "success"} onClick={
                    () => handleAssignStaff(
                        selectedAssignData.staffId,
                        group.data.id,
                        selectedAssignData.description,
                        selectedAssignData.assignDate
                    )
                } disabled={selectedAssignData.staffId === 0}>Save</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default function Task() {
    const [groups, setGroups] = useState([])
    const [staffs, setStaffs] = useState([])
    const [tasks, setTasks] = useState([]);
    const [alert, setAlert] = useState({
        open: false,
        success: false,
        message: ""
    })
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
    }, [modalVisible])

    //fetch staff
    useEffect(() => {
        async function getStaffs() {
            return await getStaffList()
        }

        getStaffs().then(res => setStaffs(res.data))
    }, [modalVisible])

    //fetch task
    useEffect(() => {
        async function fetchTasks() {
            return await getTaskList();
        }

        fetchTasks().then(res => setTasks(res.data));
    }, [modalVisible])

    function SetCurrentGroup(data, index) {
        setCurrentGrp({...currentGrp, data: data, index: index});
    }

    function HandleModal(modalType, isOpen) {
        switch (modalType) {
            case "group":
                isOpen ?
                    setModalVisible({...modalVisible, group: true, detail: false}) :
                    setModalVisible({...modalVisible, group: false, detail: false})
                break
            case "detail":
                isOpen ?
                    setModalVisible({...modalVisible, group: false, detail: true}) :
                    setModalVisible({...modalVisible, group: true, detail: false})
                break
        }
    }

    function HandleAlert(status, isSuccess, message){
        setAlert({...alert, open: status, success: isSuccess, message: message});
    }

    console.log(alert)

    return (
        <div className={style.main}>
            <h1 className={style.title}>Task</h1>
            {groups.length > 0 &&
                <div className={style.alert}>
                    <p>There are requests not yet be assigned.&nbsp;<span
                        onClick={() => HandleModal("group", true)}>Assign now</span></p>
                </div>
            }
            <div className={style.table_container}>
                <RenderTable tasks={tasks}/>
            </div>
            {
                modalVisible.group &&
                <RenderGroupModal
                    modalVisible={modalVisible.group}
                    CloseGroupModal={HandleModal}
                    groups={groups}
                    setGroupFunc={SetCurrentGroup}
                    OpenDetailModal={HandleModal}
                />
            }
            {
                modalVisible.detail &&
                <RenderDetailModal
                    group={currentGrp}
                    modalVisible={modalVisible.detail}
                    staffs={staffs}
                    CloseDetailModal={HandleModal}
                    AlertFunc={HandleAlert}
                />
            }
            {
                alert.open &&
                <CustomAlertQUOC
                    message={alert.message}
                    CloseFunc={() => HandleAlert(false, false, "")}
                    open={alert.open}
                    severity={alert.success ? "success" : "error"}
                />
            }
        </div>
    )
}