import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../constants';

const PrivateRoute = ({ children }) => {
  // Kiểm tra xem người dùng đã đăng nhập chưa
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
if (!isLoggedIn) {
    return <Navigate to={ROUTES.LOGIN} replace />;
}

  // Nếu đã đăng nhập, hiển thị component con
return children;
};

export default PrivateRoute; 