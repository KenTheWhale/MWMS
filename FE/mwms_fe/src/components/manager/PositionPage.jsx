import React, { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Container,
  Form,
  Modal,
  Spinner,
  Table,
} from "react-bootstrap";
import { axiosClient } from "../../config/api";
import { useParams } from "react-router-dom";
import { MdAddCircleOutline, MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";

const PositionPage = () => {
  const { id } = useParams();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPosition, setShowPosition] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [activeBatch, setActiveBatch] = useState(null);


  const [batch, setBatch] = useState([]);

  const [form, setForm] = useState({
    name: null,
    areaId: null,
  });

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


  const handleToggleBatch = (id) => {
    setActiveBatch(activeBatch === id ? null : id);
  };

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
                    )}`}
                    style={{
                      width: "180px",
                      height: "80px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleShowPosition(position.id)}
                  >
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
        <Modal.Header>
          <MdDeleteOutline style={{ fontSize: "30px", color: "red" }} />
        </Modal.Header>
        <Modal.Body>
          <Table className="text-center">
            <thead>
              <tr>
                <th>#</th>
                <th>Code</th>
                <th>Create Date</th>
                <th>Equipment Quantity</th>
              </tr>
            </thead>
            <tbody>
              {batch.map((item) => (
                <React.Fragment key={item.id}>
                  <tr
                    onClick={() => handleToggleBatch(item.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{item.id}</td>
                    <td>{item.code}</td>
                    <td>{item.createdDate}</td>
                    <td>{item.equipmentQty}</td>
                  </tr>
                  {/* {activeBatch === item.id && (
                    <tr>
                      <td colSpan="4">
                        <Accordion defaultActiveKey="0">
                          <Accordion.Item eventKey="1">
                            <Accordion.Header>
                              Chi tiết Batch #{item.id}
                            </Accordion.Header>
                            <Accordion.Body>
                              <p>
                                <strong>Code:</strong> {item.code}
                              </p>
                              <p>
                                <strong>Equipment Quantity:</strong>{" "}
                                {item.equipmentQty}
                              </p>
                              <p>
                                <strong>Create Date:</strong> {item.createdDate}
                              </p>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </td>
                    </tr>
                  )} */}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
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
    </>
  );
};

export default PositionPage;
