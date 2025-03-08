import { useEffect, useState } from "react";
import axiosClient from "../../config/api";
import { Button, Form, Modal, Table, Pagination } from "react-bootstrap";
import {
  MdModeEditOutline,
  MdDeleteOutline,
  MdRestore,
  MdAddCircleOutline,
} from "react-icons/md";
import { TbScanPosition } from "react-icons/tb";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const AreaPage = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [form, setForm] = useState({
    id: "",
    name: "",
    status: "",
    square: 0,
  });
  const [updateErrors, setUpdateErrors] = useState({});

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    status: "ACTIVE",
    square: 0,
  });
  const [createErrors, setCreateErrors] = useState({});

  const [showDelete, setShowDelete] = useState(false);
  const [selectedDeleteArea, setSelectedDeleteArea] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/manager/area");
      if (response.data) setData(response.data);
    } catch (error) {
      setError(error);
    }
  };

  // Validation cho form tạo mới
  const validateCreateForm = () => {
    let tempErrors = {};
    if (!createForm.name) tempErrors.name = "Name is required";
    else if (createForm.name.length < 2) tempErrors.name = "Name must be at least 2 characters";

    if (!createForm.square) tempErrors.square = "Square is required";
    else if (createForm.square <= 0 || createForm.square > 1000)
      tempErrors.square = "Square must be between 1 and 1000";

    setCreateErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Validation cho form cập nhật
  const validateUpdateForm = () => {
    let tempErrors = {};
    if (!form.name) tempErrors.name = "Name is required";
    else if (form.name.length < 2) tempErrors.name = "Name must be at least 2 characters";

    if (!form.square) tempErrors.square = "Square is required";
    else if (form.square <= 0 || form.square > 1000)
      tempErrors.square = "Square must be between 1 and 1000";

    setUpdateErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleOpen = async (areaId) => {
    try {
      const response = await axiosClient.get(`/manager/area/${areaId}`);
      if (response.data) {
        setForm(response.data);
        setSelectedArea(areaId);
        setShowUpdate(true);
      }
    } catch (error) {
      console.error("Error fetching area data:", error);
    }
  };

  const handleChange = (e, formType = "update") => {
    const { name, value } = e.target;
    if (formType === "update") {
      setForm({ ...form, [name]: name === "square" ? Number(value) : value });
      setUpdateErrors({ ...updateErrors, [name]: "" });
    } else {
      setCreateForm({ ...createForm, [name]: name === "square" ? Number(value) : value });
      setCreateErrors({ ...createErrors, [name]: "" });
    }
  };

  const handleUpdate = async () => {
    if (validateUpdateForm()) {
      try {
        await axiosClient.put(`/manager/area/${selectedArea}`, form);
        setShowUpdate(false);
        fetchData();
        toast.success("Area updated successfully!");
      } catch (error) {
        console.error("Error updating area:", error);
        toast.error("Error updating area");
      }
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  const handleToggleDelete = async (area) => {
    try {
      const newStatus = area.status === "DELETED" ? "ACTIVE" : "DELETED";
      await axiosClient.put(`/manager/area/${area.id}`, { ...area, status: newStatus });
      fetchData();
      toast.info(`Area ${newStatus === "DELETED" ? "deleted" : "restored"} successfully!`);
    } catch (error) {
      console.error("Error toggling delete:", error);
      toast.error("Error toggling delete");
    }
  };

  const handleCreate = async () => {
    if (validateCreateForm()) {
      try {
        await axiosClient.post("/manager/area", createForm);
        setShowCreate(false);
        setCreateForm({ name: "", status: "ACTIVE", square: 0 });
        fetchData();
        toast.success("Area created successfully!");
      } catch (error) {
        console.error("Error creating area:", error);
        toast.error("Error creating area");
      }
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  const openDeleteModal = (area) => {
    setSelectedDeleteArea(area);
    setShowDelete(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedDeleteArea) {
      handleToggleDelete(selectedDeleteArea);
      setShowDelete(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Modal styling
  const modalStyle = { width: "350px", maxWidth: "350px", margin: "0 auto" };
  const modalBodyStyle = { padding: "15px" };
  const modalFooterStyle = {
    padding: "10px 15px",
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end",
  };

  return (
    <>
      <div style={{ margin: "20px 10px" }}>
        <Button variant="success" onClick={() => setShowCreate(true)}>
          <MdAddCircleOutline style={{ fontSize: "20px", marginRight: "5px" }} />
          Create New Area
        </Button>
      </div>

      <Table className="text-center" style={{ marginLeft: "10px", marginTop: "50px" }}>
        <thead>
          <tr className="table-success">
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Square</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((area) => (
              <tr key={area.id} style={{ opacity: area.status === "DELETED" ? 0.5 : 1 }}>
                <td>{area.id}</td>
                <td>{area.name}</td>
                <td>{area.status}</td>
                <td>{area.square}²</td>
                <td>
                  <MdModeEditOutline
                    onClick={area.status !== "DELETED" ? () => handleOpen(area.id) : null}
                    style={{
                      cursor: area.status === "DELETED" ? "not-allowed" : "pointer",
                      fontSize: "30px",
                      marginRight: "10px",
                      color: area.status === "DELETED" ? "#ccc" : "black",
                    }}
                  />
                  {area.status === "DELETED" ? (
                    <MdRestore
                      onClick={() => handleToggleDelete(area)}
                      style={{ cursor: "pointer", fontSize: "30px", color: "green" }}
                    />
                  ) : (
                    <MdDeleteOutline
                      onClick={() => openDeleteModal(area)}
                      style={{ cursor: "pointer", fontSize: "30px", color: "red" }}
                    />
                  )}
                  <Link to={area.status === "DELETED" ? "" : `/manager/position/${area.id}`}>
                    <TbScanPosition
                      style={{
                        fontSize: "30px",
                        marginLeft: "10px",
                        color: "blue",
                        cursor: area.status === "DELETED" ? "not-allowed" : "pointer",
                      }}
                    />
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>Data is loading.....</td>
            </tr>
          )}
        </tbody>
      </Table>

      {data.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <Pagination>
            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
        </div>
      )}

      <Modal show={showUpdate} onHide={() => setShowUpdate(false)} size="sm" centered style={{ color: "black" }}>
        <Modal.Header closeButton style={{ padding: "10px 15px" }}>
          <Modal.Title style={{ fontSize: "16px" }}>Update Area</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalBodyStyle}>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", marginBottom: "2px" }}>Name</Form.Label>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Name..."
                name="name"
                value={form.name}
                onChange={(e) => handleChange(e, "update")}
                isInvalid={!!updateErrors.name}
              />
              <Form.Control.Feedback type="invalid">{updateErrors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", marginBottom: "2px" }}>Status</Form.Label>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Status..."
                name="status"
                value={form.status}
                onChange={(e) => handleChange(e, "update")}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", marginBottom: "2px" }}>Square</Form.Label>
              <Form.Control
                size="sm"
                type="number"
                placeholder="Square..."
                name="square"
                min={1}
                max={1000}
                value={form.square}
                onChange={(e) => handleChange(e, "update")}
                isInvalid={!!updateErrors.square}
              />
              <Form.Control.Feedback type="invalid">{updateErrors.square}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={modalFooterStyle}>
          <Button size="sm" variant="secondary" onClick={() => setShowUpdate(false)}>
            Close
          </Button>
          <Button size="sm" variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCreate} onHide={() => setShowCreate(false)} size="sm" centered style={{ color: "black" }}>
        <Modal.Header closeButton style={{ padding: "10px 15px" }}>
          <Modal.Title style={{ fontSize: "16px" }}>Create New Area</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalBodyStyle}>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", marginBottom: "2px" }}>Name</Form.Label>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Name..."
                name="name"
                value={createForm.name}
                onChange={(e) => handleChange(e, "create")}
                isInvalid={!!createErrors.name}
              />
              <Form.Control.Feedback type="invalid">{createErrors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", marginBottom: "2px" }}>Status</Form.Label>
              <div style={{ fontSize: "14px" }}>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label={createForm.status}
                  checked={createForm.status === "ACTIVE"}
                  onChange={(e) => {
                    const newStatus = e.target.checked ? "ACTIVE" : "INACTIVE";
                    setCreateForm({ ...createForm, status: newStatus });
                  }}
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", marginBottom: "2px" }}>Square</Form.Label>
              <Form.Control
                size="sm"
                type="number"
                placeholder="Square..."
                name="square"
                min={1}
                max={1000}
                value={createForm.square}
                onChange={(e) => handleChange(e, "create")}
                isInvalid={!!createErrors.square}
              />
              <Form.Control.Feedback type="invalid">{createErrors.square}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={modalFooterStyle}>
          <Button size="sm" variant="secondary" onClick={() => setShowCreate(false)}>
            Close
          </Button>
          <Button size="sm" variant="primary" onClick={handleCreate}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDelete} onHide={() => setShowDelete(false)} size="sm" centered style={{ color: "black" }}>
        <Modal.Header closeButton style={{ padding: "10px 15px" }}>
          <Modal.Title style={{ fontSize: "16px" }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalBodyStyle}>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            Are you sure you want to{" "}
            {selectedDeleteArea?.status === "DELETED" ? "restore" : "delete"} area "{selectedDeleteArea?.name}"?
          </p>
        </Modal.Body>
        <Modal.Footer style={modalFooterStyle}>
          <Button size="sm" variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button size="sm" variant="danger" onClick={handleDeleteConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AreaPage;