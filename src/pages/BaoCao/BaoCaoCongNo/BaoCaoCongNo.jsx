import React, { useState, useEffect } from 'react';
import '../../../styles/PathStyles.css';
import './BaoCaoCongNo.css';
import TableCongNo from './TableCongNo';

function BaoCaoCongNo() {
    const [selectedMonth, setSelectedMonth] = useState('1');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [pageSize, setPageSize] = useState(calculatePageSize()); // State cho page size

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 10 }, (_, i) => 2025 - i);
    function calculatePageSize() {
        const windowHeight = window.innerHeight;
        const headerHeight = 250; // Increased to account for all header elements
        const rowHeight = 60; // Increased row height for better spacing
        const maxRows = 8; // Maximum number of rows to display
        
        const calculatedRows = Math.floor((windowHeight - headerHeight) / rowHeight);
        return Math.min(calculatedRows, maxRows);    
    }

    useEffect(() => {
        const handleResize = () => {
            setPageSize(calculatePageSize());
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
                {/* Truyền pageSize vào TableCongNo */}
                <TableCongNo pageSize={pageSize} />
            </div>
        </div>
    );
}

export default BaoCaoCongNo;
