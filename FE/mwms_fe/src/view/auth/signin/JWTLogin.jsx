import { Row, Col, Alert, Button } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../actions/AuthAction";
import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";

const JWTLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [type, setType] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const { error, loading } = useSelector((state) => state.authReducer);

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      await dispatch(loginUser(values.username, values.password));
      const permission = localStorage.getItem("role");
      const type = localStorage.getItem("type") ? localStorage.getItem("type") : null;
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
        case "PARTNER":
          if(type !== null){
            if (type === "supplier") {
              navigate("/sp/request");
            } else {
              navigate("/rq");
            }
          }
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
    setShowPassword(!showPassword);
    setType(showPassword ? "password" : "text");
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
              autoComplete="username"
            />
            {touched.username && errors.username && (
              <small className="text-danger form-text">{errors.username}</small>
            )}
          </div>

          <div className="form-group mb-4 position-relative">
            <input
              className="form-control pe-5"
              placeholder="Password"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              type={type}
              value={values.password}
              autoComplete="current-password"
            />
            {touched.password && errors.password && (
              <small className="text-danger form-text">{errors.password}</small>
            )}
            <span
              className="position-absolute end-0 top-50 translate-middle-y me-3"
              style={{ cursor: "pointer" }}
              onClick={handleToggle}
            >
              {showPassword ? (
                <Eye size={20} />
              ) : (
                <EyeOff size={20} />
              )}
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