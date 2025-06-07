import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar/Navbar';
import TrangChu from './pages/TrangChu/TrangChu';
import TatCaSach from './pages/TatCaSach/TatCaSach';   
import NhapSach from './pages/NhapSach/NhapSach';  
import ThanhToanCu from './pages/ThanhToan/ThanhToanCu/ThanhToanCu';   
import ThanhToanMoi from './pages/ThanhToan/ThanhToanMoi/ThanhToanMoi';  
import HoaDon from './pages/ThanhToan/HoaDon/HoaDon'; 
import PhieuThuTien from './pages/ThanhToan/PhieuThuTien/PhieuThuTien';
import KhachHang from './pages/KhachHang/KhachHang';  
import BaoCaoTon from './pages/BaoCao/BaoCaoTon/BaoCaoTon';
import BaoCaoCongNo from './pages/BaoCao/BaoCaoCongNo/BaoCaoCongNo';
import PhanQuyen from './pages/PhanQuyen/PhanQuyen';  
import DangXuat from './pages/DangXuat/DangXuat';  
import ThayDoiQuyDinh from './pages/ThayDoiQuyDinh/ThayDoiQuyDinh';  
import Login from './pages/DangNhap/DangNhap';
import PrivateRoute from './components/PrivateRoute';
import ThemSach from "./pages/ThemSach/ThemSach";
import { ROUTES } from './constants';

function App() {
  // localStorage.removeItem('isLoggedIn');
  // localStorage.removeItem('user');
  return (
    <>
      <Router>
        <Routes>
          {/* Route đăng nhập - không cần PrivateRoute */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          
          {/* Các route được bảo vệ bởi PrivateRoute */}
          <Route path={ROUTES.HOME} element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="container">
                  <TrangChu />
                </div>
              </>
            </PrivateRoute>
          } />
          
          <Route path={ROUTES.ALL_BOOKS} element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="container">
                  <TatCaSach />
                </div>
              </>
            </PrivateRoute>
          } />
          
          <Route path={ROUTES.ADD_BOOK} element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="container">
                  <ThemSach />
                </div>
              </>
            </PrivateRoute>
          } />

          <Route path={ROUTES.IMPORT_BOOKS} element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="container">
                  <NhapSach />
                </div>
              </>
            </PrivateRoute>
          } />
          
          <Route path={ROUTES.PAYMENT_OLD} element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="container">
                  <ThanhToanCu />
                </div>
              </>
            </PrivateRoute>
          } />
          
          <Route path={ROUTES.PAYMENT_NEW} element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="container">
                  <ThanhToanMoi />
                </div>
              </>
            </PrivateRoute>
          } />

          <Route path={ROUTES.INVOICE} element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="container">
                  <HoaDon />
                </div>
              </>
            </PrivateRoute>
          } />  

          <Route path={ROUTES.RECEIPT} element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="container">
                  <PhieuThuTien />
                </div>
              </>
            </PrivateRoute>
          } />
          
          <Route path={ROUTES.CUSTOMERS} element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="container">
                  <KhachHang />
                </div>
              </>
            </PrivateRoute>
          } />
          
          <Route path={ROUTES.INVENTORY_REPORT} element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="container">
                  <BaoCaoTon />
                </div>
              </>
            </PrivateRoute>
          } />
          
          <Route path={ROUTES.DEBT_REPORT} element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="container">
                  <BaoCaoCongNo />
                </div>
              </>
            </PrivateRoute>
          } />
          
          <Route path={ROUTES.PERMISSIONS} element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="container">
                  <PhanQuyen />
                </div>
              </>
            </PrivateRoute>
          } />
          
          <Route path={ROUTES.LOGOUT} element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="container">
                  <DangXuat />
                </div>
              </>
            </PrivateRoute>
          } />
          
          <Route path={ROUTES.CHANGE_RULES} element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="container">
                  <ThayDoiQuyDinh />
                </div>
              </>
            </PrivateRoute>
          } />
          
          {/* Chuyển hướng mặc định đến trang đăng nhập nếu không tìm thấy route */}
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;