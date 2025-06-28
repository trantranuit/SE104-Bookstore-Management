import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import '../../../styles/PathStyles.css';
import './PhieuThuTien.css';
import phieuThuTienApi from '../../../services/phieuThuTienApi';

function PhieuThuTien() {
    const [searchTerm, setSearchTerm] = useState('');
    const [receipts, setReceipts] = useState([]);
    const [selectedReceiptId, setSelectedReceiptId] = useState(null);
    const [customerData, setCustomerData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [pdfUrl, setPdfUrl] = useState(null);
    const [showPdfModal, setShowPdfModal] = useState(false);

    const [pageInput, setPageInput] = useState(currentPage);
    const handlePageInputChange = (e) => {
    let value = e.target.value;
    setPageInput(value);
  };

    const handlePageSubmit = (e) => {
    e.preventDefault();
    let pageNumber = parseInt(pageInput);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else {
      setPageInput(currentPage);
    }
  };
  
    useEffect(() => {
        // Fetch all receipts
        phieuThuTienApi.getAllReceipts()
            .then(data => setReceipts(data))
            .catch(() => setReceipts([]));
        // Fetch all customers
        phieuThuTienApi.getAllCustomers()
            .then(data => setCustomerData(data))
            .catch(() => setCustomerData([]));
        // Fetch all employees
        phieuThuTienApi.getAllUsers()
            .then(data => setEmployeeData(data))
            .catch(() => setEmployeeData([]));
    }, []);

    // State cho modal lọc mã khách hàng
    const [showFilterMaKHModal, setShowFilterMaKHModal] = useState(false);
    const [filterMaKHInput, setFilterMaKHInput] = useState('');
    const [filterMaKHArr, setFilterMaKHArr] = useState([]);

    // State cho modal lọc mã nhân viên
    const [showFilterMaNVModal, setShowFilterMaNVModal] = useState(false);
    const [filterMaNVInput, setFilterMaNVInput] = useState('');
    const [filterMaNVArr, setFilterMaNVArr] = useState([]);

    // State cho modal lọc số tiền trả
    const [showFilterSoTienModal, setShowFilterSoTienModal] = useState(false);
    const [filterSoTienInput, setFilterSoTienInput] = useState('');
    const [filterSoTienArr, setFilterSoTienArr] = useState([]);
    const [filterSoTienRange, setFilterSoTienRange] = useState({ min: '', max: '' });

    // Lọc receipts theo searchTerm, mã khách hàng, mã nhân viên, số tiền trả
    const filteredReceipts = receipts.filter(receipt => {
        // Lọc theo searchTerm
        const matchSearch = (
            String(receipt.MaPhieuThu).toLowerCase().includes(searchTerm.toLowerCase()) ||
            (receipt.NgayThu || '').includes(searchTerm)
        );
        // Lọc theo mã khách hàng
        const matchMaKH = filterMaKHArr.length === 0 || filterMaKHArr.includes(String(receipt.MaKH));
        // Lọc theo mã nhân viên
        const matchMaNV = filterMaNVArr.length === 0 || filterMaNVArr.includes(formatEmployeeId(receipt.NguoiThu));
        // Lọc theo số tiền trả
        let matchSoTien = true;
        const soTien = Number(receipt.SoTienThu) || 0;
        if (filterSoTienArr.length > 0) {
            matchSoTien = filterSoTienArr.includes(soTien);
        }
        if (filterSoTienRange.min !== '' && filterSoTienRange.max !== '') {
            matchSoTien = matchSoTien && soTien >= Number(filterSoTienRange.min) && soTien <= Number(filterSoTienRange.max);
        }
        return matchSearch && matchMaKH && matchMaNV && matchSoTien;
    });

    //print
    
    const handlePrintPT = async () => {
        if (!selectedReceiptId) {
            console.error('No receipt ID found');
            return;
        }
        
        try {
            const receiptId = selectedReceiptId.toString().replace(/^PT/, '');
            console.log('Printing receipt with ID:', receiptId); // Debug log
            
            const response = await fetch(`http://localhost:8000/api/phieuthutien/${receiptId}/export-pdf/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
                    'Content-Type': 'application/pdf',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setPdfUrl(url);
            setShowPdfModal(true);
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                response: error.response
            });
            alert('Có lỗi khi in phiếu thu tiền. Vui lòng thử lại.');
        }
    };

    // Calculate pagination
    const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentReceipts = filteredReceipts.slice(startIndex, endIndex);

    const handleViewReceipt = (maPhieuThu) => {
        setSelectedReceiptId(maPhieuThu);
    };

    const handleCloseModal = () => {
        setSelectedReceiptId(null);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const selectedReceipt = selectedReceiptId ? filteredReceipts.find(r => r.MaPhieuThu === selectedReceiptId) : null;

    // Get customer info by MaKH
    const getCustomerInfo = (maKH) => customerData.find(c => String(c.MaKhachHang) === String(maKH));

    // Get employee info by NguoiThu (NVxxx format)
    const getEmployeeInfo = (nguoiThu) => {
        if (!nguoiThu) return null;
        // Extract numeric ID by removing 'NV' and leading zeros
        const numericId = parseInt(nguoiThu.replace(/^NV0*/, ''), 10);
        // Find employee by numeric ID
        return employeeData.find(e => e.id === numericId) || null;
    };

    // Format NguoiThu to NVxxx
    const formatEmployeeId = (nguoiThu) => {
        if (!nguoiThu) return 'N/A';
        // If already in NVxxx format, return as is
        if (nguoiThu.startsWith('NV') && nguoiThu.length === 5) return nguoiThu;
        // Extract numeric ID and format as NVxxx
        const numericId = parseInt(nguoiThu.replace(/^NV0*/, ''), 10);
        return isNaN(numericId) ? 'N/A' : `NV${numericId.toString().padStart(3, '0')}`;
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Danh Sách Phiếu Thu Tiền</h1>
            <div className="content-wrapper">
                <div className="search-filter-block-ptt" style={{ display: 'flex', alignItems: 'center', gap: 8}}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm phiếu thu tiền theo ngày nhập ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{  height: "3rem", borderRadius: "0.4rem", padding: "1.2rem" }}
                    />
                    <button
                        className="filter-button-ptt "
                        onClick={() => setShowFilterMaKHModal(true)}
                    >
                        Lọc theo mã khách hàng
                    </button>
                    <button
                        className="filter-button-ptt "
                        onClick={() => setShowFilterMaNVModal(true)}
                    >
                        Lọc theo mã nhân viên
                    </button>
                    <button
                        className="filter-button-ptt "
                        onClick={() => setShowFilterSoTienModal(true)}
                    >
                        Lọc theo số tiền trả
                    </button>
                </div>
                {/* Modal lọc mã khách hàng */}
                {showFilterMaKHModal && (
                    <div className="modal-overlay-ptt">
                        <div className="modal-new-ptt">
                            <h3 className="modal-title-new-ptt">Lọc theo mã khách hàng</h3>
                            <input
                                className="modal-ptt-filter-input"
                                type="text"
                                placeholder="Nhập các mã khách hàng, cách nhau bởi dấu phẩy"
                                value={filterMaKHInput}
                                onChange={e => setFilterMaKHInput(e.target.value)}
                                style={{ height: "3rem", padding: "0.6rem", borderRadius: "0.4rem" }}
                            />
                            <div className="modal-buttons-ptt">
                                <button
                                    className="apply-button-ptt"
                                    onClick={() => {
                                        setFilterMaKHArr(
                                            filterMaKHInput
                                                .split(',')
                                                .map(s => s.trim())
                                                .filter(Boolean)
                                        );
                                        setShowFilterMaKHModal(false);
                                    }}
                                >
                                    Áp dụng
                                </button>
                                <button
                                    className="cancel-button-new-ptt"
                                    onClick={() => {
                                        setFilterMaKHArr([]);
                                        setFilterMaKHInput('');
                                        setShowFilterMaKHModal(false);
                                    }}
                                >
                                    Hủy áp dụng
                                </button>
                                <button
                                    className="close-button-new-ptt"
                                    onClick={() => setShowFilterMaKHModal(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Modal lọc mã nhân viên */}
                {showFilterMaNVModal && (
                    <div className="modal-overlay-ptt">
                        <div className="modal-new-ptt">
                            <h3 className="modal-title-new-ptt">Lọc theo mã nhân viên</h3>
                            <input
                                className="modal-ptt-filter-input"
                                type="text"
                                placeholder="Nhập các mã nhân viên, cách nhau bởi dấu phẩy (VD: NV001,NV002)"
                                value={filterMaNVInput}
                                onChange={e => setFilterMaNVInput(e.target.value)}
                                style={{ height: "3rem", padding: "0.6rem", borderRadius: "0.4rem" }}
                            />
                            <div className="modal-buttons-ptt">
                                <button
                                    className="apply-button-ptt"
                                    onClick={() => {
                                        setFilterMaNVArr(
                                            filterMaNVInput
                                                .split(',')
                                                .map(s => s.trim())
                                                .filter(Boolean)
                                        );
                                        setShowFilterMaNVModal(false);
                                    }}
                                >
                                    Áp dụng
                                </button>
                                <button
                                    className="cancel-button-new-ptt"
                                    onClick={() => {
                                        setFilterMaNVArr([]);
                                        setFilterMaNVInput('');
                                        setShowFilterMaNVModal(false);
                                    }}
                                >
                                    Hủy áp dụng
                                </button>
                                <button
                                    className="close-button-new-ptt"
                                    onClick={() => setShowFilterMaNVModal(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Modal lọc số tiền trả */}
                {showFilterSoTienModal && (
                    <div className="modal-overlay-ptt">
                        <div className="modal-new-ptt">
                            <h2 className="modal-title-new-ptt">Lọc theo số tiền trả</h2>
                            <h3>Nhập khoảng số tiền trả </h3>
                            <input
                                className="modal-ptt-filter-input"
                                type="text"
                                placeholder="Nhập các số tiền, cách nhau bởi dấu phẩy (VD: 10000,20000)"
                                value={filterSoTienInput}
                                onChange={e => setFilterSoTienInput(e.target.value)}
                                style={{ height: "3rem", padding: "0.6rem", borderRadius: "0.4rem", marginBottom: 8 }}
                            />
                            <h3>Nhập cụ thể số tiền trả</h3>
                            <div style={{ width: '100%', display: 'flex', gap: 8, marginBottom: 8 }}>
                                
                                <input
                                    className="modal-ptt-filter-input"
                                    type="number"
                                    placeholder="Từ"
                                    value={filterSoTienRange.min}
                                    onChange={e => setFilterSoTienRange(r => ({ ...r, min: e.target.value }))}
                                    style={{ flex: 1, height: "2.5rem", borderRadius: "0.4rem", paddingLeft: "0.6rem" }}
                                />
                                
                                <input
                                    className="modal-ptt-filter-input"
                                    type="number"
                                    placeholder="Đến"
                                    value={filterSoTienRange.max}
                                    onChange={e => setFilterSoTienRange(r => ({ ...r, max: e.target.value }))}
                                    style={{ flex: 1, height: "2.5rem", borderRadius: "0.4rem", paddingLeft: "0.6rem" }}
                                />
                            </div>
                            <div className="modal-buttons-ptt">
                                <button
                                    className="apply-button-ptt"
                                    onClick={() => {
                                        setFilterSoTienArr(
                                            filterSoTienInput
                                                .split(',')
                                                .map(s => Number(s.trim()))
                                                .filter(v => !isNaN(v) && v !== '')
                                        );
                                        setShowFilterSoTienModal(false);
                                    }}
                                >
                                    Áp dụng
                                </button>
                                <button
                                    className="cancel-button-new-ptt"
                                    onClick={() => {
                                        setFilterSoTienArr([]);
                                        setFilterSoTienInput('');
                                        setFilterSoTienRange({ min: '', max: '' });
                                        setShowFilterSoTienModal(false);
                                    }}
                                >
                                    Hủy áp dụng
                                </button>
                                <button
                                    className="close-button-new-ptt"
                                    onClick={() => setShowFilterSoTienModal(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="receipt-table-container-ptt" style={{ paddingBottom: '2rem' }}>
                    <table className="receipt-table-ptt">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Mã phiếu thu</th>
                                <th>Mã nhân viên</th>
                                <th>Tên nhân viên</th>
                                <th>Mã khách hàng</th>
                                <th>Tên khách hàng</th>
                                <th>Ngày lập</th>
                                <th>Số tiền trả</th>
                                <th>Xem chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentReceipts.map((receipt, index) => {
                                const employee = getEmployeeInfo(receipt.NguoiThu);
                                const customer = getCustomerInfo(receipt.MaKH);
                                return (
                                    <tr key={receipt.MaPhieuThu}>
                                        <td>{startIndex + index + 1}</td>
                                        <td>{receipt.MaPhieuThu}</td>
                                        <td>{formatEmployeeId(receipt.NguoiThu)}</td>
                                        <td>{employee ? `${employee.last_name} ${employee.first_name}` : 'N/A'}</td>
                                        <td>{receipt.MaKH || 'N/A'}</td>
                                        <td>{customer ? customer.HoTen : 'N/A'}</td>
                                        <td>{receipt.NgayThu || 'N/A'}</td>
                                        <td>{receipt.SoTienThu ? Number(receipt.SoTienThu).toLocaleString('vi-VN') : '0'}đ</td>
                                        <td>
                                            <div className="edit-buttons-ptt">
                                            <FontAwesomeIcon
                                                icon={faEdit}
                                                className="edit-button-ptt"
                                                onClick={() => handleViewReceipt(receipt.MaPhieuThu)}
                                            />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                               <div className="pagination-buttons-ptt">
                    <button 
                        onClick={handlePreviousPage} 
                        disabled={currentPage === 1}
                        className="pagination-button-ptt-button"
                    >
                        ←
                    </button>
                    {/* <span className="pagination-info-ptt"> */}
                        <form onSubmit={handlePageSubmit} className="nhap-sach-page-input-form">
                        <span>Trang </span>
                        <input
                            type="number"
                            value={pageInput}
                            onChange={handlePageInputChange}
                            min="1"
                            max={totalPages}
                            className="nhap-sach-page-input"
                        />
                        <span>/{Math.max(1, totalPages)}</span>
                        </form>
                    <button 
                        onClick={handleNextPage} 
                        disabled={currentPage === totalPages}
                        className="pagination-button-ptt-button"
                    >
                        →
                    </button>
                </div>
            </div>
            </div> 
            {selectedReceipt && (
                <div className="modal-ptt">
                    <div className="modal-content-ptt">
                        <h2 className="modal-title-ptt">CHI TIẾT PHIẾU THU TIỀN</h2>
                        <div className="modal-columns-ptt">
                            <div className="modal-left-ptt" style={{ textAlign: 'left' }}>
                                <h3 className="section-header-ptt">Thông Tin Phiếu Thu</h3>
                                <p><strong>Ngày Thu:</strong> {selectedReceipt.NgayThu || 'N/A'}</p>
                                <p><strong>Mã Phiếu Thu:</strong> {selectedReceipt.MaPhieuThu || 'N/A'}</p>
                                <p><strong>Mã Nhân Viên:</strong> {formatEmployeeId(selectedReceipt.NguoiThu)}</p>
                                <p>
                                    <strong>Họ Tên:</strong> {(() => {
                                        const emp = getEmployeeInfo(selectedReceipt.NguoiThu);
                                        return emp ? `${emp.last_name} ${emp.first_name}` : 'N/A';
                                    })()}
                                </p>
                            </div>
                            <div className="modal-right-ptt">
                                <h3 className="section-header-ptt">Thông Tin Khách Hàng</h3>
                                <p><strong>Mã Khách:</strong> {selectedReceipt.MaKH || 'N/A'}</p>
                                <p>
                                    <strong>Họ Tên:</strong> {(() => {
                                        const cus = getCustomerInfo(selectedReceipt.MaKH);
                                        return cus ? cus.HoTen : 'N/A';
                                    })()}
                                </p>
                                <p>
                                    <strong>Số Điện Thoại:</strong> {(() => {
                                        const cus = getCustomerInfo(selectedReceipt.MaKH);
                                        return cus ? cus.DienThoai : 'N/A';
                                    })()}
                                </p>
                                <p>
                                    <strong>Email:</strong> {(() => {
                                        const cus = getCustomerInfo(selectedReceipt.MaKH);
                                        return cus ? cus.Email : 'N/A';
                                    })()}
                                </p>
                                <p><strong>Số Tiền Thu:</strong> {selectedReceipt.SoTienThu ? Number(selectedReceipt.SoTienThu).toLocaleString('vi-VN') : '0'}đ</p>
                            </div>
                        </div>
                        <div className="modal-actions-ptt">
                            <button className="print-button-ptt" onClick={handlePrintPT} style={{ marginRight: '20px', width: '150px' }}>
                                In phiếu thu
                            </button>
                            <button className="close-button-ptt" onClick={handleCloseModal}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showPdfModal && pdfUrl && (
                <div className="modal-ptt" onClick={(e) => {
                    if (e.target.className === 'modal-ptt') {
                        setShowPdfModal(false);
                        window.URL.revokeObjectURL(pdfUrl);
                        setPdfUrl(null);
                    }
                }}>
                    <div className="modal-content-ptt" style={{ width: '80vw', height: '90vh', padding: 0 }}>
                        <iframe
                            src={pdfUrl}
                            title="Receipt PDF"
                            width="100%"
                            height="100%"
                            style={{ border: 'none'}}
                        />
                        <div style={{ textAlign: 'right', padding: 8 }}>
                            <button
                                className="close-button-ptt"
                                onClick={() => {
                                    setShowPdfModal(false);
                                    window.URL.revokeObjectURL(pdfUrl);
                                    setPdfUrl(null);
                                }}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
       
    );
}

export default PhieuThuTien;