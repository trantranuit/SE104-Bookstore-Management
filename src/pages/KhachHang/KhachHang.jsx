// KhachHang.js
import React, { useState } from 'react';
import TableKhachHang from './TableKhachHang';
import CustomerModal from './CustomerModal';
import customerService from '../../services/customerService';
import './KhachHang.css';

function KhachHang() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleOpenModal = () => {
    setCurrentCustomer(null);
    setIsModalOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveCustomer = async (customerData) => {
    setError(null);
    try {
      if (customerData.MaKhachHang) {
        await customerService.updateCustomer(customerData.MaKhachHang, customerData);
        setSuccessMessage('Cập nhật thông tin khách hàng thành công!');
      } else {
        await customerService.createCustomer(customerData);
        setSuccessMessage('Thêm thông tin khách hàng thành công!');
      }
      setIsModalOpen(false);
      setShowSuccessModal(true);
      setRefreshTrigger(prev => prev + 1);
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Không thể lưu khách hàng. Vui lòng thử lại.';
      setError(errorMessage);
      console.error('Lỗi khi lưu khách hàng:', err);
      throw err;
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Khách Hàng</h1>
      {error && <div className="error-message">{error}</div>}
      
      <div className="content-wrapper">
        <div className="kh-action-bar">
          <input
            type="text"
            placeholder="Tìm kiếm Mã KH, tên hoặc số điện thoại..."
            className="kh-search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            className="add-customer-button"
            onClick={handleOpenModal}
          >
            + Thêm khách hàng
          </button>
        </div>

        <TableKhachHang
          searchTerm={searchTerm}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setCurrentCustomer={setCurrentCustomer}
          refreshTrigger={refreshTrigger}
          setRefreshTrigger={setRefreshTrigger}
        />

        {isModalOpen && (
          <CustomerModal
            customer={currentCustomer}
            onSave={handleSaveCustomer}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        {showSuccessModal && (
          <div className="success-modal-kh">
            <div className="success-modal-content-kh">
              <h2>{successMessage}</h2>
              <button className="success-modal-button-kh" onClick={handleCloseSuccessModal}>
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default KhachHang;