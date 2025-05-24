import React, { useState, useCallback } from 'react';
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
    const [successMessage, setSuccessMessage] = useState("");

    const handleOpenModal = () => {
        setCurrentCustomer(null); // Reset customer for adding new one
        setIsModalOpen(true);
    };

    // Add handleSearchChange function
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSaveCustomer = async (customerData) => {
        setError(null);
        try {
            if (customerData.id) {
                // Update existing customer
                await customerService.updateCustomer(customerData.id, customerData);
                setSuccessMessage("Cập nhật thông tin khách hàng thành công!");
            } else {
                // Create new customer
                await customerService.createCustomer(customerData);
                setSuccessMessage("Thêm thông tin khách hàng thành công!");
            }
            
            // Close the edit modal immediately
            setIsModalOpen(false);
            
            // Show success modal 
            setShowSuccessModal(true);
            
            // Trigger refresh after save
            setRefreshTrigger(prev => prev + 1);
            return true;
        } catch (err) {
            setError("Failed to save customer. Please try again.");
            console.error(err);
            throw err; // Rethrow to let the modal know the save failed
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Khách Hàng</h1>
            {error && <div className="error-message">{error}</div>}
            
            <div className="content-wrapper content-wrapper-kh">
                <div className="kh-action-bar">
                    <input
                        type="text"
                        placeholder="Tìm kiếm tên khách hàng hoặc số điện thoại..."
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
                    <div className="success-modal">
                        <div className="success-modal-content">
                            <h3>Thông báo</h3>
                            <p>{successMessage}</p>
                            <button className="success-modal-button" onClick={handleCloseSuccessModal}>
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default KhachHang;