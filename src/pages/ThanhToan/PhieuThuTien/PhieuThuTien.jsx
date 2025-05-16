import React, { useState, useEffect } from 'react';
import { PiNotePencil } from "react-icons/pi"; // Import the icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../../styles/PathStyles.css';
import './PhieuThuTien.css'; // Ensure this CSS file is imported

function PhieuThuTien() {
    const [searchTerm, setSearchTerm] = useState('');
    const [receipts, setReceipts] = useState([]);
    const [selectedReceiptIndex, setSelectedReceiptIndex] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showDeleteNotification, setShowDeleteNotification] = useState(false);
    const [deletedReceiptId, setDeletedReceiptId] = useState('');

    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const storedReceipts = JSON.parse(localStorage.getItem('receipts') || '[]');
        setReceipts(storedReceipts); // Load receipts from localStorage
    }, []);

    const filteredReceipts = receipts.filter(receipt =>
        receipt.maPhieuThu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.ngayLap.includes(searchTerm)
    );

    const handleViewReceipt = (index) => {
        setSelectedReceiptIndex(index);
    };

    const handleCloseModal = () => {
        setSelectedReceiptIndex(null);
    };

    const handleEditReceipt = () => {
        const selectedReceipt = receipts[selectedReceiptIndex];
        navigate('/thanhtoan/cu', { state: { receipt: selectedReceipt, isEditing: true } }); // Pass isEditing flag
    };

    const generateNewReceiptId = () => {
        const existingReceipts = JSON.parse(localStorage.getItem('receipts') || '[]');
        let nextIdNumber = existingReceipts.length > 0
            ? Math.max(...existingReceipts.map(r => parseInt(r.maPhieuThu.replace('PT', '')))) + 1
            : 1;
        return `PT${String(nextIdNumber).padStart(3, '0')}`; // Ensure 3-digit format
    };

    const handleSaveEditedReceipt = (updatedReceipt) => {
        const requiredFields = ['maPhieuThu', 'nguoiLapPhieu', 'maKhachHang', 'ngayLap', 'soTienTra'];
        const hasError = requiredFields.some((field) => !updatedReceipt[field]);

        if (hasError) {
            alert('Vui lòng điền đầy đủ thông tin trước khi lưu.');
            return;
        }

        const newReceiptId = generateNewReceiptId(); // Generate a new unique receipt ID
        const updatedReceiptWithNewId = { ...updatedReceipt, maPhieuThu: newReceiptId };

        const updatedReceipts = receipts.map((receipt) =>
            receipt.maPhieuThu === updatedReceipt.maPhieuThu ? updatedReceiptWithNewId : receipt
        );

        localStorage.setItem('receipts', JSON.stringify(updatedReceipts)); // Save updated receipts to localStorage
        setReceipts(updatedReceipts); // Update state
        setSelectedReceiptIndex(null); // Close the modal
    };

    const handleDeleteReceipt = () => {
        const receiptToDelete = receipts[selectedReceiptIndex];
        const updatedReceipts = receipts.filter((_, index) => index !== selectedReceiptIndex);

        localStorage.setItem('receipts', JSON.stringify(updatedReceipts));
        setReceipts(updatedReceipts);
        setDeletedReceiptId(receiptToDelete.maPhieuThu); // Store the deleted receipt ID
        setShowDeleteNotification(true); // Show the delete notification
        setShowDeleteConfirmation(false); // Close the confirmation modal
        setSelectedReceiptIndex(null); // Close the receipt modal

        // Do not modify 'lastUsedReceiptId' to ensure IDs continue incrementing
    };

    const selectedReceipt = selectedReceiptIndex !== null ? filteredReceipts[selectedReceiptIndex] : null;

    return (
        <div className="page-container">
            <h1 className="page-title">Danh Sách Phiếu Thu Tiền</h1>
            <div className="receipt-section-ptt">
                <div className="search-section-ptt">
                    <input
                        type="text"
                        className="search-bar-ptt"
                        placeholder="Tìm kiếm phiếu thu tiền..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="receipt-table-container-ptt">
                    <table className="receipt-table-ptt">
                        <thead>
                            <tr>
                                <th>Mã Phiếu</th>
                                <th>Người Lập</th>
                                <th>Mã Khách Hàng</th>
                                <th>Ngày Lập</th>
                                <th>Số Tiền Thu</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReceipts.map((receipt, index) => (
                                <tr key={receipt.maPhieuThu}>
                                    <td>{receipt.maPhieuThu || 'N/A'}</td>
                                    <td>{receipt.nguoiLapPhieu || 'N/A'}</td>
                                    <td>{receipt.maKhachHang || 'N/A'}</td>
                                    <td>{receipt.ngayLap || 'N/A'}</td>
                                    <td>{receipt.soTienTra?.toLocaleString() || '0'}đ</td> {/* Add nullish check */}
                                    <td>
                                        <button
                                            className="icon-button-ptt"
                                            onClick={() => handleViewReceipt(index)}
                                        >
                                            <PiNotePencil />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedReceipt && (
                <div className="modal-ptt">
                    <div className="modal-content-ptt">
                        <h2 className="modal-title-ptt">CHI TIẾT PHIẾU THU TIỀN</h2>
                        <div className="modal-columns-ptt">
                            <div className="modal-left-ptt" style={{ textAlign: 'left' }}>
                                <h3 className="section-header-ptt">Thông Tin Phiếu Thu</h3>
                                <p><strong>Ngày Lập:</strong> {selectedReceipt.ngayLap || 'N/A'}</p>
                                <p><strong>Mã Phiếu Thu:</strong> {selectedReceipt.maPhieuThu || 'N/A'}</p>
                                <p><strong>Người Lập Phiếu:</strong> {selectedReceipt.nguoiLapPhieu || 'N/A'}</p>
                            </div>
                            <div className="modal-right-ptt">
                                <h3 className="section-header-ptt">Thông Tin Khách Hàng</h3>
                                <p><strong>Mã Khách Hàng:</strong> {selectedReceipt.maKhachHang || 'N/A'}</p>
                                <p><strong>Tên Khách Hàng:</strong> {selectedReceipt.tenKhachHang || 'N/A'}</p>
                                <p><strong>Số Tiền Thu:</strong> {selectedReceipt.soTienTra?.toLocaleString() || '0'}đ</p> {/* Add nullish check */}
                                <p><strong>Còn Nợ:</strong> {selectedReceipt.soTienConLai?.toLocaleString() || '0'}đ</p> {/* Add nullish check */}
                            </div>
                        </div>
                        <div className="modal-actions-ptt">
                            <button className="edit-button-ptt" onClick={handleEditReceipt}>Sửa</button>
                            <button className="delete-button-ptt" onClick={() => setShowDeleteConfirmation(true)}>Xóa</button>
                            <button className="close-button-ptt" onClick={handleCloseModal}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirmation && (
                <div className="confirmation-modal-ptt">
                    <div className="confirmation-content-ptt">
                        <p>Bạn có chắc muốn xóa phiếu thu tiền này không?</p>
                        <div className="confirmation-actions-ptt">
                            <button className="confirm-button-ptt" onClick={handleDeleteReceipt}>Có</button>
                            <button className="cancel-button-ptt" onClick={() => setShowDeleteConfirmation(false)}>Không</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteNotification && (
                <div className="notification-modal-ptt">
                    <div className="notification-content-ptt">
                        <p>Phiếu thu tiền <strong>{deletedReceiptId}</strong> đã được xóa thành công!</p>
                        <button className="close-button-ptt" onClick={() => setShowDeleteNotification(false)}>Đóng</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PhieuThuTien;