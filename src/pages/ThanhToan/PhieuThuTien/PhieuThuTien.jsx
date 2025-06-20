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

    const filteredReceipts = receipts.filter(receipt =>
        String(receipt.MaPhieuThu).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (receipt.NgayThu || '').includes(searchTerm)
    );

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
            <h1 className="page-title">Danh Sách Phiếu Thu Tiền</h1>            <div className="content-wrapper">
                <div className="search-filter-block-ptt">
                    <input
                        type="text"
                        placeholder="Tìm kiếm phiếu thu tiền..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="receipt-table-container-ptt">
                    <table className="receipt-table-ptt">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Mã Phiếu Thu</th>
                                <th>Mã Nhân Viên</th>
                                <th>Tên Nhân Viên</th>
                                <th>Mã Khách Hàng</th>
                                <th>Tên Khách Hàng</th>
                                <th>Ngày Lập</th>
                                <th>Số Tiền Trả</th>
                                <th>Hành Động</th>
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