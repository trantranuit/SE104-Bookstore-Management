import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import './DangXuat.css';

const DangXuat = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Xóa thông tin đăng nhập
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    
    // Chuyển hướng đến trang đăng nhập
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  return (
    <div className="logout-container">
      <h2>Đang đăng xuất...</h2>
      <p>Vui lòng đợi trong giây lát.</p>
    </div>
  );
};

export default DangXuat;
