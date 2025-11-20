// src/pages/home/Login.jsx
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { validationLoginSchema } from '../../schemas/login_validation_schema';
import ModalUsersErrors from '../../components/modalUsersErrors';
import { useAuth } from '../../context/AuthContext';
import login_banner_img from '../../images/login-banner.png';
import LoadingSpinner from '../../components/LoadingSpinner';
import '../home/login.css';

function Login() {
  
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [backendMessage, setBackendMessage] = useState('');
  const [pageLoading, setPageLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (user?.userId) navigate(`/user/${user.userId}`);
  }, [user, navigate]);

  const onSubmit = async (values) => {
    try {
      await login(values.email_address, values.login_password);
    } catch (err) {
      setBackendMessage(err?.message || 'Login failed. Please try again.');
    }
  };

  const closeModal = () => setBackendMessage('');

  const { handleChange, handleBlur, handleSubmit, values, errors, touched } = useFormik({
    initialValues: { email_address: '', login_password: '' },
    validationSchema: validationLoginSchema,
    onSubmit,
  });

    if (pageLoading) {
    return (
        <LoadingSpinner  />
    );
  }

  return (
    <div>
      <Header />
      <ModalUsersErrors message={backendMessage} onClose={closeModal} />

      <div className="login_page_parent_bg">
        <div className="login_page_parent_small_bg">
          <div className="login_page_small_div_content">
            <div className="login_page_small_div_content_parent">
              <form onSubmit={handleSubmit} className="login_page_small_div_content-form" autoComplete="off">
                <h2 className="login_page_small_div_content_h2">Account Login</h2>

                <h5 className="login_page_small_div_content_email">Email</h5>
                <input
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email_address}
                  className={errors?.email_address && touched?.email_address ? 'input-email-error' : 'login_page_small_div_content_login_input'}
                  type="email"
                  name="email_address"
                  placeholder="Please enter your email address"
                />
                {touched?.email_address && errors?.email_address && <p className="login_errors_massages">{errors?.email_address}</p>}

                <h5 className="login_page_small_div_content_password">Password</h5>
                <input
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.login_password}
                  className={errors?.login_password && touched?.login_password ? 'input-login-error' : 'login_page_small_div_content_login_input'}
                  type="password"
                  name="login_password"
                  placeholder="Please enter your password"
                />
                {touched?.login_password && errors?.login_password && <p className="login_errors_massages">{errors?.login_password}</p>}

                <input className="login_page_small_div_content_submit_input" type="submit" value="Login" />
              </form>
              <img className="login_page_small_div_content_banner" src={login_banner_img} alt="login banner" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
