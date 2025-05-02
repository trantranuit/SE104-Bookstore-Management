import React, { useState } from 'react';
import '../../styles/PathStyles.css';
import './KhachHang.css';
import TableKhachHang from './TableKhachHang';

function KhachHang() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Khách Hàng</h1>
            <div className="content-wrapper">
                <div className="action-bar">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã, tên khách hàng hoặc mã hoá đơn..."
                        className="search-input"
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
                />
            </div>
        </div>
    );
}

export default KhachHang; 