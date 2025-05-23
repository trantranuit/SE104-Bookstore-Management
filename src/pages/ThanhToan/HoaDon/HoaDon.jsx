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
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [deletedInvoiceId, setDeletedInvoiceId] = useState('');
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
        // Lấy lại danh sách hóa đơn đã lọc theo searchTerm
        const filtered = invoices.filter(invoice =>
            invoice.maHoaDon.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.ngayLap.includes(searchTerm)
        );
        const invoiceToDelete = filtered[selectedInvoiceIndex];
        if (!invoiceToDelete) {
            setShowDeleteConfirmation(false);
            return;
        }
        // Xóa hóa đơn khỏi danh sách invoices
        const updatedInvoices = invoices.filter(inv => inv.maHoaDon !== invoiceToDelete.maHoaDon);

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
        setDeletedInvoiceId(invoiceToDelete.maHoaDon);
        setShowDeleteSuccess(true);
        handleCloseModal();
    };

    const handleEditInvoice = (invoice) => {
        navigate('/thanhToan/moi', { state: { invoice } }); // Pass the invoice details via state
    };

    const selectedInvoice = selectedInvoiceIndex !== null ? filteredInvoices[selectedInvoiceIndex] : null;

    return (
        <div className="page-container">
            <h1 className="page-title">Danh Sách Các Hóa Đơn</h1>
            <div className="content-wrapper">
                <div className="search-section-thd">
                    <input
                        type="text"
                        className="search-bar-thd"
                        placeholder="Tìm kiếm hóa đơn theo mã hoặc ngày lập..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <table className="invoice-table-thd">
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
                                        className="icon-button-thd"
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
                <div className="modal-thd">
                    <div className="modal-content-thd">
                        <h2 className="modal-title-thd">CHI TIẾT HÓA ĐƠN</h2>
                        <div className="modal-columns-thd">
                            <div className="modal-left-thd" style={{ textAlign: 'left' }}>
                                <h3 className="section-header-thd">Thông Tin Hóa Đơn</h3>
                                <p><strong>Ngày Lập:</strong> {selectedInvoice.ngayLap}</p>
                                <p><strong>Mã Hóa Đơn:</strong> {selectedInvoice.maHoaDon}</p>
                                <p><strong>Mã Nhân Viên:</strong> {selectedInvoice.maNhanVien || 'Không có'}</p>
                                <p><strong>Tên Nhân Viên:</strong> {selectedInvoice.nhanVien}</p>
                            </div>
                            <div className="modal-right-thd">
                                <h3 className="section-header-thd" style={{ marginRight: "1.8rem" }}>Thông Tin Khách Hàng</h3>
                                <p><strong>Mã Khách Hàng:</strong> {selectedInvoice.maKhachHang}</p>
                                <p><strong>Tên Khách Hàng:</strong> {selectedInvoice.tenKhachHang}</p>
                                <p><strong>Số Điện Thoại:</strong> {selectedInvoice.sdt}</p>
                                <p><strong>Email:</strong> {selectedInvoice.email}</p>
                            </div>
                        </div>
                        <h3 className="section-header-thd">Danh Sách Sách Đã Mua</h3>
                        <table className="modal-table-thd">
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
                        <div className="modal-totals-thd">
                            <p><strong>Tổng Số Sách:</strong> {selectedInvoice.danhSachSach.reduce((sum, sach) => sum + sach.soLuong, 0)}</p>
                            <p><strong>Tổng Số Tiền:</strong> {selectedInvoice.danhSachSach.reduce((sum, sach) => sum + sach.soLuong * sach.donGia, 0).toLocaleString()} VNĐ</p>
                            <p>
                                <strong>Số Tiền Khách Trả:</strong>{' '}
                                {selectedInvoice.tienKhachTra !== undefined
                                    ? Number(selectedInvoice.tienKhachTra).toLocaleString() + ' VNĐ'
                                    : selectedInvoice.tienKhachTra === 0
                                        ? '0 VNĐ'
                                        : 'Chưa có'}
                            </p>
                        </div>
                        <div className="modal-actions-thd">
                            <button className="edit-button-thd" onClick={() => handleEditInvoice(selectedInvoice)}>Sửa</button>
                            <button className="delete-button-thd" onClick={() => setShowDeleteConfirmation(true)}>Xóa</button>
                            <button className="close-button-thd" onClick={handleCloseModal}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirmation && (
                <div className="confirmation-modal-thd">
                    <div className="confirmation-content-thd">
                        <p>Bạn có chắc muốn xóa hóa đơn này không?</p>
                        <div className="confirmation-actions-thd">
                            <button className="confirm-button-thd" onClick={handleDeleteInvoice}>Có</button>
                            <button className="cancel-button-thd" onClick={() => setShowDeleteConfirmation(false)}>Không</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteSuccess && (
                <div className="confirmation-modal-thd">
                    <div className="confirmation-content-thd">
                        <p>Hóa đơn <strong>{deletedInvoiceId}</strong> đã được xóa thành công!</p>
                        <div className="confirmation-actions-thd">
                            <button className="cancel-button-thd" onClick={() => setShowDeleteSuccess(false)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default HoaDon;