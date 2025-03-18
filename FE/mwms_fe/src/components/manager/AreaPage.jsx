import { useEffect, useState } from "react";
import axiosClient from "../../config/api";
import {
  Button,
  Form,
  Modal,
  Table,
  Pagination,
} from "react-bootstrap";
import {
  MdModeEditOutline,
  MdDeleteOutline,
  MdRestore,
  MdAddCircleOutline,
} from "react-icons/md";
import { TbScanPosition } from "react-icons/tb"
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import { FaSortAmountDown, FaSortAmountUp, FaFilter } from "react-icons/fa";

const AreaPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [cmdSort, setCmdSort] = useState(false);

  // Search states
  const [searchTerm, setSearchTerm] = useState("");

  // Equipment filter states
  const [showEquipmentFilter, setShowEquipmentFilter] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [form, setForm] = useState({
    id: "",
    name: "",
    square: 0,
    eqId: null,
  });
  const [updateErrors, setUpdateErrors] = useState({});
  const [equipments, setEquipments] = useState([]);

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    square: 0,
    eqId: null,
  });
  const [createErrors, setCreateErrors] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [selectedDeleteArea, setSelectedDeleteArea] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleOpenModal = async () => {
    setShowCreate(true);
    await handleFetchEquipment();
  };

  const handleSortByCmd = () => {
    if (cmdSort === false) {
      setCmdSort(true);
      setFilteredData([...filteredData].sort((a, b) => a.id - b.id));
    } else {
      setCmdSort(false);
      setFilteredData([...filteredData].sort((a, b) => b.id - a.id));
    }
    setCurrentPage(1);
  };

  const handleFetchEquipment = async () => {
    try {
      const response = await axiosClient.get("/manager/equipment");
      setEquipments(response.data.data || []);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to fetch equipment",
        { variant: "error" }
      );
    }
  };

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/manager/area");
      if (response.data) {
        setData(response.data);
        setFilteredData(response.data);
      }
    } catch (error) {
      setError(error);
    }
  };

  const validateCreateForm = () => {
    let tempErrors = {};
    if (!createForm.name) tempErrors.name = "Name is required";
    else if (createForm.name.length < 2)
      tempErrors.name = "Name must be at least 2 characters";

    if (!createForm.square) tempErrors.square = "Square is required";
    else if (createForm.square <= 0 || createForm.square > 1000)
      tempErrors.square = "Square must be between 1 and 1000";

    if (!createForm.eqId) tempErrors.eqId = "Equipment selection is required";

    setCreateErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateUpdateForm = () => {
    let tempErrors = {};
    if (!form.name) tempErrors.name = "Name is required";
    else if (form.name.length < 2)
      tempErrors.name = "Name must be at least 2 characters";

    if (!form.square) tempErrors.square = "Square is required";
    else if (form.square <= 0 || form.square > 1000)
      tempErrors.square = "Square must be between 1 and 1000";
    
    setUpdateErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    let filtered = data;
    if (value) {
      filtered = data.filter((area) =>
        area.name.toLowerCase().includes(value.toLowerCase())
      );
    }

    if (selectedEquipment) {
      filtered = filtered.filter(
        (area) => area.equipment.id === selectedEquipment.id
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleEquipmentFilter = (equipment) => {
    setSelectedEquipment(equipment);
    setShowEquipmentFilter(false);

    let filtered = data;
    if (equipment) {
      filtered = data.filter((area) => area.equipment.id === equipment.id);
    }
    if (searchTerm) {
      filtered = filtered.filter((area) =>
        area.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const clearEquipmentFilter = () => {
    setSelectedEquipment(null);
    fetchData(); // Lấy lại toàn bộ danh sách
    if (searchTerm) {
      handleSearch({ target: { value: searchTerm } }); // Áp dụng lại tìm kiếm tên nếu có
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleOpen = async (areaId) => {
    try {
      const response = await axiosClient.get(`/manager/area/${areaId}`);
      if (response.data) {
        setForm({
          id: response.data.id,
          name: response.data.name,
          square: response.data.square,
        });
        setSelectedArea(areaId);
        setShowUpdate(true);
        await handleFetchEquipment();
      }
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Error fetching area data",
        { variant: "error" }
      );
    }
  };

  const handleChange = (e, formType = "update") => {
    const { name, value } = e.target;
    if (formType === "update") {
      setForm({
        ...form,
        [name]: name === "square" || name === "eqId" ? Number(value) : value,
      });
      setUpdateErrors({ ...updateErrors, [name]: "" });
    } else {
      setCreateForm({
        ...createForm,
        [name]: name === "square" || name === "eqId" ? Number(value) : value,
      });
      setCreateErrors({ ...createErrors, [name]: "" });
    }
  };

  const handleUpdate = async () => {
    if (validateUpdateForm()) {
      try {
        const response = await axiosClient.put(
          `/manager/area/${selectedArea}`,
          form
        );
        setShowUpdate(false);
        setForm({ id: "", name: "", square: 0, eqId: null });
        fetchData();
        enqueueSnackbar(response.data?.message || "Area updated successfully", {
          variant: "success",
        });
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message || "Failed to update area",
          { variant: "error" }
        );
      }
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  const handleToggleDelete = async (area) => {
    try {
      const response = await axiosClient.patch(
        `/manager/area/delete/${area.id}`
      );
      fetchData();
      enqueueSnackbar(response.data?.message || "Area deleted successfully", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to delete area",
        { variant: "error" }
      );
    }
  };

  const handleToggleRestore = async (area) => {
    try {
      const response = await axiosClient.patch(
        `/manager/area/restore/${area.id}`
      );
      fetchData();
      enqueueSnackbar(response.data?.message || "Area restored successfully", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to restore area",
        { variant: "error" }
      );
    }
  };

  const handleCreate = async () => {
    if (validateCreateForm()) {
      try {
        const response = await axiosClient.post("/manager/area", createForm);
        setShowCreate(false);
        setCreateForm({ name: "", square: 0, eqId: null });
        fetchData();
        enqueueSnackbar(response.data?.message || "Area created successfully", {
          variant: "success",
        });
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message || "Failed to create area",
          { variant: "error" }
        );
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
    const fetchInitialData = async () => {
      await Promise.all([fetchData(), handleFetchEquipment()]);
    };
    fetchInitialData();
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
      <div
        style={{
          margin: "20px 10px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Button variant="success" onClick={() => handleOpenModal()}>
          <MdAddCircleOutline
            style={{ fontSize: "20px", marginRight: "5px" }}
          />
          Create New Area
        </Button>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Form.Control
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: "200px" }}
          />
          <Button
            variant="secondary"
            onClick={() => setShowEquipmentFilter(true)}
            title="Filter by Equipment"
          >
            <FaFilter style={{ marginRight: "5px" }} />
            {selectedEquipment ? selectedEquipment.name : "Filter Equipment"}
          </Button>
          {selectedEquipment && (
            <Button variant="outline-danger" onClick={clearEquipmentFilter}>
              Clear Filter
            </Button>
          )}
        </div>

        {cmdSort ? (
          <FaSortAmountDown
            style={{ cursor: "pointer", fontSize: "20px" }}
            onClick={handleSortByCmd}
          />
        ) : (
          <FaSortAmountUp
            style={{ cursor: "pointer", fontSize: "20px" }}
            onClick={handleSortByCmd}
          />
        )}
      </div>

      <div className="text-danger fw-bold" style={{ marginLeft: "10px" }}>
        Status of area will be updated in every minute
      </div>
      <Table
        className="text-center"
        style={{ marginLeft: "10px", marginTop: "50px" }}
      >
        <thead>
          <tr className="table-success">
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col">Square</th>
            <th scope="col">Equipment</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((area) => (
              <tr
                key={area.id}
                className={area.status === "deleted" ? "table-secondary" : ""}
                style={{ opacity: area.status === "deleted" ? 0.5 : 1 }}
              >
                <td>{area.id}</td>
                <td>{area.name}</td>
                <td>
                  <span
                    className={`badge ${
                      area.status === "deleted"
                        ? "bg-danger"
                        : area.status === "full"
                        ? "bg-warning"
                        : "bg-success"
                    }`}
                  >
                    {area.status}
                  </span>
                </td>
                <td>{area.square}m²</td>
                <td>{area.equipment.name}</td>
                <td>
                  <div className="d-flex justify-content-center gap-3">
                    <MdModeEditOutline
                      onClick={
                        area.status !== "deleted"
                          ? () => handleOpen(area.id)
                          : null
                      }
                      className={`text-${
                        area.status === "deleted" ? "muted" : "primary"
                      }`}
                      style={{
                        cursor:
                          area.status === "deleted" ? "not-allowed" : "pointer",
                        fontSize: "25px",
                      }}
                      title="Edit"
                    />
                    {area.status === "deleted" ? (
                      <MdRestore
                        onClick={() => handleToggleRestore(area)}
                        className="text-success"
                        style={{ cursor: "pointer", fontSize: "25px" }}
                        title="Restore"
                      />
                    ) : (
                      <MdDeleteOutline
                        onClick={() => openDeleteModal(area)}
                        className="text-danger"
                        style={{ cursor: "pointer", fontSize: "25px" }}
                        title="Delete"
                      />
                    )}
                    <Link
                      to={
                        area.status === "deleted"
                          ? ""
                          : `/manager/position/${area.id}`
                      }
                    >
                      <TbScanPosition
                        className={`text-${
                          area.status === "deleted" ? "muted" : "info"
                        }`}
                        style={{
                          cursor:
                            area.status === "deleted"
                              ? "not-allowed"
                              : "pointer",
                          fontSize: "25px",
                        }}
                        title="View Positions"
                      />
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-muted py-4">
                No data found...
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {filteredData.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
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

      <Modal
        show={showUpdate}
        onHide={() => setShowUpdate(false)}
        size="sm"
        centered
        style={{ color: "black" }}
      >
        <Modal.Header closeButton style={{ padding: "10px 15px" }}>
          <Modal.Title style={{ fontSize: "16px" }}>Update Area</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalBodyStyle}>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", marginBottom: "2px" }}>
                Name
              </Form.Label>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Name..."
                name="name"
                value={form.name}
                onChange={(e) => handleChange(e, "update")}
                isInvalid={!!updateErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {updateErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", marginBottom: "2px" }}>
                Square (m²)
              </Form.Label>
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
              <Form.Control.Feedback type="invalid">
                {updateErrors.square}
              </Form.Control.Feedback>
            </Form.Group>
           
          </Form>
        </Modal.Body>
        <Modal.Footer style={modalFooterStyle}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowUpdate(false)}
          >
            Close
          </Button>
          <Button size="sm" variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        size="sm"
        centered
        style={{ color: "black" }}
      >
        <Modal.Header closeButton style={{ padding: "10px 15px" }}>
          <Modal.Title style={{ fontSize: "16px" }}>
            Create New Area
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalBodyStyle}>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", marginBottom: "2px" }}>
                Name
              </Form.Label>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Name..."
                name="name"
                value={createForm.name}
                onChange={(e) => handleChange(e, "create")}
                isInvalid={!!createErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {createErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", marginBottom: "2px" }}>
                Square (m²)
              </Form.Label>
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
              <Form.Control.Feedback type="invalid">
                {createErrors.square}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", marginBottom: "2px" }}>
                Equipment
              </Form.Label>
              <Form.Control
                as="select"
                name="eqId"
                value={createForm.eqId || ""}
                onChange={(e) => handleChange(e, "create")}
                isInvalid={!!createErrors.eqId}
              >
                <option value="">Select Equipment</option>
                {equipments.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {createErrors.eqId}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={modalFooterStyle}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowCreate(false)}
          >
            Close
          </Button>
          <Button size="sm" variant="primary" onClick={handleCreate}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDelete}
        onHide={() => setShowDelete(false)}
        size="sm"
        centered
        style={{ color: "black" }}
      >
        <Modal.Header closeButton style={{ padding: "10px 15px" }}>
          <Modal.Title style={{ fontSize: "16px" }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalBodyStyle}>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            Are you sure you want to{" "}
            {selectedDeleteArea?.status === "deleted" ? "restore" : "delete"}{" "}
            area "{selectedDeleteArea?.name}"?
          </p>
        </Modal.Body>
        <Modal.Footer style={modalFooterStyle}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowDelete(false)}
          >
            Cancel
          </Button>
          <Button size="sm" variant="danger" onClick={handleDeleteConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showEquipmentFilter}
        onHide={() => setShowEquipmentFilter(false)}
        size="sm"
        centered
        style={{ color: "black" }}
      >
        <Modal.Header closeButton style={{ padding: "10px 15px" }}>
          <Modal.Title style={{ fontSize: "16px" }}>
            Filter by Equipment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalBodyStyle}>
          <Form>
            <Form.Group>
              <Form.Control
                as="select"
                onChange={(e) => {
                  const eqId = e.target.value;
                  const selected = equipments.find(
                    (eq) => eq.id === Number(eqId)
                  );
                  handleEquipmentFilter(selected);
                }}
              >
                {equipments.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={modalFooterStyle}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowEquipmentFilter(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AreaPage;