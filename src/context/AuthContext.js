import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ новое состояние

    // --- 🔁 Обновление токенов ---
  const refreshToken = async () => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/refresh`,
        {},
        { withCredentials: true,headers: { 'csrf-token': csrfToken }}
      );
      return true;
    } catch (err) {
      console.error('Token refresh failed:', err?.response?.data || err?.message);
      setUser(null);
      return false;
    }
  };

  // --- 🧩 Axios Interceptor ---
useEffect(() => {
      const interceptor = axios.interceptors.response.use(
      response => response, // если всё ок — просто возвращаем ответ
      async error => {
      const originalRequest = error?.config;

      // ✅ Если запрос к /refresh — не трогаем, иначе цикл
      if (originalRequest?.url?.includes(`${process.env.REACT_APP_API_URL}/api/auth/refresh`)) {
        setUser(null); // refresh токен недействителен — выходим
        return Promise.reject(error);
      }

      // Если токен истёк (401) и запрос ещё не повторяли
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshed = await refreshToken(); // пробуем обновить токен
        if (refreshed) {
          // если получилось — повторяем исходный запрос
          return axios(originalRequest);
        } else {
          // refresh не сработал — разлогиниваем пользователя
          setUser(null);
        }
      }

      return Promise.reject(error);
    }
  );
  // Очистка перехватчика при размонтировании компонента
  return () => axios.interceptors.response.eject(interceptor);
}, []);

useEffect(() => {
  if (!user) return; // пользователь не залогинен — таймер не запускаем

  const interval = setInterval(() => {
    refreshToken();
  }, 15 * 60 * 1000); // каждые 14 минут

  return () => clearInterval(interval);
}, [user]); // перезапускается, если user изменился


  // ✅ Проверяем авторизацию при монтировании приложения
   useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          withCredentials: true,
        });

        if (res.data?.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false); // ✅ загрузка завершена
      }
    };

    checkAuth();
  }, []); // вызывается один раз при загрузке страницы

  // 🔑 Получение CSRF токена
  const getCsrfToken = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/csrf-token`, {
      withCredentials: true,
    });
    return res.data.csrfToken;
  };

  // 🔑 Авторизация
  const login = async (email, password) => {
    try {
      const csrfToken = await getCsrfToken();

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { email_address: email, login_password: password },
        {
          withCredentials: true,
          headers: { 'csrf-token': csrfToken },
        }
      );
      const userId = response?.data?.userId || response?.data?.user?.id;
      const userEmail = response?.data?.userEmail || response?.data?.user?.email;

      if (userId)  setUser({ userId, userEmail });
    } catch (err) {
      const backendError =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message;
      console.error('Login failed:', backendError);
      throw new Error(backendError || 'Login failed');
    }
  };

  // 🚪 Logout
  const logout = async () => {
  try {
    const csrfToken = await getCsrfToken(); // Получаем CSRF токен

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/logout`,
      {},
      {
        withCredentials: true,  // Необходимо для отправки cookies
        headers: { 'csrf-token': csrfToken },  // Добавляем CSRF токен в заголовок
      }
    );

    // Если запрос прошел успешно, удаляем пользователя из состояния
    setUser(null);
  } catch (err) {
    const backendError =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message;

    console.error('Logout failed:', backendError);
    throw new Error(backendError || 'Logout failed, please try again');
  }
};

  return (
    <AuthContext.Provider value={{ user,loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
