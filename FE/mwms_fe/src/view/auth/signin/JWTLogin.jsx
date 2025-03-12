import { Button, Col, Row } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login } from "../../../services/AuthService.jsx";
import { enqueueSnackbar } from "notistack";

const JWTLogin = () => {
    const [type, setType] = useState("password");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [inputInfo, setInputInfo] = useState({
        username: "",
        password: "",
    });

    const handleLogin = async (values, { setSubmitting }) => {
        const response = await login(values.username, values.password);
        if (response) {
            if (response.success) {
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        id: response.data.id,
                        name: response.data.name,
                        role: response.data.role,
                        email: response.data.email,
                    })
                );
                enqueueSnackbar(response.message, { variant: "success" });
                switch (response.data.role) {
                    case "admin":
                        navigate("/admin");
                        break;
                    case "manager":
                        navigate("/manager");
                        break;
                    case "staff":
                        navigate("/staff");
                        break;
                    case "partner":
                        if (response.data.type && response.data.type === "requester") {
                            navigate("/rq");
                        } else {
                            navigate("/sp");
                        }
                        break;
                    default:
                        break;
                }
            } else {
                enqueueSnackbar(response.message, { variant: "error" });
            }
        }
        setSubmitting(false);
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
                  handleSubmit,
                  touched,
                  values, // Access Formik values
                  setFieldValue,
              }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <input
                            className="form-control"
                            label="Username"
                            placeholder="Username"
                            name="username"
                            onBlur={handleBlur}
                            onChange={(e) => {
                                setFieldValue(e.target.name, e.target.value); // Update Formik values
                                setInputInfo({ ...inputInfo, [e.target.name]: e.target.value });
                            }}
                            type="text"
                            value={values.username} // Use Formik values
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
                            onChange={(e) => {
                                setFieldValue(e.target.name, e.target.value); // Update Formik values
                                setInputInfo({ ...inputInfo, [e.target.name]: e.target.value });
                            }}
                            type={type}
                            value={values.password} // Use Formik values
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
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </span>
                    </div>

                    <Row>
                        <Col mt={2}>
                            <Button
                                className="btn-block mb-4"
                                color="primary"
                                size="large"
                                type="submit"
                                variant="primary"
                            >
                                Sign in
                            </Button>
                        </Col>
                    </Row>
                </form>
            )}
        </Formik>
    );
};

export default JWTLogin;