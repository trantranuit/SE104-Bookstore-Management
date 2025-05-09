import React, { useState, useEffect } from 'react';
import { PiNotePencil } from "react-icons/pi"; // Import the icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../../styles/PathStyles.css';
import './HoaDon.css'; // Ensure this CSS file is imported

function HoaDon() {
    const [searchTerm, setSearchTerm] = useState('');
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoiceIndex, setSelectedInvoiceIndex] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
        setInvoices(storedInvoices);
    }, []);

    const filteredInvoices = invoices.filter(invoice =>
        invoice.maHoaDon.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.ngayLap.includes(searchTerm)
    );

    const handleViewInvoice = (index) => {
        setSelectedInvoiceIndex(index);
    };

    const handleCloseModal = () => {
        setSelectedInvoiceIndex(null);
    };

    const handleDeleteInvoice = () => {
        const invoiceToDelete = filteredInvoices[selectedInvoiceIndex];
        const updatedInvoices = invoices.filter((_, index) => index !== selectedInvoiceIndex);

        // Update localStorage
        localStorage.setItem('invoices', JSON.stringify(updatedInvoices));

        // Update customer debt
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        const updatedCustomers = customers.map(customer =>
            customer.id === invoiceToDelete.maKhachHang
                ? { ...customer, debt: customer.debt - invoiceToDelete.danhSachSach.reduce((sum, sach) => sum + sach.soLuong * sach.donGia, 0) }
                : customer
        );
        localStorage.setItem('customers', JSON.stringify(updatedCustomers));

        setInvoices(updatedInvoices);
        setShowDeleteConfirmation(false);
        handleCloseModal();
    };

    const handleEditInvoice = (invoice) => {
        navigate('/thanhToan/moi', { state: { invoice } }); // Pass the invoice details via state
    };

    const selectedInvoice = selectedInvoiceIndex !== null ? filteredInvoices[selectedInvoiceIndex] : null;

    return (
        <div className="page-container">
            <h1 className="page-title">Danh Sách Các Hóa Đơn</h1>
            <div className="invoice-section">
                <div className="search-section">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Tìm kiếm hóa đơn theo mã hoặc ngày lập..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>Mã Hóa Đơn</th>
                            <th>Nhân Viên Lập</th>
                            <th>Mã Khách Hàng</th>
                            <th>Ngày Lập Hóa Đơn</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.map((invoice, index) => (
                            <tr key={invoice.maHoaDon}>
                                <td>{invoice.maHoaDon}</td>
                                <td>{invoice.nhanVien}</td>
                                <td>{invoice.maKhachHang}</td>
                                <td>{invoice.ngayLap}</td>
                                <td>
                                    <button
                                        className="icon-button"
                                        onClick={() => handleViewInvoice(index)}
                                    >
                                        <PiNotePencil />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedInvoice && (
                <div className="modal">
                    <div className="modal-content">
                        <h2 className="modal-title">CHI TIẾT HÓA ĐƠN</h2>
                        <div className="modal-columns">
                            <div className="modal-left" style={{ textAlign: 'left' }}>
                                <h3 className="section-header">Thông Tin Hóa Đơn</h3>
                                <p><strong>Ngày Lập:</strong> {selectedInvoice.ngayLap}</p>
                                <p><strong>Mã Hóa Đơn:</strong> {selectedInvoice.maHoaDon}</p>
                                <p><strong>Mã Nhân Viên:</strong> {selectedInvoice.maNhanVien || 'Không có'}</p> {/* Correctly display Mã Nhân Viên */}
                                <p><strong>Tên Nhân Viên:</strong> {selectedInvoice.nhanVien}</p>
                            </div>
                            <div className="modal-right">
                                <h3 className="section-header" style={{marginRight: "1.8rem"}}>Thông Tin Khách Hàng</h3>
                                <p><strong>Mã Khách Hàng:</strong> {selectedInvoice.maKhachHang}</p>
                                <p><strong>Tên Khách Hàng:</strong> {selectedInvoice.tenKhachHang}</p>
                                <p><strong>Số Điện Thoại:</strong> {selectedInvoice.sdt}</p>
                                <p><strong>Email:</strong> {selectedInvoice.email}</p>
                                <p><strong>Số Nợ:</strong> {selectedInvoice.soNo.toLocaleString()}đ</p>
                            </div>
                        </div>
                        <h3>Danh Sách Sách</h3>
                        <table className="modal-table">
                            <thead>
                                <tr>
                                    <th>Mã Sách</th>
                                    <th>Tên Sách</th>
                                    <th>Số Lượng</th>
                                    <th>Đơn Giá</th>
                                    <th>Thành Tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedInvoice.danhSachSach.map((sach, index) => (
                                    <tr key={index}>
                                        <td>{sach.maSach}</td>
                                        <td>{sach.tenSach}</td>
                                        <td>{sach.soLuong}</td>
                                        <td>{sach.donGia.toLocaleString()}đ</td>
                                        <td>{(sach.soLuong * sach.donGia).toLocaleString()}đ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="modal-totals">
                            <p><strong>Tổng Số Sách:</strong> {selectedInvoice.danhSachSach.reduce((sum, sach) => sum + sach.soLuong, 0)}</p>
                            <p><strong>Tổng Số Tiền:</strong> {selectedInvoice.danhSachSach.reduce((sum, sach) => sum + sach.soLuong * sach.donGia, 0).toLocaleString()}đ</p>
                            <p><strong>Tổng Số Nợ Sau Khi Lập Hóa Đơn:</strong> {(selectedInvoice.soNo + selectedInvoice.danhSachSach.reduce((sum, sach) => sum + sach.soLuong * sach.donGia, 0)).toLocaleString()}đ</p>
                        </div>
                        <div className="modal-actions">
                            <button className="edit-button" onClick={() => handleEditInvoice(selectedInvoice)}>Sửa</button>
                            <button className="delete-button" onClick={() => setShowDeleteConfirmation(true)}>Xóa</button>
                            <button className="close-button" onClick={handleCloseModal}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirmation && (
                <div className="confirmation-modal">
                    <div className="confirmation-content">
                        <p>Bạn có chắc muốn xóa hóa đơn này không?</p>
                        <div className="confirmation-actions">
                            <button className="confirm-button" onClick={handleDeleteInvoice}>Có</button>
                            <button className="cancel-button" onClick={() => setShowDeleteConfirmation(false)}>Không</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HoaDon;