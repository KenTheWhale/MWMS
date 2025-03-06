import {useEffect, useState} from "react";
import {Accordion, Button, Card, Container, Form, Modal, Spinner, Table,} from "react-bootstrap";
import axiosClient from "../../config/api";
import {useParams} from "react-router-dom";
import {MdAddCircleOutline} from "react-icons/md";
import {toast} from "react-toastify";

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
    name: null,
    areaId: null,
  });

  const [activeBatchDetails, setActiveBatchDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

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

  const handleCreate = async () => {
    try {
      await axiosClient.post("/manager/position", form);
      setShowCreate(false);
      setForm({ name: "", areaId: null });
      fetchData();
      toast.success("Position created successfully !");
    } catch (error) {
      toast.error("Error creating position", error);
    }
  };

  const handleOpen = () => {
    setShowCreate(true);
    setForm({
      ...form,
      areaId: id,
    });
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
  };

  const handleShowPosition = async (positionId) => {
    try {
      setShowPosition(true);
      const response = await axiosClient.get(
        `/manager/position/individual/${positionId}`
      );
      // console.log(response.data);
      setBatch(response.data.batches);
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
      // setShowPosition(false)
    } catch (error) {
      toast.error("Something Wrong....", error);
    }
  }

  const handleOpenDeleteModal = (positionId) => {
    setShowDelete(true)
    setChosePositionId(positionId);
  }

  return (
    <>
      <Container className="py-4">
        <Button variant="success" onClick={handleOpen}>
          <MdAddCircleOutline
            style={{ fontSize: "20px", marginRight: "5px" }}
          />
          Create New Position
        </Button>

        <Card>
          <Card.Header>
            <Card.Title className="text-center">
              Quản Lý Vị Trí Trong Khu Vực {id}
            </Card.Title>
          </Card.Header>
          <Card.Body>
            {positions.length === 0 ? (
              <div className="text-center">
                Không có vị trí nào trong khu vực này
              </div>
            ) : (
              <div
                className="position-grid center"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "10px",
                }}
              >
                {positions.map((position) => (
                  <div
                    key={position.id}
                    className={`border rounded d-flex flex-column align-items-center justify-content-center p-2 bg-${getPositionColor(
                      position
                    )} position-relative`}
                    style={{
                      width: "180px",
                      height: "80px",
                      cursor: "pointer",
                    }}
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

      <Modal show={showPosition} onHide={handlePositionClose}>
        <Modal.Title className="text-center">Detail Batch</Modal.Title>
        <Modal.Body>
          <Accordion
            defaultActiveKey="0"
            onSelect={(selectedKey) => {
              // Gọi hàm xử lý khi có accordion được chọn
              if (selectedKey) {
                handSelectBatch(selectedKey);
              }
            }}
          >
            {batch.map((item) => (
              <Accordion.Item eventKey={item.id.toString()} key={item.id}>
                <Accordion.Header>
                  <div className="d-flex justify-content-between w-100">
                    <span>{item.id}</span>
                    <span>{item.code}</span>
                    <span>{item.createdDate}</span>
                    <span>{item.equipmentQty}</span>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="batch-details p-3">
                    <h5 className="mb-3">Chi tiết của Batch {item.code}</h5>
                    {/* Sử dụng state để hiển thị dữ liệu chi tiết */}
                    {activeBatchDetails != null ? (
                      <>
                        {loadingDetails ? (
                          <div className="text-center">
                            <Spinner animation="border" size="sm" />
                            <span className="ms-2">Đang tải chi tiết...</span>
                          </div>
                        ) : (
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Serial number</th>
                                <th>Import Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeBatchDetails.map((item) => (
                                <tr key={item.id}>
                                  <td>{item.id}</td>
                                  <td>{item.serialNumber}</td>
                                  <td>{item.importedDate}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        )}
                      </>
                    ) : (
                      <div className="text-center">
                        <span>Đang tải dữ liệu...</span>
                      </div>
                    )}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Modal.Body>
      </Modal>

      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Modal.Title className="text-center">Create New Position</Modal.Title>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Position Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name..."
                name="name"
                value={form.name}
                onChange={(e) => {
                  setForm({
                    ...form,
                    name: e.target.value,
                  });
                }}
              />
            </Form.Group>
          </Form>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Create
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>


      <Modal show={showDelete} onHide={() => setShowDelete(false)}>
        <Modal.Header>Do you really want to delete ?</Modal.Header>
        <Modal.Body>
          <Button variant="primary" onClick={() => setShowDelete(false)}>Close</Button>
          <Button variant="primary" onClick={() => handleDeletePosition()}>Delete</Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PositionPage;
