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
            } else {
                // Create new customer
                await customerService.createCustomer(customerData);
            }
            setIsModalOpen(false);
            // Trigger refresh after save
            setRefreshTrigger(prev => prev + 1);
            return true;
        } catch (err) {
            setError("Failed to save customer. Please try again.");
            console.error(err);
            throw err; // Rethrow to let the modal know the save failed
        }
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
            </div>
        </div>
    );
}

export default KhachHang; 