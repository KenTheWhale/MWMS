import {useEffect, useState} from "react";
import {Accordion, Button, Card, Container, Form, Modal, Spinner, Table,} from "react-bootstrap";
import axiosClient from "../../config/api";
import {useParams} from "react-router-dom";
import {MdAddCircleOutline, MdModeEditOutline} from "react-icons/md";
import {toast} from "react-toastify";
import {useSnackbar} from "notistack";

const PositionPage = () => {
  const { id } = useParams();
  const [positions, setPositions] = useState([]);
  const [chosePositionId, setChosePositionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPosition, setShowPosition] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [batch, setBatch] = useState([]);
  const [form, setForm] = useState({
    name: "",
    square: 0,
    areaId: null,
  });

  const [area, setArea] = useState(null);

  const { enqueueSnackbar } = useSnackbar();
  const [formErrors, setFormErrors] = useState({});

  const [activeBatchDetails, setActiveBatchDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const modalHeaderStyle = {
    padding: "10px 15px",
    borderBottom: "1px solid #dee2e6",
  };
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
      const responseArea = await axiosClient.get(`/manager/area/${id}`);
      setArea(responseArea.data);
    } catch (error) {
      enqueueSnackbar("Can not loading data", { variant: "error" });
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

  const validateForm = () => {
    let tempErrors = {};
    if (!form.name) tempErrors.name = "Position name is required";
    else if (form.name.length < 2)
      tempErrors.name = "Position name must be at least 2 characters";
    else if (form.name.length > 50)
      tempErrors.name = "Position name must not exceed 50 characters";

    if (!form.square || form.square <= 0)
      tempErrors.square = "Square must be greater than 0";

    setFormErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCreate = async () => {
    if (validateForm()) {
      try {
        await axiosClient.post("/manager/position", form);
        setShowCreate(false);
        setForm({ name: "", square: 0, areaId: null });
        setFormErrors({});
        fetchData();
        enqueueSnackbar("Position created successfully!", {
          variant: "success",
        });
      } catch (error) {
        enqueueSnackbar(error.response?.data || "Something went wrong!", {
          variant: "error",
        });
      }
    } else {
      enqueueSnackbar("Please fix the errors in the form", {
        variant: "error",
      });
    }
  };

  const handleOpen = () => {
    setShowCreate(true);
    setForm({ ...form, areaId: id });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "square" ? parseInt(value) || 0 : value,
    }));
  };

  const handleOpenEditForm = async () => {
    setShowEdit(true);
    try {
      const response = await axiosClient.get(
        `/manager/position/individual/${chosePositionId}`
      );
      setForm({
        name: response.data.name,
        square: response.data.square,
        areaId: response.data.areaId,
      });
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to load position data", { variant: "error" });
    }
  };

  const handleEditPosition = async () => {
    if (validateForm()) {
      try {
        const response = await axiosClient.put(
          `/manager/position/${chosePositionId}`,
          form
        );
        setShowEdit(false);
        setShowPosition(false);
        setForm({ name: "", square: 0, areaId: null });
        setFormErrors({});
        fetchData();
        enqueueSnackbar(response.data, { variant: "success" });
      } catch (error) {
        enqueueSnackbar(error.response?.data || "Something went wrong!", {
          variant: "error",
        });
      }
    } else {
      enqueueSnackbar("Please fix the errors in the form", {
        variant: "error",
      });
    }
  };

  const handlePositionClose = () => {
    setShowPosition(false);
    setBatch([]);
    setActiveBatchDetails([]);
  };

  const handleShowPosition = async (positionId) => {
    try {
      setShowPosition(true);
      setChosePositionId(positionId);
      const response = await axiosClient.get(
        `/manager/position/individual/${positionId}`
      );
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

  return (
    <>
      <Container className="py-4">
        <Button variant="success" onClick={handleOpen}>
          <MdAddCircleOutline
            style={{ fontSize: "20px", marginRight: "5px" }}
          loos/>
          Create New Position
        </Button>

        <Card className="shadow-sm">
          <Card.Header className="bg-secondary">
            <Card.Title
              className="d-flex justify-content-between align-items-start"
              style={{ color: "white" }}
            >
              {area != null ? (
                <>
                  <div className="flex-grow-1 me-3">
                    <div>Area Name: {area.name}</div>
                    <div>Area Status: {area.status}</div>
                    <div>Area Square: {area.square}m²</div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold">
                      Equipment Name: {area.equipment.name}
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-100 text-center">Loading...</div>
              )}
            </Card.Title>
          </Card.Header>
          <Card.Body>
            {positions.length === 0 ? (
              <div className="text-center text-muted py-4">
                No positions available in this area
              </div>
            ) : (
              <div
                className="position-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "15px",
                }}
              >
                {positions.map((position) => (
                  <div
                    key={position.id}
                    className={`border rounded d-flex flex-column align-items-center justify-content-center p-3 bg-${getPositionColor(
                      position
                    )} position-relative shadow-sm`}
                    style={{
                      width: "100%",
                      height: "100px",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    onClick={() => handleShowPosition(position.id)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <span className="fw-semibold fs-6">{position.name}</span>
                    <span className="fs-6">{position.square}m²</span>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      <Modal
        show={showPosition}
        onHide={handlePositionClose}
        centered
        style={{
          color: "black",
          padding: "10px",
          filter: showEdit ? "blur(5px)" : "none",
          transition: "0.3s ease-in-out",
        }}
      >
        <Modal.Header closeButton style={modalHeaderStyle}>
          <Modal.Title style={{ fontSize: "16px" }}>
            Detail Batch -{" "}
            <MdModeEditOutline
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => handleOpenEditForm()}
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ padding: "10px", maxHeight: "300px", overflowY: "auto" }}
        >
          <Accordion
            defaultActiveKey="0"
            onSelect={(selectedKey) => {
              if (selectedKey) handSelectBatch(selectedKey);
            }}
          >
            {batch.map((item) => (
              <Accordion.Item eventKey={item.id.toString()} key={item.id}>
                <Accordion.Header style={{ padding: "5px" }}>
                  <div
                    className="d-flex justify-content-between w-100"
                    style={{ fontSize: "12px" }}
                  >
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
                            <span className="ms-2" style={{ fontSize: "12px" }}>
                              Loading.....
                            </span>
                          </div>
                        ) : (
                          <Table
                            striped
                            bordered
                            hover
                            size="sm"
                            style={{ fontSize: "12px" }}
                          >
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
                                  <td style={{ fontSize: "11px" }}>
                                    {item.importedDate}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        )}
                      </>
                    ) : (
                      <div className="text-center">
                        <span style={{ fontSize: "12px" }}>
                          No details available
                        </span>
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

      <Modal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        size="sm"
        centered
        style={{ color: "black" }}
      >
        <Modal.Header closeButton style={modalHeaderStyle}>
          <Modal.Title style={{ fontSize: "16px", margin: "0 auto" }}>
            Create New Position
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalBodyStyle}>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", marginBottom: "2px" }}>
                Position Name
              </Form.Label>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Name..."
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Square</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter square meters"
                name="square"
                value={form.square}
                onChange={handleChange}
                isInvalid={!!formErrors.square}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.square}
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
        show={showEdit}
        onHide={() => setShowEdit(false)}
        className="text-black"
        size="sm"
        centered
      >
        <Modal.Header closeButton style={modalHeaderStyle}>
          <Modal.Title style={{ fontSize: "16px", margin: "0 auto" }}>
            Edit Position
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalBodyStyle}>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", marginBottom: "2px" }}>
                Position Name
              </Form.Label>
              <Form.Control
                size="sm"
                type="text"
                placeholder="Name..."
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Square</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter square meters"
                name="square"
                value={form.square}
                onChange={handleChange}
                isInvalid={!!formErrors.square}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.square}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={modalFooterStyle}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowEdit(false)}
          >
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handleEditPosition}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PositionPage;