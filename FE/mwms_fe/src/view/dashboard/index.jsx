import {
  Card,
  Col,
  Row
} from "react-bootstrap";

import style from "../../styles/Admin.module.css";
import { useState } from "react";


const DashDefault = () => {

  const [salesData, setSalesData] = useState([
    {
      title: "Daily Sales",
      amount: "$249.95",
      icon: "icon-arrow-up text-c-green",
      value: 50,
      class: "progress-c-theme",
    },
    {
      title: "Monthly Sales",
      amount: "$2.942.32",
      icon: "icon-arrow-down text-c-red",
      value: 36,
      class: "progress-c-theme2",
    },
    {
      title: "Yearly Sales",
      amount: "$8.638.32",
      icon: "icon-arrow-up text-c-green",
      value: 70,
      color: "progress-c-theme",
    },
  ]);

  return (
    <>
      <Row
        className={style.screen}
        style={{
          overflowY: "scroll",
          height: "100vh",
          marginLeft: "0.5px",
          marginRight: "0.5px",
        }}
      >
        {salesData.map((data, index) => {
          return (
            <Col key={index} xl={6} xxl={4} className="mt-5">
              <Card>
                <Card.Body>
                  <h6 className="mb-4">{data.title}</h6>
                  <div className="row d-flex align-items-center">
                    <div className="col-9">
                      <h3 className="f-w-300 d-flex align-items-center m-b-0">
                        <i className={`feather ${data.icon} f-30 m-r-5`} />{" "}
                        {data.amount}
                      </h3>
                    </div>
                    <div className="col-3 text-end">
                      <p className="m-b-0">{data.value}%</p>
                    </div>
                  </div>
                  <div className="progress m-t-30" style={{ height: "7px" }}>
                    <div
                      className={`progress-bar ${data.class}`}
                      role="progressbar"
                      style={{ width: `${data.value}%` }}
                      aria-valuenow={data.value}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}

      </Row>
    </>
  );
};

export default DashDefault;
