import {useState} from 'react';
import {Alert, Button, Col, Row} from 'react-bootstrap';
import * as Yup from 'yup';
import {Formik} from 'formik';
import axiosClient from '../../../assets/api';
import {useNavigate} from 'react-router-dom';

const JWTLogin = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await axiosClient.post('/auth/login', {
        username: values.username,
        password: values.password
      });

      if (response.data) {
        localStorage.setItem('accessToken', response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        username: '',
        password: ''
      }}

      validationSchema={Yup.object().shape({
        username: Yup.string()
          .max(255, 'Username must be at most 255 characters')
          .required('Username is required'),
        password: Yup.string()
          .max(255)
          .required('Password is required')
      })}
      onSubmit={handleLogin}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
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
              placeholder='Username'
              name="username"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.username}
            />
            {touched.username && errors.username && 
              <small className="text-danger form-text">{errors.username}</small>
            }
          </div>

          <div className="form-group mb-4">
            <input
              className="form-control"
              label="Password"
              placeholder="Password"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              value={values.password}
            />
            {touched.password && errors.password && 
              <small className="text-danger form-text">{errors.password}</small>
            }
          </div>

          <div className="custom-control custom-checkbox text-start mb-4 mt-2">
            <input type="checkbox" className="custom-control-input mx-2" id="customCheck1" />
            <label className="custom-control-label" htmlFor="customCheck1">
              Save credentials.
            </label>
          </div>

          <Row>
            <Col mt={2}>
              <Button 
                className="btn-block mb-4" 
                color="primary" 
                disabled={isSubmitting} 
                size="large" 
                type="submit" 
                variant="primary"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;