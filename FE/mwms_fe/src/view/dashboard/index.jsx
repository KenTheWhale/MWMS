import {Card, Col, Row, Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';
import style from '../../styles/Admin.module.css';
import { useEffect, useState } from 'react';
import { axiosClient } from '../../config/api';
import { toast } from 'react-toastify';

const DashDefault = () => {
  const [dashData, setDashData] = useState([]);
  const [salesData, setSalesData] = useState([
    { title: 'Daily Sales', amount: '$249.95', icon: 'icon-arrow-up text-c-green', value: 50, class: 'progress-c-theme' },
    { title: 'Monthly Sales', amount: '$2.942.32', icon: 'icon-arrow-down text-c-red', value: 36, class: 'progress-c-theme2' },
    { title: 'Yearly Sales', amount: '$8.638.32', icon: 'icon-arrow-up text-c-green', value: 70, color: 'progress-c-theme' }
  ]);

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/user");
      console.log(response.data);
      setDashData(response.data);
    } catch (error) {
      toast.error("Something Wrong....", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
      <Row className={style.screen} style={{overflowY : "scroll", height: "100vh", marginLeft: "0.5px", marginRight: "0.5px"}}>
        {salesData.map((data, index) => {
          return (
            <Col key={index} xl={6} xxl={4} className='mt-5'>
              <Card>
                <Card.Body>
                  <h6 className="mb-4">{data.title}</h6>
                  <div className="row d-flex align-items-center">
                    <div className="col-9">
                      <h3 className="f-w-300 d-flex align-items-center m-b-0">
                        <i className={`feather ${data.icon} f-30 m-r-5`} /> {data.amount}
                      </h3>
                    </div>
                    <div className="col-3 text-end">
                      <p className="m-b-0">{data.value}%</p>
                    </div>
                  </div>
                  <div className="progress m-t-30" style={{ height: '7px' }}>
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
        <Col md={6} xl={12}>
          <Card className="Recent-Users widget-focus-lg">
            <Card.Header>
              <Card.Title as="h5">All Users</Card.Title>
            </Card.Header>
            <Card.Body className="px-0 py-2">
              <Table responsive hover className="recent-users">
                <tbody>
                  {dashData && dashData.length > 0 ? 
                    dashData.map((item) => (
                      <tr className="unread" key={item.id}>
                        <td>
                          <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
                        </td>
                        <td>
                          <h6 className="mb-1">{item.fullName || 'User'}</h6>
                          <p className="m-0">ID: {item.id}</p>
                        </td>
                        <td>
                          <h6 className="text-muted">
                            {item.phone}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-muted">
                            <i className={`fa fa-circle ${item.status == "active" ? "text-c-green" : "text-c-gray"} f-10 m-r-15`} />
                            {item.status}
                          </h6>
                        </td>
                        <td>
                          <Link to="#" className="label theme-bg2 text-white f-12">
                            Reject
                          </Link>
                          <Link to="#" className="label theme-bg text-white f-12">
                            Approve
                          </Link>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="text-center">No users found</td>
                      </tr>
                    )
                  }
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
  );
};

export default DashDefault;