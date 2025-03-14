import {
  Button,
  Card,
  Col,
  Row,
  Table,
  Pagination,
  Modal,
  Form,
} from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import avatar1 from "../../assets/images/user/avatar-1.jpg";
import { FaUserPlus } from "react-icons/fa6";
import { FaPowerOff } from "react-icons/fa";
import style from "../../styles/Admin.module.css";
import { useEffect, useState } from "react";
import axiosClient from "../../config/api";
import { toast } from "react-toastify";
import { MdModeEdit } from "react-icons/md";
import { BiSolidUserDetail } from "react-icons/bi";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

const Admin = () => {
  const [dashData, setDashData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [idEdit, setIdEdit] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    roleName: "",
    name: "",
    phone: "",
    email: "",
  });

  const [formEdit, setFormEdit] = useState({
    username: "",
    password: "",
    roleName: "",
    name: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [show, setShow] = useState(false);
  const [showUserDetail, setShowUserDetail] = useState(false);

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
      toast.error("Something Wrong....", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
const nameRegex = /^[a-zA-Z0-9_ ]+$/; // Cho phép khoảng trắng trong tên

const validateForm = () => {
  let tempErrors = {};

  if (!formData.username) tempErrors.username = "Username is required";
  else if (formData.username.length < 3) tempErrors.username = "Username must be at least 3 characters";
  else if (!usernameRegex.test(formData.username)) tempErrors.username = "Username cannot contain special characters";

  if (!formData.name) tempErrors.name = "Full Name is required";
  else if (!nameRegex.test(formData.name)) tempErrors.name = "Full Name cannot contain special characters";

  if (!formData.password) tempErrors.password = "Password is required";
  else if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";

  if (!formData.roleName) tempErrors.roleName = "Role is required";

  if (!formData.email) tempErrors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email is invalid";

  if (!formData.phone) tempErrors.phone = "Phone number is required";
  else if (!/^\d{10}$/.test(formData.phone)) tempErrors.phone = "Phone number must be 10 digits";

  setErrors(tempErrors);
  return Object.keys(tempErrors).length === 0;
};

const validateEditForm = () => {
  let tempErrors = {};

  if (!formEdit.username) tempErrors.username = "Username is required";
  else if (formEdit.username.length < 3) tempErrors.username = "Username must be at least 3 characters";
  else if (!usernameRegex.test(formEdit.username)) tempErrors.username = "Username cannot contain special characters";

  if (!formEdit.name) tempErrors.name = "Full Name is required";
  else if (!nameRegex.test(formEdit.name)) tempErrors.name = "Full Name cannot contain special characters";

  if (!formEdit.password) tempErrors.password = "Password is required";
  else if (formEdit.password.length < 6) tempErrors.password = "Password must be at least 6 characters";

  if (!formEdit.roleName) tempErrors.roleName = "Role is required";

  if (!formEdit.email) tempErrors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(formEdit.email)) tempErrors.email = "Email is invalid";

  if (!formEdit.phone) tempErrors.phone = "Phone number is required";
  else if (!/^\d{10}$/.test(formEdit.phone)) tempErrors.phone = "Phone number must be 10 digits";

  setEditErrors(tempErrors);
  return Object.keys(tempErrors).length === 0;
};



  const handleClose = () => {
    setShow(false);
    setFormData({ username: "", password: "", roleName: "", name: "", phone: "", email: "" });
    setErrors({});
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setFormEdit({ username: "", password: "", roleName: "", name: "", phone: "", email: "" });
    setEditErrors({});
  };

  const handleCloseUserDetail = () => {
    setShowUserDetail(false);
    setUserDetail({ phone: "", fullName: "", email: "" });
  };

  const handleOpen = () => setShow(true);

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
        toast.success(response.data);
        fetchData();
        handleClose();
      } catch (error) {
        if (error.status === 500) toast.error(error.response.data);
      }
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  const handleSubmitEdit = async () => {
    if (validateEditForm()) {
      try {
        const response = await axiosClient.put(`/user/${idEdit}`, formEdit);
        toast.success(response.data);
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
      password: item.password,
      roleName: item.role.toLowerCase(),
      name: item.userResponse.fullName,
      phone: item.userResponse.phone,
      email: item.userResponse.email,
    });
  };

  const handleToggleUserStatus = async (user) => {
    try {
      await axiosClient.patch(`/user/delete/${user.id}`);
      fetchData();
      toast.info(`User Deactivated successfully!`);
    } catch (error) {
      toast.error("Something Wrong....", error);
    }
  };

  const handleToggleActivate = async (user) => {
    try {
      await axiosClient.patch(`/user/activate/${user.id}`);
      fetchData();
      toast.info(`User activated successfully!`);
    } catch (error) {
      toast.error("Something Wrong....", error);
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

  const PasswordField = ({ password }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <td>
        <h5 className="text-muted">
          {showPassword ? password : "••••••••"}
          {showPassword ? (
            <IoIosEye
              style={{ color: "black", cursor: "pointer", marginLeft: "10px" }}
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoIosEyeOff
              style={{ color: "black", cursor: "pointer", marginLeft: "10px" }}
              onClick={() => setShowPassword(true)}
            />
          )}
        </h5>
      </td>
    );
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dashData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dashData.length / itemsPerPage);

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
      <Row className={style.screen} style={{ overflowY: "scroll", height: "100vh", marginLeft: "0.5px", marginRight: "0.5px" }}>
        <Col md={6} xl={12}>
          <Card className="Recent-Users widget-focus-lg">
            <Card.Header>
              <Card.Title as="h5">
                All Users -
                <FaUserPlus
                  style={{ marginLeft: "4px", fontSize: "25px", cursor: "pointer" }}
                  onClick={handleOpen}
                />
              </Card.Title>
            </Card.Header>
            <Card.Body className="px-0 py-2">
              <Table responsive hover className="recent-users">
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                      <tr key={item.id} style={{ opacity: item.status === "deleted" ? 0.3 : 1 }}>
                        <td>
                          <img className="rounded-circle" style={{ width: "40px" }} src={avatar1} alt="activity-user" />
                        </td>
                        <td>
                          <p className="m-0">ID: {item.id}</p>
                        </td>
                        <td>
                          <h5 className="text-muted">{item.username}</h5>
                        </td>
                        <PasswordField password={item.password} />
                        <td>
                          <h6 className="text-muted">{item.role}</h6>
                        </td>
                        <td>
                          <h6 className="text-muted">
                            <i className={`fa fa-circle ${item.status === "active" ? "text-c-green" : "text-c-gray"} f-10 m-r-15`} />
                            {item.status}
                          </h6>
                        </td>
                        <td>
                          {item.status === "active" ? (
                            <MdDelete
                              onClick={() => handleToggleUserStatus(item)}
                              style={{ fontSize: "30px", color: "red", cursor: "pointer", marginRight: "30px" }}
                            />
                          ) : (
                            <FaPowerOff
                              onClick={() => handleToggleActivate(item)}
                              style={{ color: "green", fontSize: "25px", marginRight: "30px", cursor: "pointer" }}
                            />
                          )}
                          <MdModeEdit
                            style={{ fontSize: "25px", cursor: item.status === "active" ? "pointer" : "not-allowed", marginRight: "30px" }}
                            onClick={() => item.status === "active" && handleOpenEditForm(item)}
                          />
                          <BiSolidUserDetail
                            style={{ fontSize: "25px", color: "blue", cursor: item.status === "active" ? "pointer" : "not-allowed" }}
                            onClick={() => item.status === "active" && handleOpenUserDetail(item.userResponse)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              {dashData.length > 0 && (
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

      <Modal show={show} style={{ color: "black" }} centered size="md" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                isInvalid={!!errors.username}
              />
              <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="roleName"
                value={formData.roleName}
                onChange={handleChange}
                isInvalid={!!errors.roleName}
              >
                <option value="">Select Role</option>
                <option value="staff">staff</option>
                <option value="supplier">supplier</option>
                <option value="requester">requester</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">{errors.roleName}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateUser}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEdit} style={{ color: "black" }} centered onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formEdit.username}
                onChange={handleEditChange}
                isInvalid={!!editErrors.username}
              />
              <Form.Control.Feedback type="invalid">{editErrors.username}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formEdit.password}
                onChange={handleEditChange}
                isInvalid={!!editErrors.password}
              />
              <Form.Control.Feedback type="invalid">{editErrors.password}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role Name</Form.Label>
              <Form.Control
                type="text"
                name="roleName"
                readOnly
                style={{opacity: 0.5, cursor: "not-allowed"}}
                
                value={formEdit.roleName}
                onChange={handleEditChange}
                isInvalid={!!editErrors.roleName}
              />
              <Form.Control.Feedback type="invalid">{editErrors.roleName}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formEdit.name}
                onChange={handleEditChange}
                isInvalid={!!editErrors.name}
              />
              <Form.Control.Feedback type="invalid">{editErrors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formEdit.phone}
                onChange={handleEditChange}
                isInvalid={!!editErrors.phone}
              />
              <Form.Control.Feedback type="invalid">{editErrors.phone}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formEdit.email}
                onChange={handleEditChange}
                isInvalid={!!editErrors.email}
              />
              <Form.Control.Feedback type="invalid">{editErrors.email}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitEdit}>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUserDetail} onHide={handleCloseUserDetail} centered style={{ color: "black" }}>
        <Modal.Header closeButton>
          <Modal.Title>User Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-center mb-4">
                <img className="rounded-circle" style={{ width: "100px", height: "100px" }} src={avatar1} alt="user-avatar" />
              </div>
              <Table bordered responsive>
                <tbody>
                  <tr>
                    <td className="fw-bold">Full Name</td>
                    <td>{userDetail.fullName || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Email</td>
                    <td>{userDetail.email || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Phone</td>
                    <td>{userDetail.phone || "N/A"}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUserDetail}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Admin;