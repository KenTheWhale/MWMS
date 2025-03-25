import {
  Button,
  Card,
  Col,
  Row,
  Table,
  Pagination,
  Modal,
  Form,
  Container,
} from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import avatar1 from "../../assets/images/user/avatar-1.jpg";
import { FaUserPlus } from "react-icons/fa6";
import { FaPowerOff } from "react-icons/fa";
import { useEffect, useState } from "react";
import axiosClient from "../../config/api";
import { toast } from "react-toastify";
import { MdModeEdit } from "react-icons/md";
import { BiSolidUserDetail } from "react-icons/bi";
import { useSnackbar } from "notistack";

/* eslint-disable react/prop-types*/
// Component Header riêng
const AdminHeader = ({
  searchTerm,
  sortOrder, 
  onSearchChange, 
  onSortToggle, 
  onCreateClick, 
  totalUsers 
}) => {
  return (
    <header className="text-white shadow-sm" style={{background: "linear-gradient(135deg, #4e73df 0%, #224abe 100%)", borderRadius: "10px"}}>
    <Container fluid className="py-3">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        {/* Phần tiêu đề */}
        <div className="d-flex flex-column">
          <h5 className="mb-1 d-flex align-items-center fw-bold">
            <span className="me-2" style={{color:"wheat"}}>👤 User Management</span> 
          </h5>
          <small className="fw-bold" style={{color:"wheat"}}>
            Total Users: {totalUsers}
          </small>
        </div>

        {/* Phần controls */}
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <Form.Control
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-auto shadow-sm"
            style={{ minWidth: "200px" }}
          />
          <Button
            onClick={onSortToggle}
            size="sm"
            className="fw-bold"
          >
            Sort {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
          <Button
            variant="info"
            onClick={onCreateClick}
            className="d-flex align-items-center fw-bold gap-2 shadow-sm"
          >
            <FaUserPlus /> New User
          </Button>
        </div>
      </div>
    </Container>
  </header>
  );
};

const Admin = () => {
  const [dashData, setDashData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [idEdit, setIdEdit] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const [formData, setFormData] = useState({
    username: "",
    roleName: "",
    name: "",
    phone: "",
    email: "",
    eqIds: [],
  });

  const [formEdit, setFormEdit] = useState({
    username: "",
    name: "",
    phone: "",
    email: "",
  });

  const [equipment, setEquipment] = useState([]);
  const [errors, setErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [show, setShow] = useState(false);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showEquipment, setShowEquipment] = useState(false);
  const [userDetail, setUserDetail] = useState({
    phone: "",
    fullName: "",
    email: "",
  });

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/user");
      setDashData(response.data);
    } catch (error) {
      enqueueSnackbar("Failed to fetch users: " + error.message, { variant: "error" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const usernameRegex = /^(?=.*[a-zA-Z])(?=(?:\D*\d\D*){1,2}$)[a-zA-Z0-9]{5,11}$/;
const nameRegex = /^[a-zA-Z ]+$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@medic\.com$/;
const phoneRegex = /^[0]\d{9}$/;

const validateForm = () => {
  let tempErrors = {};

  if (!formData.username) {
      tempErrors.username = "Username is required";
  } else if (!usernameRegex.test(formData.username)) {
      tempErrors.username = "Username must be 5-11 characters, contain at least one letter, and include only 1 or 2 digits";
  }

  if (!formData.name) {
      tempErrors.name = "Full Name is required";
  } else if (!nameRegex.test(formData.name)) {
      tempErrors.name = "Full Name can only contain letters and spaces";
  }

  if (!formData.roleName) {
      tempErrors.roleName = "Role is required";
  }

  if (!formData.email) {
      tempErrors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Email must be a valid @medic.com address (e.g., name@medic.com)";
  }

  if (!formData.phone) {
      tempErrors.phone = "Phone number is required";
  } else if (!phoneRegex.test(formData.phone)) {
      tempErrors.phone = "Phone number must be 10 digits and start with 0";
  }

  setErrors(tempErrors);
  return Object.keys(tempErrors).length === 0;
};

const validateEditForm = () => {
  let tempErrors = {};

  if (!formEdit.username) {
      tempErrors.username = "Username is required";
  } else if (!usernameRegex.test(formEdit.username)) {
      tempErrors.username = "Username must be 5-11 characters, contain at least one letter, and include only 1 or 2 digits";
  }

  if (!formEdit.name) {
      tempErrors.name = "Full Name is required";
  } else if (!nameRegex.test(formEdit.name)) {
      tempErrors.name = "Full Name can only contain letters and spaces";
  }

  if (!formEdit.email) {
      tempErrors.email = "Email is required";
  } else if (!emailRegex.test(formEdit.email)) {
      tempErrors.email = "Email must be a valid @medic.com address (e.g., name@medic.com)";
  }

  if (!formEdit.phone) {
      tempErrors.phone = "Phone number is required";
  } else if (!phoneRegex.test(formEdit.phone)) {
      tempErrors.phone = "Phone number must be 10 digits and start with 0";
  }

  setEditErrors(tempErrors);
  return Object.keys(tempErrors).length === 0;
};


  const handleClose = () => {
    setShow(false);
    setShowEquipment(false);
    setFormData({
      username: "",
      roleName: "",
      name: "",
      phone: "",
      email: "",
      eqIds: []
    });
    setErrors({});
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setFormEdit({
      username: "",
      name: "",
      phone: "",
      email: "",
    });
    setEditErrors({});
  };

  const handleCloseUserDetail = () => {
    setShowUserDetail(false);
    setUserDetail({ phone: "", fullName: "", email: "" });
  };

  const handleOpen = () => {
    setShow(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormEdit({ ...formEdit, [name]: value });
    setEditErrors({ ...editErrors, [name]: "" });
  };

  const handleCreateUser = async () => {
    if (validateForm()) {
      try {
        const response = await axiosClient.post("/user/register", formData);
        enqueueSnackbar(response.data, { variant: "success" });
        fetchData();
        handleClose();
      } catch (error) {
        enqueueSnackbar(error.response?.data || "Failed to create user", { variant: "error" });
      }
    }
  };

  const handleOpenEquipment = async () => {
    if (validateForm()) {
      setShowEquipment(true);
      try {
        setShow(false);
        const response = await axiosClient.get("/manager/equipment");
        setEquipment(response.data.data);
      } catch (e) {
        enqueueSnackbar(e.response.data, { variant: "error" });
      }
    } else {
      enqueueSnackbar("Something wrong....", { variant: "error" });
    }
  };

  const handleSubmitEdit = async () => {
    if (validateEditForm()) {
      try {
        const response = await axiosClient.put(`/user/${idEdit}`, formEdit);
        enqueueSnackbar(response.data, { variant: "success" });
        fetchData();
        handleCloseEdit();
      } catch (error) {
        if (error.status === 500) toast.error(error.response.data);
      }
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  const handleOpenEditForm = (item) => {
    setShowEdit(true);
    setIdEdit(item.id);
    setFormEdit({
      username: item.username,
      name: item.userResponse.fullName,
      phone: item.userResponse.phone,
      email: item.userResponse.email,
    });
  };

  const handleToggleUserStatus = async (user) => {
    try {
      const response = await axiosClient.patch(`/user/delete/${user.id}`);
      fetchData();
      enqueueSnackbar(response.data, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.response.data, { variant: "error" });
    }
  };

  const handleToggleActivate = async (user) => {
    try {
      const response = await axiosClient.patch(`/user/activate/${user.id}`);
      fetchData();
      enqueueSnackbar(response.data, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.response.data, { variant: "error" });
    }
  };

  const handleOpenUserDetail = (detailUser) => {
    setUserDetail({
      phone: detailUser.phone,
      fullName: detailUser.fullName,
      email: detailUser.email,
    });
    setShowUserDetail(true);
  };

  const handleCheckboxChange = (id) => {
    setFormData((prevData) => {
      const isChecked = prevData.eqIds.includes(id);
      return {
        ...prevData,
        eqIds: isChecked
          ? prevData.eqIds.filter((eqId) => eqId !== id)
          : [...prevData.eqIds, id],
      };
    });
  };

  const getFilteredAndSortedData = () => {
    let filteredData = [...dashData];
    if (searchTerm) {
      filteredData = filteredData.filter(item =>
        item.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filteredData.sort((a, b) => {
      const usernameA = a.id;
      const usernameB = b.id;
      return sortOrder === 'asc' 
        ? usernameA - (usernameB)
        : usernameB - (usernameA);
    });
    return filteredData;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1);
  };

  const filteredAndSortedData = getFilteredAndSortedData();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationItems = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };

  return (
    <>
      <AdminHeader
        searchTerm={searchTerm}
        sortOrder={sortOrder}
        onSearchChange={handleSearchChange}
        onSortToggle={handleSortToggle}
        onCreateClick={handleOpen}
        totalUsers={filteredAndSortedData.length}
      />
      <div className="container-fluid mt-5 pt-3" >
        <Row>
          <Col>
            <Card className="shadow-sm" style={{borderRadius: "10px"}}>
              <Card.Body>
                <Table responsive hover className="table-striped">
                  <thead className="bg-light text-center" >
                    <tr>
                      <th>No</th>
                      <th>Username</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={'text-center'}>
                    {currentItems.length > 0 ? (
                      currentItems.map((item, index) => (
                        <tr key={item.id} style={{ opacity: item.status === "deleted" ? 0.3 : 1 }}>
                          <td>{index + 1}</td>
                          <td>{item.username}</td>
                          <td>{item.role.toLowerCase()}</td>
                          <td>
                            <i className={`fa fa-circle ${item.status === "active" ? "text-success" : "text-secondary"} me-2`} />
                            {item.status}
                          </td>
                          <td>
                            {item.status === "active" ? (
                              <MdDelete
                                onClick={() => handleToggleUserStatus(item)}
                                className="text-danger me-3"
                                style={{ fontSize: "20px", cursor: "pointer" }}
                              />
                            ) : (
                              <FaPowerOff
                                onClick={() => handleToggleActivate(item)}
                                className="text-success me-3"
                                style={{ fontSize: "20px", cursor: "pointer" }}
                              />
                            )}
                            <MdModeEdit
                              className="text-dark me-3"
                              style={{ fontSize: "20px", cursor: item.status === "active" ? "pointer" : "not-allowed" }}
                              onClick={() => item.status === "active" && handleOpenEditForm(item)}
                            />
                            <BiSolidUserDetail
                              className="text-primary"
                              style={{ fontSize: "20px", cursor: item.status === "active" ? "pointer" : "not-allowed" }}
                              onClick={() => item.status === "active" && handleOpenUserDetail(item.userResponse)}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">No users found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                {filteredAndSortedData.length > 0 && (
                  <div className="d-flex justify-content-center mt-3">
                    <Pagination>
                      <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                      <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                      {renderPaginationItems()}
                      <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                      <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Các Modal components */}
      <Modal show={show} style={{ color: "black" }} centered size="md" onHide={handleClose}>
        <Modal.Header closeButton><Modal.Title>Create New User</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter username" name="username" value={formData.username} onChange={handleChange} isInvalid={!!errors.username} />
              <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control as="select" name="roleName" value={formData.roleName} onChange={handleChange} isInvalid={!!errors.roleName}>
                <option value="">Select Role</option>
                <option value="staff">staff</option>
                <option value="supplier">supplier</option>
                <option value="requester">requester</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">{errors.roleName}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" placeholder="Enter full name" name="name" value={formData.name} onChange={handleChange} isInvalid={!!errors.name} />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email address" name="email" value={formData.email} onChange={handleChange} isInvalid={!!errors.email} />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" placeholder="Enter phone number" name="phone" value={formData.phone} onChange={handleChange} isInvalid={!!errors.phone} />
              <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          {formData.roleName !== "supplier" ? (
            <Button variant="primary" onClick={handleCreateUser}>Create</Button>
          ) : (
            <Button variant="primary" onClick={handleOpenEquipment}>Next</Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal show={showEdit} style={{ color: "black" }} centered onHide={handleCloseEdit}>
        <Modal.Header closeButton><Modal.Title>Edit Information</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" name="username" value={formEdit.username} onChange={handleEditChange} isInvalid={!!editErrors.username} />
              <Form.Control.Feedback type="invalid">{editErrors.username}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formEdit.name} onChange={handleEditChange} isInvalid={!!editErrors.name} />
              <Form.Control.Feedback type="invalid">{editErrors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" name="phone" value={formEdit.phone} onChange={handleEditChange} isInvalid={!!editErrors.phone} />
              <Form.Control.Feedback type="invalid">{editErrors.phone}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formEdit.email} onChange={handleEditChange} isInvalid={!!editErrors.email} />
              <Form.Control.Feedback type="invalid">{editErrors.email}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>Close</Button>
          <Button variant="primary" onClick={handleSubmitEdit}>Edit</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUserDetail} onHide={handleCloseUserDetail} centered style={{ color: "black" }}>
        <Modal.Header closeButton><Modal.Title>User Detail</Modal.Title></Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-center mb-4">
                <img className="rounded-circle" style={{ width: "100px", height: "100px" }} src={avatar1} alt="user-avatar" />
              </div>
              <Table bordered responsive>
                <tbody>
                  <tr><td className="fw-bold">Full Name</td><td>{userDetail.fullName || "N/A"}</td></tr>
                  <tr><td className="fw-bold">Email</td><td>{userDetail.email || "N/A"}</td></tr>
                  <tr><td className="fw-bold">Phone</td><td>{userDetail.phone || "N/A"}</td></tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUserDetail}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEquipment} className="text-black" centered>
        <Modal.Header><Modal.Title>Equipment</Modal.Title></Modal.Header>
        <Modal.Body>
          {equipment.map((item, index) => (
            <div className="form-check" key={index}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`equipment-${item.id}`}
                checked={formData.eqIds.includes(item.id)}
                onChange={() => handleCheckboxChange(item.id)}
              />
              <label className="form-check-label" htmlFor={`equipment-${item.id}`}>
                {item.name}
              </label>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleOpen}>Previous</Button>
          <Button variant="primary" onClick={handleCreateUser}>Create</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Admin;