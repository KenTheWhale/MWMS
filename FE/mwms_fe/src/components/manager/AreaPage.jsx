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
import { useSnackbar } from "notistack";

const AreaPage = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [form, setForm] = useState({
    id: "",
    name: "",
    square: 0,
    eqId: null
  });
  const [updateErrors, setUpdateErrors] = useState({});
  const [equipments, setEquipments] = useState([]);

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    square: 0,
    eqId: null
  });
  const [createErrors, setCreateErrors] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [selectedDeleteArea, setSelectedDeleteArea] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleOpenModal = async () => {
    setShowCreate(true);
    await handleFetchEquipment();
  };

  const handleFetchEquipment = async () => {
    try {
      const response = await axiosClient.get("/manager/equipment");
      setEquipments(response.data.data || []);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Failed to fetch equipment", { variant: "error" });
    }
  };

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/manager/area");
      // console.log(r)
      if (response.data) setData(response.data);
    } catch (error) {
      setError(error);
    }
  };

  // Validation for create form
  const validateCreateForm = () => {
    let tempErrors = {};
    if (!createForm.name) tempErrors.name = "Name is required";
    else if (createForm.name.length < 2) tempErrors.name = "Name must be at least 2 characters";

    if (!createForm.square) tempErrors.square = "Square is required";
    else if (createForm.square <= 0 || createForm.square > 1000)
      tempErrors.square = "Square must be between 1 and 1000";

    if (!createForm.eqId) tempErrors.eqId = "Equipment selection is required";

    setCreateErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Validation for update form
  const validateUpdateForm = () => {
    let tempErrors = {};
    if (!form.name) tempErrors.name = "Name is required";
    else if (form.name.length < 2) tempErrors.name = "Name must be at least 2 characters";

    if (!form.square) tempErrors.square = "Square is required";
    else if (form.square <= 0 || form.square > 1000)
      tempErrors.square = "Square must be between 1 and 1000";

    if (!form.eqId) tempErrors.eqId = "Equipment selection is required";

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
        setForm({...form,
          id: response.data.id,
          name: response.data.name,
          square: response.data.square,
          eqId: response.data.equipment.id
        });
        setSelectedArea(areaId);
        setShowUpdate(true);
        await handleFetchEquipment();
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Error fetching area data", { variant: "error" });
    }
  };

  const handleChange = (e, formType = "update") => {
    const { name, value } = e.target;
    if (formType === "update") {
      setForm({ ...form, [name]: name === "square" || name === "eqId" ? Number(value) : value });
      setUpdateErrors({ ...updateErrors, [name]: "" });
    } else {
      setCreateForm({ ...createForm, [name]: name === "square" || name === "eqId" ? Number(value) : value });
      setCreateErrors({ ...createErrors, [name]: "" });
    }
  };

  const handleUpdate = async () => {
    if (validateUpdateForm()) {
      try {
        const response = await axiosClient.put(`/manager/area/${selectedArea}`, form);
        setShowUpdate(false);
        setForm({ id: "", name: "", square: 0, eqId: null }); // Reset form
        fetchData();
        enqueueSnackbar(response.data?.message || "Area updated successfully", { variant: "success" });
      } catch (error) {
        enqueueSnackbar(error.response?.data?.message || "Failed to update area", { variant: "error" });
      }
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  const handleToggleDelete = async (area) => {
    try {
      const response = await axiosClient.patch(`/manager/area/delete/${area.id}`);
      fetchData();
      enqueueSnackbar(response.data?.message || "Area deleted successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Failed to delete area", { variant: "error" });
    }
  };

  const handleToggleRestore = async (area) => {
    try {
      const response = await axiosClient.patch(`/manager/area/restore/${area.id}`);
      fetchData();
      enqueueSnackbar(response.data?.message || "Area restored successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Failed to restore area", { variant: "error" });
    }
  };

  const handleCreate = async () => {
    if (validateCreateForm()) {
      try {
        const response = await axiosClient.post("/manager/area", createForm);
        setShowCreate(false);
        setCreateForm({ name: "", square: 0, eqId: null }); // Reset form
        fetchData();
        enqueueSnackbar(response.data?.message || "Area created successfully", { variant: "success" });
      } catch (error) {
        enqueueSnackbar(error.response?.data?.message || "Failed to create area", { variant: "error" });
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
        <Button variant="success" onClick={() => handleOpenModal()}>
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
            <th>Equipment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((area) => (
              <tr key={area.id} style={{ opacity: area.status === "deleted" ? 0.5 : 1 }}>
                <td>{area.id}</td>
                <td>{area.name}</td>
                <td>{area.status}</td>
                <td>{area.square}m²</td>
                <td>{area.equipment.name}</td>
                <td>
                  <MdModeEditOutline
                    onClick={area.status !== "deleted" ? () => handleOpen(area.id) : null}
                    style={{
                      cursor: area.status === "deleted" ? "not-allowed" : "pointer",
                      fontSize: "30px",
                      marginRight: "10px",
                      color: area.status === "deleted" ? "#ccc" : "black",
                    }}
                  />
                  {area.status === "deleted" ? (
                    <MdRestore
                      onClick={() => handleToggleRestore(area)}
                      style={{ cursor: "pointer", fontSize: "30px", color: "green" }}
                    />
                  ) : (
                    <MdDeleteOutline
                      onClick={() => openDeleteModal(area)}
                      style={{ cursor: "pointer", fontSize: "30px", color: "red" }}
                    />
                  )}
                  <Link to={area.status === "deleted" ? "" : `/manager/position/${area.id}`}>
                    <TbScanPosition
                      style={{
                        fontSize: "30px",
                        marginLeft: "10px",
                        color: "blue",
                        cursor: area.status === "deleted" ? "not-allowed" : "pointer",
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
              <Form.Label style={{ fontSize: "14px", marginBottom: "2px" }}>Square (m²)</Form.Label>
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
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", marginBottom: "2px" }}>Equipment</Form.Label>
              <Form.Control
                as="select"
                name="eqId"
                value={form.eqId || ""}
                onChange={(e) => handleChange(e, "update")}
                isInvalid={!!updateErrors.eqId}
              ><option value="">Select Equipment</option>
                {equipments.map(item => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">{updateErrors.eqId}</Form.Control.Feedback>
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
              <Form.Label style={{ fontSize: "14px", marginBottom: "2px" }}>Square (m²)</Form.Label>
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
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", marginBottom: "2px" }}>Equipment</Form.Label>
              <Form.Control
                as="select"
                name="eqId"
                value={createForm.eqId || ""}
                onChange={(e) => handleChange(e, "create")}
                isInvalid={!!createErrors.eqId}
              >
                <option value="">Select Equipment</option>
                {equipments.map(item => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">{createErrors.eqId}</Form.Control.Feedback>
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
            {selectedDeleteArea?.status === "deleted" ? "restore" : "delete"} area "{selectedDeleteArea?.name}"?
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