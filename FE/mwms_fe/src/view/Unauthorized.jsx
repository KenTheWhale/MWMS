import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="display-3 text-danger">403</h1>
        <h2 className="text-dark">Access Denied</h2>
        <p className="text-muted">
          You don&#39;t have permission to access this page.
        </p>
        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          Return to login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
