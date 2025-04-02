import React from 'react';
import '../../styles/PathStyles.css';
import './BaoCao.css'
import baoCaoData from './BaoCaoData'; 

function BaoCao() {
    return (
        <div className="page-container">
            <h1>Báo cáo công nợ</h1>
            <div className="content-wrapper">
                <div class="content-day">
                    <h2>Tháng:</h2>
                    <h2>Năm: </h2>
                </div>
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Mã KH</th>
                            <th>Tên KH</th>
                            <th>SĐT</th>
                            <th>Nợ đầu</th>
                            <th>Phát sinh</th>
                            <th>Nợ cuối</th>
                            <th>Ghi chú</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {baoCaoData.map((customer, index) => (
                            <tr key={index}>
                                <td>{customer.id}</td>
                                <td>{customer.name}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.startDebt}</td>
                                <td>{customer.change}</td>
                                <td>{customer.endDebt}</td>
                                <td>{customer.note}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BaoCao;