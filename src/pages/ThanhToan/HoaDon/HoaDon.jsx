import React, { useState, useEffect } from 'react';
import { PiNotePencil } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import thanhToanMoiApi from '../../../services/thanhToanMoiApi';
import '../../../styles/PathStyles.css';
import './HoaDon.css';

function HoaDon() {
    const [searchTerm, setSearchTerm] = useState('');
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoiceIndex, setSelectedInvoiceIndex] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [deletedInvoiceId, setDeletedInvoiceId] = useState('');
    const [editTienKhachTraIndex, setEditTienKhachTraIndex] = useState(null);
    const [editTienKhachTraValue, setEditTienKhachTraValue] = useState('');
    const [editTienKhachTraError, setEditTienKhachTraError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const invoicesPerPage = 10;
    const [sortAscending, setSortAscending] = useState(false);
    const navigate = useNavigate();

    const sortInvoices = (invoices) => {
        return [...invoices].sort((a, b) => {
            const idA = parseInt(a.maHoaDon.replace('HD', ''));
            const idB = parseInt(b.maHoaDon.replace('HD', ''));
            return idA - idB;
        });
    };

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                // Get all invoices without pagination first
                const result = await thanhToanMoiApi.getAllHoaDon();
                const hoaDonList = result.data;

                const [ctHoaDonList, customers, users, books, dauSachList] = await Promise.all([
                    thanhToanMoiApi.getAllCTHoaDon(),
                    thanhToanMoiApi.getAllCustomers(),
                    thanhToanMoiApi.getAllUsers(),
                    thanhToanMoiApi.getAllBooks(),
                    thanhToanMoiApi.getAllDauSach(),
                ]);

                const formattedInvoices = await Promise.all(hoaDonList.map(async (hd) => {
                    const chiTiet = ctHoaDonList.filter(ct => ct.MaHD === hd.MaHD);
                    const customer = customers.find(c => c.MaKhachHang === hd.MaKH) || {};

                    // Extract numeric ID from NguoiLapHD (e.g., "NV001" -> "1")
                    const numericId = parseInt((hd.NguoiLapHD || '').replace(/^NV0*/, ''), 10);
                    const user = users.find(u => u.id === numericId) || {};

                    // Keep original NguoiLapHD format for display
                    const originalMaNV = hd.NguoiLapHD;

                    // Create employee name string
                    const employeeName = user.first_name ? `${user.last_name} ${user.first_name}` : 'Không xác định';

                    const danhSachSach = await Promise.all(chiTiet.map(async (ct) => {
                        const book = books.find(b => b.MaSach === ct.MaSach) || {};
                        const dauSach = dauSachList.find(ds => ds.MaDauSach === book.MaDauSach) || {};
                        return {
                            maSach: String(ct.MaSach),
                            tenSach: dauSach.TenSach || 'Không xác định',
                            soLuong: ct.SLBan,
                            donGia: ct.GiaBan,
                        };
                    }));

                    return {
                        maHoaDon: String(hd.MaHD),
                        ngayLap: hd.NgayLap,
                        maKhachHang: String(hd.MaKH),
                        tenKhachHang: customer.HoTen || 'Không xác định',
                        sdt: customer.DienThoai || '',
                        email: customer.Email || '',
                        maNhanVien: originalMaNV || '', // Use original format for display
                        nhanVien: employeeName,
                        tienKhachTra: hd.SoTienTra || 0,
                        danhSachSach,
                    };
                }));

                // Sort invoices before setting state
                const sortedInvoices = sortInvoices(formattedInvoices);
                setInvoices(sortedInvoices);
            } catch (error) {
                console.error('Error fetching invoices:', error);
                setInvoices([]);
            }
        };
        fetchInvoices();
    }, [showDeleteSuccess]);

    const filteredInvoices = invoices.filter(invoice =>
        invoice.maHoaDon.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.ngayLap.includes(searchTerm)
    );

    // Add pagination calculations
    const indexOfLastInvoice = currentPage * invoicesPerPage;
    const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
    const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
    const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleViewInvoice = (maHoaDon) => {
        const invoiceIndex = filteredInvoices.findIndex(inv => inv.maHoaDon === maHoaDon);
        setSelectedInvoiceIndex(invoiceIndex);
    };

    const handleCloseModal = () => {
        setSelectedInvoiceIndex(null);
    };

    const handleDeleteInvoice = async () => {
        const filtered = invoices.filter(invoice =>
            invoice.maHoaDon.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.ngayLap.includes(searchTerm)
        );
        const invoiceToDelete = filtered[selectedInvoiceIndex];
        if (!invoiceToDelete) {
            setShowDeleteConfirmation(false);
            return;
        }

        try {
            // Tính tổng tiền hóa đơn
            const totalAmount = invoiceToDelete.danhSachSach.reduce(
                (sum, sach) => sum + sach.soLuong * sach.donGia,
                0
            );

            // Lấy thông tin khách hàng
            const customer = await thanhToanMoiApi.getCustomerById(invoiceToDelete.maKhachHang);
            const currentDebt = customer.SoTienNo || 0;
            const newDebt = Math.max(0, currentDebt - totalAmount);

            // Cập nhật nợ khách hàng
            await thanhToanMoiApi.updateCustomerDebt(invoiceToDelete.maKhachHang, newDebt);

            // Xóa hóa đơn
            await thanhToanMoiApi.deleteInvoice(invoiceToDelete.maHoaDon);

            setShowDeleteConfirmation(false);
            setDeletedInvoiceId(invoiceToDelete.maHoaDon);
            setShowDeleteSuccess(true);
            handleCloseModal();
        } catch (error) {
            console.error('Error deleting invoice:', error);
            alert('Có lỗi khi xóa hóa đơn!');
        }
    };

    // Khi bấm Sửa: mở input sửa số tiền khách trả ngay trên bảng
    const handleEditInvoice = (invoice, index) => {
        setEditTienKhachTraIndex(index);
        setEditTienKhachTraValue(invoice.tienKhachTra?.toString() || '');
        setEditTienKhachTraError('');
    };

    // Lưu số tiền khách trả mới
    const handleSaveTienKhachTra = async (invoice, index) => {
        const value = editTienKhachTraValue.replace(/,/g, '');
        if (!value || isNaN(value) || Number(value) < 0) {
            setEditTienKhachTraError('Vui lòng nhập số hợp lệ');
            return;
        }
        try {
            await thanhToanMoiApi.updateInvoiceTienKhachTra(invoice.maHoaDon, Number(value));
            // Cập nhật lại danh sách hóa đơn
            setInvoices(prev =>
                prev.map((inv, idx) =>
                    idx === index ? { ...inv, tienKhachTra: Number(value) } : inv
                )
            );
            setEditTienKhachTraIndex(null);
            setEditTienKhachTraValue('');
            setEditTienKhachTraError('');
        } catch (err) {
            setEditTienKhachTraError('Lưu thất bại!');
        }
    };

    // State cho sửa số tiền khách trả trong modal
    const [modalEditTienKhachTra, setModalEditTienKhachTra] = useState(false);
    const [modalTienKhachTraValue, setModalTienKhachTraValue] = useState('');
    const [modalTienKhachTraError, setModalTienKhachTraError] = useState('');
    const [showConfirmClose, setShowConfirmClose] = useState(false);

    // Khi bấm Sửa trong modal: mở input sửa số tiền khách trả trong modal
    const handleModalEditTienKhachTra = () => {
        setModalEditTienKhachTra(true);
        setModalTienKhachTraValue(selectedInvoice?.tienKhachTra?.toString() || '');
        setModalTienKhachTraError('');
    };

    // Lưu số tiền khách trả mới trong modal và cập nhật số nợ khách hàng
    const handleModalSaveTienKhachTra = async () => {
        const value = modalTienKhachTraValue.replace(/,/g, '');
        if (!value || isNaN(value) || Number(value) < 0) {
            setModalTienKhachTraError('Vui lòng nhập số hợp lệ');
            return;
        }
        try {
            // Cập nhật số tiền khách trả cho hóa đơn
            await thanhToanMoiApi.updateInvoiceTienKhachTra(selectedInvoice.maHoaDon, Number(value));
            // Lấy lại thông tin hóa đơn để tính số nợ mới
            const invoice = invoices.find(inv => inv.maHoaDon === selectedInvoice.maHoaDon);
            const customer = await thanhToanMoiApi.getCustomerById(invoice.maKhachHang);
            const totalAmount = invoice.danhSachSach.reduce((sum, sach) => sum + sach.soLuong * sach.donGia, 0);
            const newDebt = Math.max(0, totalAmount - Number(value));
            await thanhToanMoiApi.updateCustomerDebt(invoice.maKhachHang, newDebt);

            // Cập nhật lại danh sách hóa đơn
            setInvoices(prev =>
                prev.map((inv) =>
                    inv.maHoaDon === selectedInvoice.maHoaDon
                        ? { ...inv, tienKhachTra: Number(value) }
                        : inv
                )
            );
            setModalEditTienKhachTra(false);
            setModalTienKhachTraValue('');
            setModalTienKhachTraError('');
            setShowConfirmClose(false);
            // Cập nhật selectedInvoice nếu cần
            if (selectedInvoice) {
                selectedInvoice.tienKhachTra = Number(value);
            }
        } catch (err) {
            setModalTienKhachTraError('Lưu thất bại!');
        }
    };

    // Khi bấm Đóng trong modal sửa, hỏi xác nhận
    const handleModalClose = () => {
        if (modalEditTienKhachTra) {
            setShowConfirmClose(true);
        } else {
            setSelectedInvoiceIndex(null);
        }
    };

    // Xác nhận đóng modal: có lưu
    const handleConfirmCloseYes = () => {
        handleModalSaveTienKhachTra();
    };

    // Xác nhận đóng modal: không lưu
    const handleConfirmCloseNo = () => {
        setModalEditTienKhachTra(false);
        setModalTienKhachTraValue('');
        setModalTienKhachTraError('');
        setShowConfirmClose(false);
        setSelectedInvoiceIndex(null);
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
                            <th>No.</th>
                            <th>Mã Hóa Đơn</th>
                            <th>Mã Nhân Viên</th>
                            <th>Nhân Viên Lập</th>
                            <th>Mã Khách Hàng</th>
                            <th>Tên Khách Hàng</th>
                            <th>Ngày Lập Hóa Đơn</th>
                            <th>Số Tiền Khách Trả</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentInvoices.map((invoice, index) => (
                            <tr key={invoice.maHoaDon}>
                                <td>{(currentPage - 1) * invoicesPerPage + index + 1}</td>
                                <td>{invoice.maHoaDon}</td>
                                <td>{invoice.maNhanVien}</td>
                                <td>{invoice.nhanVien}</td>
                                <td>{invoice.maKhachHang}</td>
                                <td>{invoice.tenKhachHang}</td>
                                <td>{invoice.ngayLap}</td>
                                <td>
                                    {invoice.tienKhachTra !== undefined
                                        ? Number(invoice.tienKhachTra).toLocaleString() + ' VNĐ'
                                        : 'Chưa có'}
                                </td>
                                <td>
                                    <button
                                        className="icon-button-thd"
                                        onClick={() => handleViewInvoice(invoice.maHoaDon)}
                                    >
                                        <PiNotePencil />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Add pagination buttons */}
                <div className="pagination-wrapper" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginTop: '1rem'
                }}>
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="pagination-button-thd"
                    >
                        Trước
                    </button>
                    <span className="pagination-info">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="pagination-button-thd"
                    >
                        Sau
                    </button>
                </div>
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
                                    <th>No.</th>
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
                                        <td>{index + 1}</td>
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
                                {modalEditTienKhachTra ? (
                                    <span>
                                        <input
                                            type="text"
                                            value={modalTienKhachTraValue}
                                            onChange={e => {
                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                setModalTienKhachTraValue(val);
                                                setModalTienKhachTraError('');
                                            }}
                                            style={{ width: 100, marginRight: 8 }}
                                        />
                                        {modalTienKhachTraError && (
                                            <span style={{ color: 'red', marginLeft: 8 }}>{modalTienKhachTraError}</span>
                                        )}
                                    </span>
                                ) : (
                                    <span>
                                        {selectedInvoice.tienKhachTra !== undefined
                                            ? Number(selectedInvoice.tienKhachTra).toLocaleString() + ' VNĐ'
                                            : 'Chưa có'}
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="modal-actions-thd">
                            <button className="close-button-thd" onClick={handleCloseModal}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {showConfirmClose && (
                <div className="confirmation-modal-thd">
                    <div className="confirmation-content-thd">
                        <p>Bạn có chắc muốn lưu hóa đơn không?</p>
                        <div className="confirmation-actions-thd">
                            <button className="confirm-button-thd" onClick={handleConfirmCloseYes}>Có</button>
                            <button className="cancel-button-thd" onClick={handleConfirmCloseNo}>Không</button>
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