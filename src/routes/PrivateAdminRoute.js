import React from 'react';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const PrivateAdminRoute = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!res.ok) {
          // Если запрос не прошел (например, токен неправильный или истек), перенаправляем на страницу логина
          throw new Error('Unauthorized');
        }

        const data = await res.json();
        if (data?.isAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Admin check failed:', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!isAdmin) {
    return <Navigate to="/270720000403200420012015/" replace />; // Перенаправление на страницу логина, если не админ
  }

  return children; // Если админ, отображаем дочерние компоненты
};

export default PrivateAdminRoute;
