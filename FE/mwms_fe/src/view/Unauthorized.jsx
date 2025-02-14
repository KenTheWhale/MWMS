import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="display-3 text-danger">403</h1>
        <h2 className="text-dark">Truy cập bị từ chối</h2>
        <p className="text-muted">
          Bạn không có quyền truy cập vào trang này. Vui lòng kiểm tra lại vai trò của bạn.
        </p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
