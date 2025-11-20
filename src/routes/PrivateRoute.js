import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // или где у тебя есть контекст для аутентификации
import LoadingSpinner from '../components/LoadingSpinner';


const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // пока идёт проверка — можно показывать спиннер или пустой экран
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
