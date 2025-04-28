import React from 'react';
import '../../styles/PathStyles.css';
import './KhachHang.css';
import TableKhachHang from './TableKhachHang';

function KhachHang() {
    return (
        <div className="page-container">
            <h1 className="page-title">Khách Hàng</h1>
            <div className="content-wrapper">
                <div className="customer-table-container">
                    <TableKhachHang />
                </div>
            </div>
        </div>
    );
}

export default KhachHang;