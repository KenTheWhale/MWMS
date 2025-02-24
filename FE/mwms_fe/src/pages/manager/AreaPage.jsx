import { useEffect, useState } from "react";
import { axiosClient } from "../../config/api";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { MdModeEditOutline } from "react-icons/md";

const AreaPage = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [form, setForm] = useState({
    id: "",
    name: "",
    status: "",
    maxQty: 0
  });

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/area");
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleOpen = async (areaId) => {
    try {
      const response = await axiosClient.get(`/area/${areaId}`);
      if (response.data) {
        setForm(response.data);
        setSelectedArea(areaId);
        setShow(true);
      }
    } catch (error) {
      console.error("Error fetching area data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await axiosClient.put(`/area/${selectedArea}`, form);
      setShow(false);
      fetchData(); // Làm mới dữ liệu sau khi cập nhật
    } catch (error) {
      console.error("Error updating area:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Table className="text-center" style={{ marginLeft: "10px", marginTop: "50px" }}>
        <thead>
          <tr className="table-success">
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Max Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0
            ? data.map((area) => (
                <tr key={area.id}>
                  <td>{area.id}</td>
                  <td>{area.name}</td>
                  <td>{area.status}</td>
                  <td>{area.maxQty}</td>
                  <td>
                    <MdModeEditOutline
                      onClick={() => handleOpen(area.id)}
                      style={{ cursor: "pointer", fontSize: "30px" }}
                    />
                  </td>
                </tr>
              ))
            : "Data is loading....."}
        </tbody>
      </Table>

      {/* Modal Update */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Area</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name..."
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                placeholder="Status..."
                name="status"
                value={form.status}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Max Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Max Quantity..."
                name="maxQty"
                min={1}
                max={1000}
                value={form.maxQty}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AreaPage;
