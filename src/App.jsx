import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar/Navbar';
import TrangChu from './pages/TrangChu/TrangChu';
import TatCaSach from './pages/TatCaSach/TatCaSach';   
import NhapSach from './pages/NhapSach/NhapSach';  
import ThanhToanCu from './pages/ThanhToan/ThanhToanCu/ThanhToanCu';   
import ThanhToanMoi from './pages/ThanhToan/ThanhToanMoi/ThanhToanMoi';  
import KhachHang from './pages/KhachHang/KhachHang';  
import BaoCaoTon from './pages/BaoCao/BaoCaoTon/BaoCaoTon';
import BaoCaoCongNo from './pages/BaoCao/BaoCaoCongNo/BaoCaoCongNo';
import PhanQuyen from './pages/PhanQuyen/PhanQuyen';  
import DangXuat from './pages/DangXuat/DangXuat';  
import ThayDoiQuyDinh from './pages/ThayDoiQuyDinh/ThayDoiQuyDinh';  

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path='/' element={<TrangChu />} />
            <Route path='/tatcasach' element={<TatCaSach />} />
            <Route path='/nhapsach' element={<NhapSach />} />
            <Route path='/thanhtoan/cu' element={<ThanhToanCu />} />
            <Route path='/thanhtoan/moi' element={<ThanhToanMoi />} />
            <Route path='/khachhang' element={<KhachHang />} />
            <Route path='/baocao/ton' element={<BaoCaoTon />} />
            <Route path='/baocao/congno' element={<BaoCaoCongNo />} />
            <Route path='/phanquyen' element={<PhanQuyen />} />
            <Route path='/dangxuat' element={<DangXuat />} />
            <Route path='/thaydoiquydinh' element={<ThayDoiQuyDinh />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;