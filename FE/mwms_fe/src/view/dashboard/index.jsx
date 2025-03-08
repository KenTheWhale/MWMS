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

const DashDefault = () => {
  const [dashData, setDashData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [idEdit, setIdEdit] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const [salesData, setSalesData] = useState([
    {
      title: "Daily Sales",
      amount: "$249.95",
      icon: "icon-arrow-up text-c-green",
      value: 50,
      class: "progress-c-theme",
    },
    {
      title: "Monthly Sales",
      amount: "$2.942.32",
      icon: "icon-arrow-down text-c-red",
      value: 36,
      class: "progress-c-theme2",
    },
    {
      title: "Yearly Sales",
      amount: "$8.638.32",
      icon: "icon-arrow-up text-c-green",
      value: 70,
      color: "progress-c-theme",
    },
  ]);

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

  const [show, setShow] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/user");
      setDashData(response.data);
    } catch (error) {
      toast.error("Something Wrong....", error);
    }
  };

  const [showUserDetail, setShowUserDetail] = useState(false);

  const [userDetail, setUserDetail] = useState({
    phone: "",
    fullName: "",
    email: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dashData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(dashData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

  const handleClose = () => {
    setShow(false);
    setFormData({
      username: "",
      password: "",
      roleName: "",
      name: "",
      phone: "",
      email: "",
    });
  };

  const handleCloseUserDetail = () => {
    setShowUserDetail(false);
    setUserDetail({
      phone: "",
      fullName: "",
      email: "",
    });
  };

  const handleOpen = () => {
    setShow(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEdit({ ...formEdit, [name]: name === "roleName" ? value.toLowerCase() : value, // Chỉ lowercase với roleName
    });
  };

  const handleOpenEditForm = (item) => {
    setShowEdit(true);
    setIdEdit(item.id);
    console.log(item);
    setFormEdit({
      ...formEdit,
      username: item.username,
      password: item.password,
      roleName: item.role.toLowerCase(),
      name: item.userResponse.fullName,
      phone: item.userResponse.phone,
      email: item.userResponse.email,
    });
  };

  // eslint-disable-next-line react/prop-types
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

  const handleCreateUser = async () => {
    try {
      const response = await axiosClient.post("/user/register", formData);
      console.log(response.status);
      toast.success(response.data);
      fetchData();
      handleClose();
    } catch (error) {
      if (error.status === 500) {
        toast.error(error.response.data);
        console.log(error.response.data);
      }
    }
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

  const handleSubmitEdit = async () => {
    try {
      const response = await axiosClient.put(`/user/${idEdit}`, formEdit);
      setFormEdit({
        ...formEdit,
        username: "",
        password: "",
        roleName: "",
        name: "",
        phone: "",
        email: "",
      })
      setShowEdit(false);
      fetchData()
      toast.success(response.data);
      console.log(response.data)

    } catch (error) {
      if (error.status === 500) {
        toast.error(error.response.data);
        console.log(error.response.data);
      }
    }
  }

  return (
    <>
      <Row
        className={style.screen}
        style={{
          overflowY: "scroll",
          height: "100vh",
          marginLeft: "0.5px",
          marginRight: "0.5px",
        }}
      >
        {salesData.map((data, index) => {
          return (
            <Col key={index} xl={6} xxl={4} className="mt-5">
              <Card>
                <Card.Body>
                  <h6 className="mb-4">{data.title}</h6>
                  <div className="row d-flex align-items-center">
                    <div className="col-9">
                      <h3 className="f-w-300 d-flex align-items-center m-b-0">
                        <i className={`feather ${data.icon} f-30 m-r-5`} />{" "}
                        {data.amount}
                      </h3>
                    </div>
                    <div className="col-3 text-end">
                      <p className="m-b-0">{data.value}%</p>
                    </div>
                  </div>
                  <div className="progress m-t-30" style={{ height: "7px" }}>
                    <div
                      className={`progress-bar ${data.class}`}
                      role="progressbar"
                      style={{ width: `${data.value}%` }}
                      aria-valuenow={data.value}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
        <Col md={6} xl={12}>
          <Card className="Recent-Users widget-focus-lg">
            <Card.Header>
              <Card.Title as="h5">
                All Users -
                <FaUserPlus
                  style={{
                    marginLeft: "4px",
                    fontSize: "25px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpen()}
                />
              </Card.Title>
            </Card.Header>
            <Card.Body className="px-0 py-2">
              <Table responsive hover className="recent-users">
                <tbody>
                  {currentItems && currentItems.length > 0 ? (
                    currentItems.map((item) => (
                      <tr
                        // className="unread"
                        key={item.id}
                        style={{
                          opacity: item.status === "deleted" ? 0.3 : 1,
                        }}
                      >
                        <td>
                          <img
                            className="rounded-circle"
                            style={{ width: "40px" }}
                            src={avatar1}
                            alt="activity-user"
                          />
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
                            <i
                              className={`fa fa-circle ${
                                item.status == "active"
                                  ? "text-c-green"
                                  : "text-c-gray"
                              } f-10 m-r-15`}
                            />
                            {item.status}
                          </h6>
                        </td>
                        <td>
                          {item.status === "active" ? (
                            <MdDelete
                              onClick={() => handleToggleUserStatus(item)}
                              style={{
                                fontSize: "30px",
                                color: "red",
                                cursor: "pointer",
                                marginRight: "30px",
                              }}
                            />
                          ) : (
                            <FaPowerOff
                              onClick={() => handleToggleActivate(item)}
                              style={{
                                color: "green",
                                fontSize: "25px",
                                marginRight: "30px",
                                cursor: "pointer",
                              }}
                            />
                          )}
                          <MdModeEdit
                            style={{
                              fontSize: "25px",
                              cursor: `${item.status === "active" ? "pointer" : "not-allowed"}`,
                              marginRight: "30px",
                            }}
                            onClick={() => handleOpenEditForm(item)}
                          />
                          <BiSolidUserDetail
                            style={{
                              fontSize: "25px",
                              color: "blue",
                              cursor: `${item.status === "active" ? "pointer" : "not-allowed"}`,
                            }}
                            onClick={() =>
                              item.status === "active"
                                ? handleOpenUserDetail(item.userResponse)
                                : ""
                            }
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              {dashData.length > 0 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.First
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {renderPaginationItems()}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showUserDetail} onHide={handleCloseUserDetail}>
        <Modal.Header closeButton>
          <Modal.Title>User Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-center mb-4">
                <img
                  className="rounded-circle"
                  style={{ width: "100px", height: "100px" }}
                  src={avatar1}
                  alt="user-avatar"
                />
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

      <Modal show={show} style={{color: "black",}} centered size="md" onHide={handleClose}>
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
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={formData.roleName}
                onChange={(e) =>
                  setFormData({ ...formData, roleName: e.target.value })
                }
              >
                <option value="">Select Role</option>
                <option value="admin">admin</option>
                <option value="user">manager</option>
                <option value="staff">staff</option>
                <option value="staff">partner</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
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

      <Modal show={showEdit} style={{color: "black",}} onHide={() => setShowEdit(false)} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "1.2rem" }}>Chỉnh sửa thông tin</Modal.Title>
      </Modal.Header>
        <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
        <Form>
            <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formEdit.username}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formEdit.password}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role Name</Form.Label>
              <Form.Control
                type="text"
                name="roleName"
                value={formEdit.roleName}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formEdit.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formEdit.phone}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formEdit.email}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitEdit}>Edit</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DashDefault;
