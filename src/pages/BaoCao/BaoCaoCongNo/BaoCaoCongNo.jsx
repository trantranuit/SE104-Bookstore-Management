import React, { useState, useEffect } from 'react';
import '../../../styles/PathStyles.css';
import './BaoCaoCongNo.css';
import TableCongNo from './TableCongNo';
import baoCaoCongNoData from './BaoCaoCongNoData'; 

function BaoCaoCongNo() {
    const [selectedMonth, setSelectedMonth] = useState('1');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [filteredData, setFilteredData] = useState([]); 

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 2 }, (_, i) => 2025 - i);

    // Hàm lọc dữ liệu
    const filterData = (month, year) => {
        const filtered = baoCaoCongNoData.filter(item => {
            return item.month === parseInt(month) && item.year === parseInt(year);
        });
        setFilteredData(filtered);
    };

    // Tự động lọc dữ liệu khi component được tải
    useEffect(() => {
        filterData(selectedMonth, selectedYear);
    }, []);

    const handleSubmit = () => {
        filterData(selectedMonth, selectedYear);
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
                        Hiển Thị
                    </button>
                </div>
                {/* Pass filtered data to TableCongNo */}
                <TableCongNo data={filteredData} />
            </div>
        </div>
    );
}

export default BaoCaoCongNo;