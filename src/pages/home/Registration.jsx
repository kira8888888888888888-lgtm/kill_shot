import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { useFormik } from 'formik';
import axios from 'axios';
import ModalUsersErrors from '../../components/modalUsersErrors';
import VerificationCodeModal from '../../components/VerificationCodeModal';
import { validationRegistrationSchema } from '../../schemas/registration_validation_schema';
import login_banner_img from '../../images/login-banner.png';
import LoadingSpinner from '../../components/LoadingSpinner';
import '../home/registration.css';


function Registration() {
  const [csrfToken, setCsrfToken] = useState('');
  const [backendMessage, setBackendMessage] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [pageLoading, setPageLoading] = useState(false);
  
  useEffect(() => {
      const timer = setTimeout(() => setPageLoading(false), 1000);
      return () => clearTimeout(timer);
    }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/auth/csrf-token`, { withCredentials: true })
      .then(res => {
        const token = res?.data?.csrfToken;
        if (token) {
          setCsrfToken(token);
          axios.defaults.headers.post['X-CSRF-Token'] = token;
        } else {
          setBackendMessage('CSRF token missing or invalid.');
        }
      })
      .catch(err => {
        
        setBackendMessage('Could not fetch CSRF token. Please reload the page.');
      });
  }, []);

  const onSubmit = async (values) => {
    setPageLoading(true)
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, values, { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true });
      setRegisteredEmail(values?.email_address);
      setShowVerificationModal(true);
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || "Unknown error occurred";
      setBackendMessage(message);
    }finally{
      setPageLoading(false)
    }
  };

  const closeModal = () => setBackendMessage('');
  const closeVerificationModal = () => setShowVerificationModal(false);

  const { handleChange, handleBlur, handleSubmit, values, errors, touched } = useFormik({
    initialValues: {
      email_address: '',
      registration_password: '',
      confirm_password: ''
    },
    validationSchema: validationRegistrationSchema,
    onSubmit,
  });
    if (pageLoading) {
    return (
        <LoadingSpinner />
    );
  }

  return (
    <div>
      <Header />
      <ModalUsersErrors message={backendMessage} onClose={closeModal} />
      <VerificationCodeModal isOpen={showVerificationModal} onClose={closeVerificationModal} email={registeredEmail} csrfToken={csrfToken} />

      <div className='login_page_parent_bg'>
        <div className='login_page_parent_small_bg'>
          <div className='login_page_small_div_content'>
            <div className='login_page_small_div_content_parent'>
              <form onSubmit={handleSubmit} className='login_page_small_div_content-form' autoComplete='off'>
                <h2 className='login_page_small_div_content_h2'>Create Account</h2>
                <h5 className='login_page_small_div_content_email'>Email</h5>
                <input
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email_address}
                  className={errors?.email_address && touched?.email_address ? "input-email-error" : "login_page_small_div_content_login_input"}
                  type="text"
                  name="email_address"
                  placeholder='Please enter your email address'
                />
                {touched?.email_address && errors?.email_address && <p className='login_errors_massages'>{errors?.email_address}</p>}
                <div>
                  <span className='login_page_small_div_content_password'>Password</span>
                  <input
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.registration_password}
                    className={errors?.registration_password && touched?.registration_password ? "input-login-error" : "login_page_small_div_content_login_input"}
                    placeholder='Please enter your password'
                    type="password"
                    name="registration_password"
                  />
                  <div style={{ width: '100%' }}>
                    {touched?.registration_password && errors?.registration_password && <span className='login_errors_massages'>{errors?.registration_password}</span>}
                  </div>
                  <span className='login_page_small_div_content_password'>Confirm Password</span>
                  <input
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.confirm_password}
                    className={errors?.confirm_password && touched?.confirm_password ? "input-login-error" : "login_page_small_div_content_login_input"}
                    placeholder='Please enter your password again'
                    type="password"
                    name="confirm_password"
                  />
                  <div style={{ width: '100%' }}>
                    {touched?.confirm_password && errors?.confirm_password && <span className='login_errors_massages'>{errors?.confirm_password}</span>}
                  </div>

                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '3px' }}>
                </div>

                <input disabled={pageLoading} className='login_page_small_div_content_submit_input' type="submit" value="Register" />
              </form>
              <img className='login_page_small_div_content_banner' src={login_banner_img} alt="login banner" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
