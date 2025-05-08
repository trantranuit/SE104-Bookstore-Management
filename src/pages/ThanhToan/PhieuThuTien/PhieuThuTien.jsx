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

    const handleDeleteReceipt = () => {
        const receiptToDelete = receipts[selectedReceiptIndex];
        const updatedReceipts = receipts.filter((_, index) => index !== selectedReceiptIndex);

        localStorage.setItem('receipts', JSON.stringify(updatedReceipts));
        setReceipts(updatedReceipts);
        setDeletedReceiptId(receiptToDelete.maPhieuThu); // Store the deleted receipt ID
        setShowDeleteNotification(true); // Show the delete notification
        setShowDeleteConfirmation(false); // Close the confirmation modal
        setSelectedReceiptIndex(null); // Close the receipt modal
    };

    const selectedReceipt = selectedReceiptIndex !== null ? filteredReceipts[selectedReceiptIndex] : null;

    return (
        <div className="page-container">
            <h1 className="page-title">Danh Sách Phiếu Thu Tiền</h1>
            <div className="receipt-section">
                <div className="search-section">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Tìm kiếm phiếu thu theo mã hoặc ngày lập..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <table className="receipt-table">
                    <thead>
                        <tr>
                            <th>Mã Phiếu Thu</th>
                            <th>Người Lập Phiếu</th>
                            <th>Mã Khách Hàng</th>
                            <th>Ngày Lập</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReceipts.map((receipt, index) => (
                            <tr key={receipt.maPhieuThu}>
                                <td>{receipt.maPhieuThu}</td>
                                <td>{receipt.nguoiLapPhieu}</td>
                                <td>{receipt.maKhachHang}</td>
                                <td>{receipt.ngayLap}</td>
                                <td>
                                    <button
                                        className="icon-button"
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

            {selectedReceipt && (
                <div className="modal">
                    <div className="modal-content">
                        <h2 className="modal-title">CHI TIẾT PHIẾU THU TIỀN</h2>
                        <div className="modal-columns">
                            <div className="modal-left" style={{ textAlign: 'left' }}>
                                <h3 className="section-header">Thông Tin Phiếu Thu</h3>
                                <p><strong>Ngày Lập:</strong> {selectedReceipt.ngayLap}</p>
                                <p><strong>Mã Phiếu Thu:</strong> {selectedReceipt.maPhieuThu}</p>
                                <p><strong>Người Lập Phiếu:</strong> {selectedReceipt.nguoiLapPhieu}</p>
                            </div>
                            <div className="modal-right">
                                <h3 className="section-header">Thông Tin Khách Hàng</h3>
                                <p><strong>Mã Khách Hàng:</strong> {selectedReceipt.maKhachHang}</p>
                                <p><strong>Tên Khách Hàng:</strong> {selectedReceipt.tenKhachHang}</p>
                                <p><strong>Số Tiền Thu:</strong> {selectedReceipt.soTienTra.toLocaleString()}đ</p>
                                <p><strong>Còn Nợ:</strong> {selectedReceipt.soTienConLai.toLocaleString()}đ</p>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="edit-button" onClick={handleEditReceipt}>Sửa</button>
                            <button className="delete-button" onClick={() => setShowDeleteConfirmation(true)}>Xóa</button>
                            <button className="close-button" onClick={handleCloseModal}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirmation && (
                <div className="confirmation-modal">
                    <div className="confirmation-content">
                        <p>Bạn có chắc muốn xóa phiếu thu tiền này không?</p>
                        <div className="confirmation-actions">
                            <button className="confirm-button" onClick={handleDeleteReceipt}>Có</button>
                            <button className="cancel-button" onClick={() => setShowDeleteConfirmation(false)}>Không</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteNotification && (
                <div className="notification-modal">
                    <div className="notification-content">
                        <p>Phiếu thu tiền <strong>{deletedReceiptId}</strong> đã được xóa thành công!</p>
                        <button className="close-button" onClick={() => setShowDeleteNotification(false)}>Đóng</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PhieuThuTien;