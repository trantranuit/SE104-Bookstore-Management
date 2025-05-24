import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import authService from '../services/authService';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = authService.getCurrentUser() !== null;
  
  if (!isAuthenticated) {
    // Nếu chưa đăng nhập, chuyển hướng tới trang đăng nhập
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  return children;
};

export default PrivateRoute;