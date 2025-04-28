import React, { useState } from 'react';
import '../../styles/PathStyles.css';
import './KhachHang.css';
import TableKhachHang from './TableKhachHang';

function KhachHang() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Khách Hàng</h1>
            <div className="content-wrapper">
                <div className="action-bar">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã hoặc tên khách hàng..."
                        className="search-input"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button className="add-customer-button">+ Thêm khách hàng</button>
                </div>
                <TableKhachHang searchTerm={searchTerm} />
            </div>
        </div>
    );
}

export default KhachHang;