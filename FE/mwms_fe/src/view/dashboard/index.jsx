import { Card, Col, Row } from "react-bootstrap";
import style from "../../styles/Admin.module.css";
import { useEffect, useState, useCallback } from "react";
import axiosClient from "../../config/api";
import { useSnackbar } from "notistack";

const DashDefault = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [deleteUsers, setDeleteUsers] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const fetchAPI = useCallback(async () => {
    try {
      const [response1, response2] = await Promise.all([
        axiosClient.get("/user/get-active"),
        axiosClient.get("/user/get-deleted"),
      ]);

      setActiveUsers(response1.data);
      setDeleteUsers(response2.data);

      enqueueSnackbar("Fetch Success!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.response?.data || "Something went wrong", { variant: "error" });
    }
  }, [enqueueSnackbar]); 

  useEffect(() => {
    fetchAPI();
  }, [fetchAPI]);

  return (
    <Row
      className={style.screen}
      style={{
        overflowY: "scroll",
        height: "100vh",
        marginLeft: "0.5px",
        marginRight: "0.5px",
      }}
    >
      <Col xl={6} xxl={4} className="mt-5">
        <Card style={{borderRadius: "10px"}}>
          <Card.Body>
            <h6 className="mb-4">Active Users</h6>
            <div className="row d-flex align-items-center">
              <div className="col-9">
                <h3 className="f-w-300 d-flex align-items-center m-b-0">
                  {activeUsers}
                </h3>
              </div>
              <div className="col-3 text-end">
                <p className="m-b-0">Users</p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col xl={6} xxl={4} className="mt-5">
        <Card style={{borderRadius: "10px"}}>
          <Card.Body>
            <h6 className="mb-4">Deleted Users</h6>
            <div className="row d-flex align-items-center" >
              <div className="col-9">
                <h3 className="f-w-300 d-flex align-items-center m-b-0">
                  {deleteUsers}
                </h3>
              </div>
              <div className="col-3 text-end">
                <p className="m-b-0">Users</p>
              </div>
            </div>
            
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default DashDefault;
