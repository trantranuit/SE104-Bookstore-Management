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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const [hoaDonList, ctHoaDonList, customers, users, books, dauSachList] = await Promise.all([
                    thanhToanMoiApi.getAllHoaDon(),
                    thanhToanMoiApi.getAllCTHoaDon(),
                    thanhToanMoiApi.getAllCustomers(),
                    thanhToanMoiApi.getAllUsers(),
                    thanhToanMoiApi.getAllBooks(),
                    thanhToanMoiApi.getAllDauSach(),
                ]);

                const formattedInvoices = await Promise.all(hoaDonList.map(async (hd) => {
                    // Lấy chi tiết hóa đơn
                    const chiTiet = ctHoaDonList.filter(ct => ct.MaHD === hd.MaHD);
                    // Lấy thông tin khách hàng
                    const customer = customers.find(c => c.MaKhachHang === hd.MaKH) || {};
                    // Lấy thông tin nhân viên
                    const user = users.find(u => u.id === hd.NguoiLapHD) || {};
                    // Lấy danh sách sách
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
                        maNhanVien: String(hd.NguoiLapHD) || '',
                        nhanVien: user.first_name ? `${user.last_name} ${user.first_name}` : 'Không xác định',
                        tienKhachTra: hd.SoTienTra || 0,
                        danhSachSach,
                    };
                }));

                setInvoices(formattedInvoices);
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

    const handleViewInvoice = (index) => {
        setSelectedInvoiceIndex(index);
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

    const handleEditInvoice = (invoice) => {
        navigate('/thanhToan/moi', { state: { invoice } });
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