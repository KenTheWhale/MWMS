import { Row, Col, Alert, Button } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../actions/AuthAction";
import { useState } from "react";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

const JWTLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const { error, loading } = useSelector((state) => state.authReducer);

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      await dispatch(loginUser(values.username, values.password));
      const permission = localStorage.getItem("role");
      switch (permission) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "STAFF":
          navigate("/staff");
          break;
        case "MANAGER":
          navigate("/manager");
          break;
        default:
          navigate("/login");
          break;
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string()
          .max(255, "Username must be at most 255 characters")
          .required("Username is required"),
        password: Yup.string().max(255).required("Password is required"),
      })}
      onSubmit={handleLogin}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <div className="form-group mb-3">
            <input
              className="form-control"
              label="Username"
              placeholder="Username"
              name="username"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.username}
            />
            {touched.username && errors.username && (
              <small className="text-danger form-text">{errors.username}</small>
            )}
          </div>

          <div className="form-group mb-4 position-relative">
            <input
              className="form-control pe-5" // Thêm pe-5 để tránh icon che mất text
              placeholder="Password"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              type={type}
              value={values.password}
            />
            {touched.password && errors.password && (
              <small className="text-danger form-text">{errors.password}</small>
            )}
            <span
              className="position-absolute end-0 top-50 translate-middle-y me-3"
              style={{ cursor: "pointer" }}
              onClick={handleToggle}
            >
              <Icon icon={icon} size={20} />
            </span>
          </div>

          <Row>
            <Col mt={2}>
              <Button
                className="btn-block mb-4"
                color="primary"
                disabled={loading}
                size="large"
                type="submit"
                variant="primary"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;
