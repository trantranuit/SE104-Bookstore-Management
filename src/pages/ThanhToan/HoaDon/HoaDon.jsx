import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
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

    // Add new state for filter modals
    // State cho modal lọc mã khách hàng
    const [showFilterMaKHModal, setShowFilterMaKHModal] = useState(false);
    const [filterMaKHInput, setFilterMaKHInput] = useState('');
    const [filterMaKHArr, setFilterMaKHArr] = useState([]);

    // State cho modal lọc mã sách
    const [showFilterMaSachModal, setShowFilterMaSachModal] = useState(false);
    const [filterMaSachInput, setFilterMaSachInput] = useState('');
    const [filterMaSachArr, setFilterMaSachArr] = useState([]);

    // State cho modal lọc mã nhân viên
    const [showFilterMaNVModal, setShowFilterMaNVModal] = useState(false);
    const [filterMaNVInput, setFilterMaNVInput] = useState('');
    const [filterMaNVArr, setFilterMaNVArr] = useState([]);

    // Lọc hóa đơn theo searchTerm, mã khách hàng, mã sách, mã nhân viên
    const filteredInvoices = invoices.filter(invoice => {
        // Lọc theo searchTerm
        const matchSearch = (
            invoice.maHoaDon.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.ngayLap.includes(searchTerm)
        );
        // Lọc theo mã khách hàng
        const matchMaKH = filterMaKHArr.length === 0 || filterMaKHArr.includes(invoice.maKhachHang);
        // Lọc theo mã sách
        const matchMaSach = filterMaSachArr.length === 0 ||
            invoice.danhSachSach.some(sach => filterMaSachArr.includes(String(sach.maSach)));
        // Lọc theo mã nhân viên
        const matchMaNV = filterMaNVArr.length === 0 || filterMaNVArr.includes(invoice.maNhanVien);
        return matchSearch && matchMaKH && matchMaSach && matchMaNV;
    });

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

    const handlePrintInvoice = async () => {
        if (!selectedInvoice) return;
        try {
            const invoiceId = selectedInvoice.maHoaDon.replace('HD', '');
            const response = await fetch(`http://localhost:8000/api/hoadon/${invoiceId}/export-pdf/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
                    'Content-Type': 'application/pdf',
                },
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                setPdfUrl(url);
                setShowPdfModal(true);
            } else {
                alert('Có lỗi khi in hóa đơn. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error printing invoice:', error);
            alert('Có lỗi khi in hóa đơn. Vui lòng thử lại.');
        }
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

    // Add new handler for PDF modal backdrop click
    const handlePdfModalClose = (e) => {
        // Only close if clicking the backdrop (not the iframe)
        if (e.target.classList.contains('modal-thd')) {
            setShowPdfModal(false);
            window.URL.revokeObjectURL(pdfUrl);
            setPdfUrl(null);
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Danh Sách Các Hóa Đơn</h1>
            <div className="content-wrapper">
                <div className="search-section-thd" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                        type="text"
                        className="search-bar-thd"
                        placeholder="Tìm kiếm hóa đơn theo mã hoặc ngày lập..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    {/* Nút lọc theo mã khách hàng */}
                    <button
                        className="filter-button-hd"
                        onClick={() => setShowFilterMaKHModal(true)}
                    >
                        Lọc theo mã khách
                    </button>
                    {/* Nút lọc theo mã sách */}
                    <button
                        className="filter-button-hd"
                        onClick={() => setShowFilterMaSachModal(true)}
                    >
                        Lọc theo mã sách
                    </button>
                    {/* Nút lọc theo mã nhân viên */}
                    <button
                        className="filter-button-hd"
                        onClick={() => setShowFilterMaNVModal(true)}
                    >
                        Lọc theo mã nhân viên
                    </button>
                </div>
                {/* Modal lọc mã khách hàng */}
                {showFilterMaKHModal && (
                    <div className="modal-overlay-hd">
                        <div className="modal-new-hd">
                            <h3 className="modal-title-new-hd">Lọc theo mã khách hàng</h3>
                            <input
                                className="modal-hd-filter-input"
                                type="text"
                                placeholder="Nhập các mã khách hàng, cách nhau bởi dấu phẩy"
                                value={filterMaKHInput}
                                onChange={e => setFilterMaKHInput(e.target.value)}
                                style={{ height: "3rem", padding: "0.6rem", borderRadius: "0.4rem" }}
                            />
                            <div className="modal-buttons-hd">
                                <button
                                    className="apply-button-hd"
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
                                    className="cancel-button-new-hd"
                                    onClick={() => {
                                        setFilterMaKHArr([]);
                                        setFilterMaKHInput('');
                                        setShowFilterMaKHModal(false);
                                    }}
                                >
                                    Hủy áp dụng
                                </button>
                                <button
                                    className="close-button-new-hd"
                                    onClick={() => setShowFilterMaKHModal(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Modal lọc mã sách */}
                {showFilterMaSachModal && (
                    <div className="modal-overlay-hd">
                        <div className="modal-new-hd">
                            <h3 className="modal-new-title-hd">Lọc theo mã sách</h3>
                            <input
                                className="modal-hd-filter-input"
                                type="text"
                                placeholder="Nhập các mã sách, cách nhau bởi dấu phẩy"
                                value={filterMaSachInput}
                                onChange={e => setFilterMaSachInput(e.target.value)}
                                style={{ height: "3rem", padding: "0.6rem", borderRadius: "0.4rem" }}
                            />
                            <div className="modal-buttons-hd">
                                <button
                                    className="apply-button-hd"
                                    onClick={() => {
                                        setFilterMaSachArr(
                                            filterMaSachInput
                                                .split(',')
                                                .map(s => s.trim())
                                                .filter(Boolean)
                                        );
                                        setShowFilterMaSachModal(false);
                                    }}
                                >
                                    Áp dụng
                                </button>
                                <button
                                    className="cancel-button-new-hd"
                                    onClick={() => {
                                        setFilterMaSachArr([]);
                                        setFilterMaSachInput('');
                                        setShowFilterMaSachModal(false);
                                    }}
                                >
                                    Hủy áp dụng
                                </button>
                                <button
                                    className="close-button-new-hd"
                                    onClick={() => setShowFilterMaSachModal(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Modal lọc mã nhân viên */}
                {showFilterMaNVModal && (
                    <div className="modal-overlay-hd">
                        <div className="modal-new-hd">
                            <h3 className="modal-title-new-hd">Lọc theo mã nhân viên</h3>
                            <input
                                className="modal-hd-filter-input"
                                type="text"
                                placeholder="Nhập các mã nhân viên, cách nhau bởi dấu phẩy"
                                value={filterMaNVInput}
                                onChange={e => setFilterMaNVInput(e.target.value)}
                                style={{ height: "3rem", padding: "0.6rem", borderRadius: "0.4rem" }}
                            />
                            <div className="modal-buttons-hd">
                                <button
                                    className="apply-button-hd"
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
                                    className="cancel-button-new-hd"
                                    onClick={() => {
                                        setFilterMaNVArr([]);
                                        setFilterMaNVInput('');
                                        setShowFilterMaNVModal(false);
                                    }}
                                >
                                    Hủy áp dụng
                                </button>
                                <button
                                    className="close-button-new-hd"
                                    onClick={() => setShowFilterMaNVModal(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="invoice-table-container-thd" style={{paddingBottom: '2rem'}}>
                    <table className="invoice-table-thd">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Mã hóa dơn</th>
                                <th>Mã nhân viên</th>
                                <th>Nhân viên lập</th>
                                <th>Mã khách hàng</th>
                                <th>Tên khách hàng</th>
                                <th>Ngày lập hóa đơn</th>
                                <th>Số tiền khách trả</th>
                                <th>Xem chi tiết</th>
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
                                            ? Number(invoice.tienKhachTra).toLocaleString() + '  VNĐ'
                                            : 'Chưa có'}
                                    </td>
                                    <td>
                                        <div className="action-buttons-thd">
                                            <FontAwesomeIcon
                                                icon={faEdit}
                                                className="action-button-thd"
                                                onClick={() => handleViewInvoice(invoice.maHoaDon)}
                                            />


                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Add pagination buttons */}
                    <div className="pagination-buttons-thd">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="pagination-buttons-thd-button"
                        >
                            ←
                        </button>
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
                            className="pagination-buttons-thd-button"
                        >
                            →
                        </button>
                    </div>
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
                                        <td>{sach.donGia.toLocaleString()} VNĐ</td>
                                        <td>{(sach.soLuong * sach.donGia).toLocaleString()} VNĐ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="modal-totals-thd">
                            <p><strong>Tổng Số Sách:</strong> {selectedInvoice.danhSachSach.reduce((sum, sach) => sum + sach.soLuong, 0)} quyển</p>
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
                            <button className="print-button-thd" onClick={handlePrintInvoice}>In hóa đơn</button>
                            <button className="close-button-thd" onClick={handleCloseModal}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {showPdfModal && pdfUrl && (
                <div className="modal-thd" style={{ zIndex: 9999 }} onClick={handlePdfModalClose}>
                    <div className="modal-content-thd" style={{ width: '80vw', height: '90vh', padding: 0 }}>
                        <iframe
                            src={pdfUrl}
                            title="Xem trước hóa đơn"
                            style={{ width: '100%', height: '100%', border: 'none' }}
                        />
                        <div style={{ textAlign: 'right', padding: 8 }}>
                            <button
                                className="close-button-thd"
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