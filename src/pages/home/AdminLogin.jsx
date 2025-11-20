import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminLogin.css';

const AdminLogin = () => {

  const [email_address, setEmail_Address] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  // const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState(null);
  // const userId = user?.id;

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        // Получаем CSRF токен с сервера
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/csrf-token`, {
          withCredentials: true, // чтобы получить cookie (если необходимо)
        });
        setCsrfToken(response?.data?.csrfToken); // Сохраняем CSRF токен в состояние
      } catch (error) {
        console.error("Ошибка при получении CSRF токена", error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!csrfToken) {
      setError('CSRF Token is missing');
      return;
    }

    try {
      // Отправляем запрос на логин с CSRF токеном в заголовке и данными в теле
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/login`,
        { email_address, adminPassword }, // Данные отправляются в теле запроса
        {
          headers: {
            'Content-Type': 'application/json', // Указываем тип данных
            'csrf-token': csrfToken,
          },
          withCredentials: true, // Отправляем cookie (если необходимо для сессии)
        }
      );

      // Сохраняем токен в localStorage
      localStorage.setItem('adminToken', res?.data?.token);
      
      // Перенаправляем на панель администратора
      window.location.href = '/2707200004032004'; // Адрес вашей панели

    } catch (err) {
      console.error("Login error:", err);
      setError('Invalid credentials or not authorized.');
    }
  };

  return (
    <div className="login-container_admin_login">
      <h2>Admin Login</h2>
      {error && <div className="error-message_admin_login">{error}</div>}
      <form onSubmit={handleLogin}>
        <div>
          <p>Username</p>
          <input
            type="text"
            value={email_address}
            onChange={(e) => setEmail_Address(e.target.value)}
            required
          />
        </div>
        <div>
          <p>Password</p>
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
