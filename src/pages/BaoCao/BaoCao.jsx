import React from 'react';
import { useState } from 'react';
import '../../styles/PathStyles.css';
import './BaoCao.css'
import baoCaoData from './BaoCaoData'; 

function BaoCao() {
    const [selectedMonth, setSelectedMonth] = useState('1');
    const [selectedYear, setSelectedYear] = useState('2024');
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 10 }, (_, i) => 2025 - i);

    return (
        <div className="page-container">
            <h1>Báo cáo công nợ</h1>
            <div className="content-wrapper">
                <div className="content-day">
                    <div className="date-group">
                        <h2>Tháng:</h2>
                        <select 
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            {months.map(month => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                    <div className="date-group">
                        <h2>Năm:</h2>
                        <select 
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
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