import React, { useState, useEffect } from 'react';
import '../../../styles/PathStyles.css';
import './BaoCaoTon.css';
import TableTon from './TableTon';
import baoCaoTonService from '../../../services/baoCaoTonService';

function BaoCaoTon() {
    const [selectedMonth, setSelectedMonth] = useState('12');
    const [selectedYear, setSelectedYear] = useState('2024');

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 2 }, (_, i) => 2025 - i);

    return (
        <div className="page-container">
            <h1 className="page-title">Báo Cáo Tồn</h1>
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
                    <button className="submit-button">
                        Hiển Thị
                    </button>
                </div>
                <TableTon month={parseInt(selectedMonth)} year={parseInt(selectedYear)} />
            </div>
        </div>
    );
}

export default BaoCaoTon;