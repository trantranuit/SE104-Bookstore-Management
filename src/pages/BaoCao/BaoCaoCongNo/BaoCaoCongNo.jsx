import React, { useState, useEffect, useCallback } from 'react';
import '../../../styles/PathStyles.css';
import './BaoCaoCongNo.css';
import TableCongNo from './TableCongNo';

function BaoCaoCongNo() {
    const [selectedMonth, setSelectedMonth] = useState('1');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [pageSize, setPageSize] = useState(8); // Initial page size

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 10 }, (_, i) => 2025 - i);

    // Use useCallback to memoize calculatePageSize
    const calculatePageSize = useCallback(() => {
        const contentWrapper = document.querySelector('.content-wrapper');
        if (!contentWrapper) {
            return 8; // Default page size if content-wrapper is not available
        }

        const wrapperWidth = contentWrapper.offsetWidth;
        const wrapperHeight = contentWrapper.offsetHeight;
        const headerHeight = 100; // Adjust as needed
        const rowHeight = 60; // Adjust as needed

        let maxRowsBasedOnWidth;
        if (wrapperWidth < 640) { // Small screens (phones)
            maxRowsBasedOnWidth = 3;
        } else if (wrapperWidth < 1024) { // Medium screens (tablets)
            maxRowsBasedOnWidth = 5;
        } else { // Large screens (desktops)
            maxRowsBasedOnWidth = 8;
        }

        const calculatedRowsBasedOnHeight = Math.floor((wrapperHeight - headerHeight) / rowHeight);
        
        // Use the smaller value between width and height calculations
        const finalMaxRows = Math.min(maxRowsBasedOnWidth, calculatedRowsBasedOnHeight);
        
        return finalMaxRows;
    }, []);

    // Use useEffect to update pageSize when the component mounts and when the window resizes
    useEffect(() => {
        const handleResize = () => {
            setPageSize(calculatePageSize());
        };

        // Set initial page size
        setPageSize(calculatePageSize());

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [calculatePageSize]); // Dependency array includes calculatePageSize

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