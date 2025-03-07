import { useEffect, useState } from "react";
import axiosClient from "../../config/api";
import { Button, Form, Modal, ModalBody, Table } from "react-bootstrap";
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

  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [form, setForm] = useState({
    id: "",
    name: "",
    status: "",
    square: 0,
  });

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    status: "ACTIVE",
    square: 0,
  });

  const [showDelete, setShowDelete] = useState(false);
  const [selectedDeleteArea, setSelectedDeleteArea] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/manager/area");
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      setError(error);
    }
  };

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
      setForm({ ...form, [name]: value });
    } else {
      setCreateForm({ ...createForm, [name]: value });
    }
  };

  const handleUpdate = async () => {
    try {
      await axiosClient.put(`/manager/area/${selectedArea}`, form);
      setShowUpdate(false);
      fetchData();
      toast.success("Area updated successfully!");
    } catch (error) {
      console.error("Error updating area:", error);
      toast.error("Error updating area");
    }
  };

  const handleToggleDelete = async (area) => {
    try {
      const newStatus = area.status === "DELETED" ? "ACTIVE" : "DELETED";
      await axiosClient.put(`/manager/area/${area.id}`, {
        ...area,
        status: newStatus,
      });
      fetchData();
      toast.info(
        `Area ${newStatus === "DELETED" ? "deleted" : "restored"} successfully!`
      );
    } catch (error) {
      console.error("Error toggling delete:", error);
      toast.error("Error toggling delete");
    }
  };

  const handleCreate = async () => {
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
  };

  const openDeleteModal = (area) => {
    setSelectedDeleteArea(area);
    setShowDelete(true);
  };

  // Hàm xử lý khi xác nhận xóa
  const handleDeleteConfirm = () => {
    if (selectedDeleteArea) {
      handleToggleDelete(selectedDeleteArea);
      setShowDelete(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div style={{ margin: "20px 10px" }}>
        <Button variant="success" onClick={() => setShowCreate(true)}>
          <MdAddCircleOutline
            style={{ fontSize: "20px", marginRight: "5px" }}
          />
          Create New Area
        </Button>
      </div>

      <Table
        className="text-center"
        style={{ marginLeft: "10px", marginTop: "50px" }}
      >
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
          {data.length > 0 ? (
            data.map((area) => (
              <tr
                key={area.id}
                style={{ opacity: area.status === "DELETED" ? 0.5 : 1 }}
              >
                <td>{area.id}</td>
                <td>{area.name}</td>
                <td>{area.status}</td>
                <td>{area.square}&#178;</td>
                <td>
                  <MdModeEditOutline
                    onClick={
                      area.status !== "DELETED"
                        ? () => handleOpen(area.id)
                        : null
                    }
                    style={{
                      cursor:
                        area.status === "DELETED" ? "not-allowed" : "pointer",
                      fontSize: "30px",
                      marginRight: "10px",
                      color: area.status === "DELETED" ? "#ccc" : "black",
                    }}
                  />
                  {area.status === "DELETED" ? (
                    <MdRestore
                      onClick={() => handleToggleDelete(area)}
                      style={{
                        cursor: "pointer",
                        fontSize: "30px",
                        color: "green",
                      }}
                    />
                  ) : (
                    <MdDeleteOutline
                      onClick={() => openDeleteModal(area)}
                      style={{
                        cursor: "pointer",
                        fontSize: "30px",
                        color: "red",
                      }}
                    />
                  )}
                  <Link to={`/manager/position/${area.id}`}>
                    <TbScanPosition
                      style={{
                        fontSize: "30px",
                        marginLeft: "10px",
                        color: "blue",
                        cursor:
                          area.status === "DELETED" ? "not-allowed" : "pointer",
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

      {/* Modal Update */}
      <Modal show={showUpdate} onHide={() => setShowUpdate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Area</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name..."
                name="name"
                value={form.name}
                onChange={(e) => handleChange(e, "update")}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                placeholder="Status..."
                name="status"
                value={form.status}
                onChange={(e) => handleChange(e, "update")}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Square</Form.Label>
              <Form.Control
                type="number"
                placeholder="Square..."
                name="square"
                min={1}
                max={1000}
                value={form.square}
                onChange={(e) => handleChange(e, "update")}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdate(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Create */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Area</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name..."
                name="name"
                value={createForm.name}
                onChange={(e) => handleChange(e, "create")}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
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
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Square</Form.Label>
              <Form.Control
                type="number"
                placeholder="Square..."
                name="square"
                min={1}
                max={1000}
                value={createForm.square}
                onChange={(e) => handleChange(e, "create")}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreate(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Delete */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <p>
            Are you sure you want to {" "}
            {selectedDeleteArea?.status === "DELETED" ? "restore " : "delete "}
            area {selectedDeleteArea?.name} ?
          </p>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              className="ms-2"
            >
              Confirm
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default AreaPage;
