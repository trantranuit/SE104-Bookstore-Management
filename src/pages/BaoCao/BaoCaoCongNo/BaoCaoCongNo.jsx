import React, { useState, useCallback } from 'react';
import '../../../styles/PathStyles.css';
import './BaoCaoCongNo.css';
import TableCongNo from './TableCongNo';
import baoCaoCongNoData from './BaoCaoCongNoData'; // Import the data

function BaoCaoCongNo() {
    const [selectedMonth, setSelectedMonth] = useState('1');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [pageSize, setPageSize] = useState(8); 
    const [filteredData, setFilteredData] = useState([]); // State for filtered data

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 10 }, (_, i) => 2025 - i);

    const calculatePageSize = useCallback(() => {
        const contentWrapper = document.querySelector('.content-wrapper');
        if (!contentWrapper) {
            return 8; 
        }

        const wrapperWidth = contentWrapper.offsetWidth;
        const wrapperHeight = contentWrapper.offsetHeight;
        const headerHeight = 100; 
        const rowHeight = 60; 

        let maxRowsBasedOnWidth;
        if (wrapperWidth < 640) { 
            maxRowsBasedOnWidth = 3;
        } else if (wrapperWidth < 1024) { 
            maxRowsBasedOnWidth = 5;
        } else { // Large screens (desktops)
            maxRowsBasedOnWidth = 8;
        }

        const calculatedRowsBasedOnHeight = Math.floor((wrapperHeight - headerHeight) / rowHeight);
        return Math.min(maxRowsBasedOnWidth, calculatedRowsBasedOnHeight);
    }, []);

    const handleSubmit = () => {
        const filtered = baoCaoCongNoData.filter(item => {
            return item.month === parseInt(selectedMonth) && item.year === parseInt(selectedYear);
        });
        setFilteredData(filtered);
    };

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
                    <button className="submit-button" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
                {/* Pass filtered data and pageSize to TableCongNo */}
                <TableCongNo data={filteredData} pageSize={pageSize} />
            </div>
        </div>
    );
}

export default BaoCaoCongNo;