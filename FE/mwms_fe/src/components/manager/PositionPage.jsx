import { useEffect, useState } from "react";
import { Accordion, Button, Card, Container, Form, Modal, Spinner, Table } from "react-bootstrap";
import axiosClient from "../../config/api";
import { useParams } from "react-router-dom";
import { MdAddCircleOutline } from "react-icons/md";
import { toast } from "react-toastify";

const PositionPage = () => {
  const { id } = useParams();
  const [positions, setPositions] = useState([]);
  const [chosePositionId, setChosePositionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPosition, setShowPosition] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [batch, setBatch] = useState([]);
  const [form, setForm] = useState({
    name: "",
    areaId: null,
  });
  const [formErrors, setFormErrors] = useState({}); // Trạng thái lưu lỗi validation

  const [activeBatchDetails, setActiveBatchDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Modal styling
  const modalStyle = { width: "350px", maxWidth: "350px", margin: "0 auto" };
  const modalHeaderStyle = { padding: "10px 15px", borderBottom: "1px solid #dee2e6" };
  const modalBodyStyle = { padding: "15px" };
  const modalFooterStyle = {
    padding: "10px 15px",
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end",
    borderTop: "1px solid #dee2e6",
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/manager/position/${id}`);
      setPositions(response.data || []);
      setError(null);
    } catch (error) {
      console.log(error);
      setError("Không thể tải dữ liệu vị trí. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const getPositionColor = (position) => {
    return position.status === "occupied" ? "danger" : "light";
  };

  // Validation cho form tạo position
  const validateForm = () => {
    let tempErrors = {};
    if (!form.name) tempErrors.name = "Position name is required";
    else if (form.name.length < 2) tempErrors.name = "Position name must be at least 2 characters";
    else if (form.name.length > 50) tempErrors.name = "Position name must not exceed 50 characters";

    setFormErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCreate = async () => {
    if (validateForm()) {
      try {
        await axiosClient.post("/manager/position", form);
        setShowCreate(false);
        setForm({ name: "", areaId: null });
        setFormErrors({});
        fetchData();
        toast.success("Position created successfully!");
      } catch (error) {
        toast.error("Error creating position", error);
      }
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  const handleOpen = () => {
    setShowCreate(true);
    setForm({ ...form, areaId: id });
  };

  const handleChange = (e) => {
    setForm({ ...form, name: e.target.value });
    setFormErrors({ ...formErrors, name: "" }); // Xóa lỗi khi người dùng nhập
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </Container>
    );
  }

  const handlePositionClose = () => {
    setShowPosition(false);
    setBatch([]); // Reset batch khi đóng modal
    setActiveBatchDetails([]); // Reset chi tiết batch
  };

  const handleShowPosition = async (positionId) => {
    try {
      setShowPosition(true);
      const response = await axiosClient.get(`/manager/position/individual/${positionId}`);
      setBatch(response.data.batches || []);
    } catch (error) {
      toast.error("Something Wrong .....", error);
    }
  };

  const handSelectBatch = async (selectedKey) => {
    if (!selectedKey) return;

    const batchId = parseInt(selectedKey);

    if (activeBatchDetails && activeBatchDetails.batchId === batchId) {
      return;
    }

    try {
      setLoadingDetails(true);
      const response = await axiosClient.get(`/manager/batch-item/${batchId}`);
      setActiveBatchDetails(response.data);
    } catch (error) {
      toast.error("Something Wrong....", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDeletePosition = async () => {
    try {
      const response = await axiosClient.delete(`/manager/position/${chosePositionId}`);
      toast.success(response.data);
      setShowDelete(false);
      setShowPosition(false);
      fetchData();
    } catch (error) {
      toast.error("Something Wrong....", error);
    }
  };

  const handleOpenDeleteModal = (positionId) => {
    setShowDelete(true);
    setChosePositionId(positionId);
  };

  return (
    <>
      <Container className="py-4">
        <Button variant="success" onClick={handleOpen}>
          <MdAddCircleOutline style={{ fontSize: "20px", marginRight: "5px" }} />
          Create New Position
        </Button>

        <Card>
          <Card.Header>
            <Card.Title className="text-center">Area Management in Position {id}</Card.Title>
          </Card.Header>
          <Card.Body>
            {positions.length === 0 ? (
              <div className="text-center">No have any position in this area</div>
            ) : (
              <div
                className="position-grid center"
                style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}
              >
                {positions.map((position) => (
                  <div
                    key={position.id}
                    className={`border rounded d-flex flex-column align-items-center justify-content-center p-2 bg-${getPositionColor(
                      position
                    )} position-relative`}
                    style={{ width: "180px", height: "80px", cursor: "pointer" }}
                    onClick={() => handleShowPosition(position.id)}
                  >
                    <span
                      className="position-absolute bg-danger text-white rounded-circle d-flex justify-content-center align-items-center"
                      style={{
                        top: "5px",
                        right: "5px",
                        width: "20px",
                        height: "20px",
                        fontSize: "12px",
                        cursor: "pointer",
                        zIndex: 10,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDeleteModal(position.id);
                      }}
                    >
                      x
                    </span>
                    <span className="fs-6">{position.name}</span>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      <Modal show={showPosition} onHide={handlePositionClose} centered style={{ color: "black" }}>
        <Modal.Header closeButton style={modalHeaderStyle}>
          <Modal.Title style={{ fontSize: "16px" }}>Detail Batch</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "10px", maxHeight: "300px", overflowY: "auto" }}>
          <Accordion
            defaultActiveKey="0"
            onSelect={(selectedKey) => {
              if (selectedKey) handSelectBatch(selectedKey);
            }}
          >
            {batch.map((item) => (
              <Accordion.Item eventKey={item.id.toString()} key={item.id}>
                <Accordion.Header style={{ padding: "5px" }}>
                  <div className="d-flex justify-content-between w-100" style={{ fontSize: "12px" }}>
                    <span>{item.id}</span>
                    <span>{item.code}</span>
                    <span style={{ fontSize: "11px" }}>{item.createdDate}</span>
                    <span>{item.equipmentQty}</span>
                  </div>
                </Accordion.Header>
                <Accordion.Body style={{ padding: "8px" }}>
                  <div className="batch-details">
                    <h6 className="mb-2">Batch Detail: {item.code}</h6>
                    {activeBatchDetails.length > 0 ? (
                      <>
                        {loadingDetails ? (
                          <div className="text-center">
                            <Spinner animation="border" size="sm" />
                            <span className="ms-2" style={{ fontSize: "12px" }}>Loading.....</span>
                          </div>
                        ) : (
                          <Table striped bordered hover size="sm" style={{ fontSize: "12px" }}>
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Serial</th>
                                <th>Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeBatchDetails.map((item) => (
                                <tr key={item.id}>
                                  <td>{item.id}</td>
                                  <td>{item.serialNumber}</td>
                                  <td style={{ fontSize: "11px" }}>{item.importedDate}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        )}
                      </>
                    ) : (
                      <div className="text-center">
                        <span style={{ fontSize: "12px" }}>No details available</span>
                      </div>
                    )}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Modal.Body>
        <Modal.Footer style={{ padding: "8px", justifyContent: "center" }}>
          <Button size="sm" variant="secondary" onClick={handlePositionClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCreate} onHide={() => setShowCreate(false)} size="sm" centered style={{ color: "black" }}>
        <Modal.Header closeButton style={modalHeaderStyle}>
          <Modal.Title style={{ fontSize: "16px", margin: "0 auto" }}>Create New Position</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalBodyStyle}>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", marginBottom: "2px" }}>Position Name</Form.Label>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Name..."
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
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
        <Modal.Header closeButton style={modalHeaderStyle}>
          <Modal.Title style={{ fontSize: "16px", margin: "0 auto" }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ ...modalBodyStyle, textAlign: "center" }}>
          <p style={{ fontSize: "14px", marginBottom: "15px" }}>Do you really want to delete this?</p>
        </Modal.Body>
        <Modal.Footer style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Button size="sm" variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button size="sm" variant="danger" onClick={handleDeletePosition}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PositionPage;