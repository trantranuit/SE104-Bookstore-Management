// CustomerModal.js
import React, { useState, useEffect } from 'react';

function CustomerModal({ customer, onSave, onClose }) {
  const [formData, setFormData] = useState({
    MaKhachHang: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    debtAmount: 0,
  });
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (customer) {
      setFormData({
        MaKhachHang: customer.MaKhachHang || '',
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        debtAmount: Number(customer.debtAmount) || 0,
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      if (value.length > 0 && (!/^\d*$/.test(value) || value.length > 10 || value.charAt(0) !== '0')) {
        setPhoneError('Số điện thoại phải là 10 chữ số và bắt đầu bằng 0');
      } else {
        setPhoneError('');
      }
    } else if (name === 'email') {
      setEmailError('');
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'debtAmount' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
      setPhoneError('Số điện thoại phải là 10 chữ số');
      setErrorMessage(`Không thể ${customer ? 'cập nhật' : 'thêm'} khách hàng do số điện thoại không hợp lệ`);
      setShowErrorModal(true);
      return;
    }
    
    const emailInput = document.querySelector('input[name="email"]');
    if (formData.email && !emailInput.checkValidity()) {
      setEmailError('Email không hợp lệ');
      setErrorMessage(`Không thể ${customer ? 'cập nhật' : 'thêm'} khách hàng do email không hợp lệ`);
      setShowErrorModal(true);
      return;
    }
    
    if (phoneError || emailError) {
      setErrorMessage(`Không thể ${customer ? 'cập nhật' : 'thêm'} khách hàng do thông tin không hợp lệ`);
      setShowErrorModal(true);
      return;
    }
    
    setSubmitting(true);
    try {
      const sanitizedData = {
        MaKhachHang: formData.MaKhachHang,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        debtAmount: Number(formData.debtAmount) || 0,
      };
      await onSave(sanitizedData);
    } catch (error) {
      setErrorMessage(error.message || `Không thể ${customer ? 'cập nhật' : 'thêm'} khách hàng`);
      setShowErrorModal(true);
      console.error('Lỗi khi lưu khách hàng:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div className="modal-overlay">
      <div className="kh-modal-content">
        <h2>{customer ? 'Cập Nhật Khách Hàng' : 'Thêm Khách Hàng'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ tên:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              maxLength={10}
            />
            {phoneError && <div className="error-message">{phoneError}</div>}
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {emailError && <div className="error-message">{emailError}</div>}
          </div>
          <div className="form-group">
            <label>Địa chỉ:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Số tiền nợ:</label>
            <input
              type="number"
              name="debtAmount"
              value={formData.debtAmount}
              onChange={handleChange}
              required
              min="0"
              disabled={true}
              className="disabled-input"
              style={{ backgroundColor: '#f0f0f0' }}
            />
          </div>
          <div className="modal-buttons">
            <button
              type="submit"
              disabled={!!phoneError || !!emailError || submitting}
              className={`submit-button ${(!!phoneError || !!emailError || submitting) ? 'submit-button-disabled' : ''}`}
              title={phoneError ? 'Số điện thoại không hợp lệ' : (emailError ? 'Email không hợp lệ' : '')}
            >
              {submitting ? 'Đang lưu...' : (customer ? 'Cập nhật' : 'Thêm')}
            </button>
            <button type="button" onClick={onClose} disabled={submitting}>
              Huỷ
            </button>
          </div>
        </form>
      </div>

      {showErrorModal && (
        <div className="modal-overlay error-modal-overlay">
          <div className="error-modal-content">
            <h3 className="error-modal-title">Lỗi</h3>
            <p className="error-message-center">{errorMessage}</p>
            <div className="error-modal-actions">
              <button
                onClick={closeErrorModal}
                className="error-modal-button"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerModal;