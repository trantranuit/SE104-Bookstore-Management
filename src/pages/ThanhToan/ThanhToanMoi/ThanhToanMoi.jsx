import React, { useState, useRef, useEffect } from 'react';
import { FaCartPlus } from "react-icons/fa6";
import { IoTrashBin } from "react-icons/io5";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import thanhToanMoiApi from '../../../services/thanhToanMoiApi';
import '../../../styles/PathStyles.css';
import './ThanhToanMoi.css';

function ThanhToanMoi() {
    const navigate = useNavigate();
    const location = useLocation();
    const invoice = location.state?.invoice;

    const [searchTerm, setSearchTerm] = useState('');
    const [books, setBooks] = useState([]);
    const [cart, setCart] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const booksPerPage = 5;
    const [showInvoice, setShowInvoice] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({
        id: '',
        name: '',
        phone: '',
        email: '',
        debt: 0,
    });
    const [employeeInfo, setEmployeeInfo] = useState({
        id: '',
        name: '',
    });
    const [finalInvoice, setFinalInvoice] = useState(false);
    const [newInvoiceId, setNewInvoiceId] = useState(null);
    const invoiceRef = useRef(null);
    const finalInvoiceRef = useRef(null);
    const [showNotification, setShowNotification] = useState(false);
    const [showSaveNotification, setShowSaveNotification] = useState(false);
    const [showEmployeeNotification, setShowEmployeeNotification] = useState(false);
    const [showCustomerNotification, setShowCustomerNotification] = useState(false);
    const [showDebtNotification, setShowDebtNotification] = useState(false);
    const [tienKhachTra, setTienKhachTra] = useState('');
    const [tienKhachTraError, setTienKhachTraError] = useState(false);
    const [tienKhachTraErrorMsg, setTienKhachTraErrorMsg] = useState('');

    const formatNumber = (value) => {
        if (!value) return '';
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    const parseNumber = (value) => value.replace(/,/g, '');

    // Lấy danh sách sách từ API
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const [sachList, dauSachList, tacGiaList, ctNhapSachList, thamSoList] = await Promise.all([
                    thanhToanMoiApi.getAllBooks(),
                    thanhToanMoiApi.getAllDauSach(),
                    thanhToanMoiApi.getAllTacGia(),
                    thanhToanMoiApi.getAllCTNhapSach(),
                    thanhToanMoiApi.getAllThamSo()
                ]);
                const thamSo = thamSoList[0]; // Giả định chỉ có một tham số
                const booksData = sachList.map(sach => {
                    const dauSach = dauSachList.find(ds => ds.MaDauSach === sach.MaDauSach);
                    let tenSach = dauSach ? dauSach.TenSach : '';
                    let tacGia = '';
                    if (dauSach && Array.isArray(dauSach.MaTG)) {
                        tacGia = dauSach.MaTG
                            .map(maTG => {
                                const tg = tacGiaList.find(t => t.MaTG === maTG);
                                return tg ? tg.TenTG : '';
                            })
                            .filter(Boolean)
                            .join(', ');
                    }
                    // Lấy giá nhập từ ctNhapSach và tính đơn giá bằng GiaNhap * TiLe
                    const ctNhapSach = ctNhapSachList.find(ct => ct.MaSach === sach.MaSach);
                    const giaNhap = ctNhapSach ? ctNhapSach.GiaNhap : 0;
                    const donGia = thamSo && giaNhap ? Math.round(giaNhap * thamSo.TiLe) : 0;
                    return {
                        maSach: String(sach.MaSach),
                        tenSach,
                        tacGia,
                        nhaXuatBan: sach.NXB,
                        donGia,
                        soLuongTon: sach.SLTon,
                        maDauSach: sach.MaDauSach
                    };
                });
                setBooks(booksData);
            } catch (error) {
                console.error('Error fetching books:', error);
                setBooks([]);
            }
        };
        fetchBooks();
    }, [showSaveNotification]);

    // Lấy mã hóa đơn lớn nhất khi hiển thị finalInvoice
    useEffect(() => {
        const generateNewInvoiceId = async () => {
            if (finalInvoice && !invoice) {
                try {
                    const invoices = await thanhToanMoiApi.getAllHoaDon();
                    let maxId = 1;
                    if (invoices && invoices.length > 0) {
                        maxId = invoices.reduce((max, inv) => {
                            const num = parseInt(inv.MaHD, 10);
                            return num > max ? num : max;
                        }, 0) + 1;
                    }
                    setNewInvoiceId(maxId);
                } catch {
                    setNewInvoiceId(1);
                }
            }
        };
        generateNewInvoiceId();
    }, [finalInvoice, invoice]);

    useEffect(() => {
        if (invoice) {
            setCart(
                invoice.danhSachSach.map(sach => ({
                    maSach: String(sach.MaSach),
                    tenSach: sach.tenSach,
                    soLuongMua: sach.soLuong,
                    donGia: sach.donGia,
                    soLuongTon: sach.soLuongTon || 0,
                }))
            );
            setCustomerInfo({
                id: String(invoice.MaKH),
                name: invoice.tenKhachHang,
                phone: invoice.sdt,
                email: invoice.email,
                debt: invoice.soNo || 0,
            });
            setEmployeeInfo({
                id: String(invoice.NguoiLapHD) || '',
                name: invoice.nhanVien || '',
            });
            setNewInvoiceId(parseInt(invoice.MaHD, 10));
        } else {
            setCart([]);
            setCustomerInfo({
                id: '',
                name: '',
                phone: '',
                email: '',
                debt: 0,
            });
            setEmployeeInfo({
                id: '',
                name: '',
            });
            setShowInvoice(false);
            setFinalInvoice(false);
            setNewInvoiceId(null);
        }
    }, [invoice, showSaveNotification]);

    const handleAddToCart = (book) => {
        const existing = cart.find(item => item.maSach === book.maSach);
        if (existing) {
            if (existing.soLuongMua < book.soLuongTon) {
                setCart(cart.map(item =>
                    item.maSach === book.maSach
                        ? { ...item, soLuongMua: item.soLuongMua + 1 }
                        : item
                ));
            } else {
                setShowNotification(true);
            }
        } else {
            if (book.soLuongTon > 0) {
                setCart([...cart, { ...book, soLuongMua: 1 }]);
            }
        }
    };

    const handleIncrease = (maSach) => {
        setCart(cart.map(item =>
            item.maSach === maSach && item.soLuongMua < item.soLuongTon
                ? { ...item, soLuongMua: item.soLuongMua + 1 }
                : item
        ));
    };

    const handleDecrease = (maSach) => {
        setCart(cart.map(item =>
            item.maSach === maSach && item.soLuongMua > 1
                ? { ...item, soLuongMua: item.soLuongMua - 1 }
                : item
        ));
    };

    const handleRemove = (maSach) => {
        setCart(cart.filter(item => item.maSach !== maSach));
    };

    const filteredBooks = books.filter(book =>
        book.tenSach.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.maSach.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayedBooks = searchTerm
        ? filteredBooks
        : books.slice(currentPage * booksPerPage, (currentPage + 1) * booksPerPage);

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const totalQuantity = cart.reduce((sum, item) => sum + item.soLuongMua, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.soLuongMua * item.donGia, 0);

    const handleCustomerIdChange = async (e) => {
        const customerId = e.target.value;
        setCustomerInfo({ ...customerInfo, id: customerId });

        if (!customerId) {
            setCustomerInfo({ id: '', name: '', phone: '', email: '', debt: 0 });
            if (finalInvoice) {
                setFinalInvoice(false);
            }
            return;
        }

        try {
            const customer = await thanhToanMoiApi.getCustomerById(customerId);
            const updatedCustomerInfo = {
                id: String(customer.MaKhachHang),
                name: customer.HoTen,
                phone: customer.DienThoai,
                email: customer.Email,
                debt: customer.SoTienNo,
            };
            setCustomerInfo(updatedCustomerInfo);

            // Kiểm tra số nợ của khách hàng mới so với NoTD
            const thamSoList = await thanhToanMoiApi.getAllThamSo();
            const thamSo = thamSoList[0]; // Giả định chỉ có một tham số
            if (!thamSo) {
                console.error('Không tìm thấy tham số NoTD');
                alert('Lỗi hệ thống: Không tìm thấy tham số nợ tối đa.');
                return;
            }

            if (updatedCustomerInfo.debt > thamSo.NoTD) {
                setShowDebtNotification(true);
                if (finalInvoice) {
                    setFinalInvoice(false);
                }
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin khách hàng:', error);
            setCustomerInfo({ id: customerId, name: '', phone: '', email: '', debt: 0 });
            if (finalInvoice) {
                setFinalInvoice(false);
            }
        }
    };

    const handleEmployeeIdChange = async (e) => {
        const employeeId = e.target.value;
        setEmployeeInfo({ ...employeeInfo, id: employeeId });

        if (!employeeId) {
            setEmployeeInfo({ id: '', name: '' });
            return;
        }

        try {
            const employee = await thanhToanMoiApi.getUserById(employeeId);
            setEmployeeInfo({
                id: String(employee.id),
                name: `${employee.last_name} ${employee.first_name}`,
            });
        } catch {
            setEmployeeInfo({ id: employeeId, name: '' });
        }
    };

    const handleCustomerInfoSubmit = async (e) => {
        e.preventDefault();

        if (!employeeInfo.id || !employeeInfo.name) {
            setShowEmployeeNotification(true);
            return;
        }
        if (!customerInfo.id || !customerInfo.name || !customerInfo.phone || !customerInfo.email) {
            setShowCustomerNotification(true);
            return;
        }

        try {
            // Lấy NoTD từ thamso
            const thamSoList = await thanhToanMoiApi.getAllThamSo();
            const thamSo = thamSoList[0]; // Giả định chỉ có một tham số
            if (!thamSo) {
                console.error('Không tìm thấy tham số NoTD');
                alert('Lỗi hệ thống: Không tìm thấy tham số nợ tối đa.');
                return;
            }

            // Kiểm tra số nợ hiện tại có vượt NoTD không
            if (customerInfo.debt > thamSo.NoTD) {
                setShowDebtNotification(true);
                return;
            }

            // Nếu hợp lệ, tiếp tục hoàn tất hóa đơn
            setFinalInvoice(true);
            setTimeout(() => {
                finalInvoiceRef.current.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (error) {
            console.error('Lỗi khi kiểm tra nợ:', error);
            alert('Có lỗi khi kiểm tra số nợ khách hàng!');
        }
    };

    const handleCreateNewInvoice = () => {
        navigate('/thanhtoan/moi', { state: null });
        setTienKhachTra('');
        setTienKhachTraError(false);
        setTienKhachTraErrorMsg('');
    };

    const handleSaveInvoice = async () => {
        if (!tienKhachTra) {
            setTienKhachTraError(true);
            setTienKhachTraErrorMsg('Vui lòng nhập số tiền khách trả!');
            return;
        }
        if (tienKhachTraError) {
            return;
        }
        const totalInvoiceAmount = cart.reduce((sum, item) => sum + item.soLuongMua * item.donGia, 0);
        const tienKhachTraNumber = parseInt(parseNumber(tienKhachTra) || '0');
        const newDebt = customerInfo.debt + (totalInvoiceAmount - tienKhachTraNumber);

        const updatedInvoice = {
            MaHD: invoice ? invoice.MaHD : newInvoiceId,
            NgayLap: new Date().toISOString().split('T')[0],
            TongTien: totalInvoiceAmount,
            SoTienTra: tienKhachTraNumber,
            ConLai: newDebt,
            MaKH: customerInfo.id,
            NguoiLapHD: employeeInfo.id,
        };

        try {
            await thanhToanMoiApi.createInvoice(updatedInvoice);
            for (const item of cart) {
                const ctHoaDon = {
                    MaHD: updatedInvoice.MaHD,
                    MaSach: item.maSach,
                    SLBan: item.soLuongMua,
                    GiaBan: item.donGia,
                    ThanhTien: item.soLuongMua * item.donGia,
                };
                await thanhToanMoiApi.createCTHoaDon(ctHoaDon);
                const newStock = Math.max(0, (item.soLuongTon || 0) - item.soLuongMua);
                await thanhToanMoiApi.updateBookStock(item.maSach, newStock);
            }
            await thanhToanMoiApi.updateCustomerDebt(customerInfo.id, newDebt);
            setShowSaveNotification(true);
            setTienKhachTra('');
            setTienKhachTraError(false);
            setTienKhachTraErrorMsg('');
        } catch (err) {
            console.error('Error saving invoice, chi tiet hoa don, stock, or customer debt:', err);
            alert('Có lỗi khi lưu hóa đơn, chi tiết hóa đơn, tồn kho, hoặc nợ khách hàng!');
        }
    };

    const handleCloseNotification = () => {
        setCart([]);
        setCustomerInfo({
            id: '',
            name: '',
            phone: '',
            email: '',
            debt: 0,
        });
        setEmployeeInfo({
            id: '',
            name: '',
        });
        setShowSaveNotification(false);
        setShowInvoice(false);
        setFinalInvoice(false);
        setNewInvoiceId(null);
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Tạo Hóa Đơn Mua Sách</h1>

            {showNotification && (
                <div className="notification-modal-ttm">
                    <div className="notification-content-ttm">
                        <p>Không thể thêm quá số lượng sách hiện có.</p>
                        <button className="close-button-ttm" onClick={() => setShowNotification(false)}>Đóng</button>
                    </div>
                </div>
            )}

            {showSaveNotification && (
                <div className="notification-modal-ttm">
                    <div className="notification-content-ttm">
                        <p>Thanh toán thành công!</p>
                        <div className="notification-actions-ttm">
                            <button
                                className="close-button-ttm"
                                onClick={handleCloseNotification}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEmployeeNotification && (
                <div className="notification-modal-ttm">
                    <div className="notification-content-ttm">
                        <p>Vui lòng nhập đầy đủ thông tin nhân viên.</p>
                        <button
                            className="close-button-ttm"
                            onClick={() => setShowEmployeeNotification(false)}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {showCustomerNotification && (
                <div className="notification-modal-ttm">
                    <div className="notification-content-ttm">
                        <p>Vui lòng nhập đầy đủ thông tin khách hàng.</p>
                        <button
                            className="close-button-ttm"
                            onClick={() => setShowCustomerNotification(false)}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {showDebtNotification && (
                <div className="notification-modal-ttm">
                    <div className="notification-content-ttm">
                        <p>Số tiền nợ vượt quá mức cho phép mua sách.</p>
                        <button
                            className="close-button-ttm"
                            onClick={() => setShowDebtNotification(false)}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            <div className="book-search-section-ttm">
                <div className="search-header-ttm">
                    <button
                        className="invoice-list-button-ttm"
                        style={{ marginTop: '1rem', marginBottom: '1rem', marginRight: '1.4rem' }}
                        onClick={() => navigate('/thanhToan/hoaDon')}
                    >
                        Danh sách các hóa đơn
                    </button>
                </div>
                <input
                    type="text"
                    className="search-bar-ttm"
                    placeholder="Tìm kiếm sách theo mã sách hoặc theo tên"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <table className="book-table-ttm">
                    <thead>
                        <tr>
                            <th>Mã sách</th>
                            <th>Tên sách</th>
                            <th>Tác giả</th>
                            <th>Nhà XB</th>
                            <th>Đơn giá</th>
                            <th>Tồn</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="book-table-wrapper-ttm">
                        {displayedBooks.map((book) => (
                            <tr key={book.maSach}>
                                <td>{book.maSach}</td>
                                <td>{book.tenSach}</td>
                                <td>{book.tacGia}</td>
                                <td>{book.nhaXuatBan}</td>
                                <td>{book.donGia.toLocaleString()}đ</td>
                                <td>{book.soLuongTon}</td>
                                <td>
                                    <button
                                        className="icon-button-ttm"
                                        onClick={() => handleAddToCart(book)}
                                        disabled={book.soLuongTon === 0}
                                        style={{
                                            backgroundColor: book.soLuongTon === 0 ? '#ccc' : '',
                                            cursor: book.soLuongTon === 0 ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        <FaCartPlus />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination-info-wrapper-ttm">
                    <button
                        className="pagination-button-ttm"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 0}
                    >
                        <FaCaretLeft />
                    </button>
                    <span className="pagination-info-ttm">
                        Hiển thị {currentPage * booksPerPage + 1} -{' '}
                        {Math.min((currentPage + 1) * booksPerPage, filteredBooks.length)} trên {filteredBooks.length} sách
                    </span>
                    <button
                        className="pagination-button-ttm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages - 1}
                    >
                        <FaCaretRight />
                    </button>
                </div>
            </div>

            <div className="cart-section-ttm">
                <h2 className="cart-header-ttm">Giỏ hàng</h2>
                <div className="cart-summary-ttm">
                    <span>Tổng số sách đã chọn: {totalQuantity}</span>
                    <span>Tổng số tiền: {totalPrice.toLocaleString()}đ</span>
                </div>
                <table className="cart-table-ttm">
                    <thead>
                        <tr>
                            <th>Mã sách</th>
                            <th>Tên sách</th>
                            <th>Đơn giá</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item) => (
                            <tr key={item.maSach}>
                                <td>{item.maSach}</td>
                                <td>{item.tenSach}</td>
                                <td>{item.donGia.toLocaleString()}đ</td>
                                <td>
                                    <div className="quantity-wrapper-ttm">
                                        <button
                                            className="quantity-button-ttm"
                                            onClick={() => handleDecrease(item.maSach)}
                                            disabled={item.soLuongMua <= 1}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            className="quantity-input-ttm"
                                            value={item.soLuongMua}
                                            onChange={(e) => {
                                                const value = Math.max(1, Math.min(item.soLuongTon, parseInt(e.target.value) || 1));
                                                setCart(cart.map(cartItem =>
                                                    cartItem.maSach === item.maSach
                                                        ? { ...cartItem, soLuongMua: value }
                                                        : cartItem
                                                ));
                                            }}
                                        />
                                        <button
                                            className="quantity-button-ttm"
                                            onClick={() => handleIncrease(item.maSach)}
                                            disabled={item.soLuongMua >= item.soLuongTon}
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td>{(item.soLuongMua * item.donGia).toLocaleString()}đ</td>
                                <td>
                                    <button className="icon-button-ttm" onClick={() => handleRemove(item.maSach)}><IoTrashBin /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button
                    className="next-button-ttm"
                    onClick={() => {
                        if (cart.length > 0) {
                            setShowInvoice(true);
                            setTimeout(() => {
                                invoiceRef.current.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                        } else {
                            alert('Vui lòng thêm ít nhất một sản phẩm vào giỏ hàng.');
                        }
                    }}
                >
                    Tiếp theo
                </button>
            </div>

            {showInvoice && (
                <div className="invoice-section-ttm" ref={invoiceRef}>
                    <div className="header-ttm">
                        THÔNG TIN NHÂN VIÊN VÀ KHÁCH HÀNG
                    </div>
                    <div className="details-ttm">
                        <div className="left-ttm">
                            <div className="input-group-ttm">
                                <label htmlFor="employee-id">Mã nhân viên:</label>
                                <input
                                    id="employee-id"
                                    type="text"
                                    placeholder="Nhập mã nhân viên"
                                    value={employeeInfo.id}
                                    onChange={handleEmployeeIdChange}
                                    required
                                />
                            </div>
                            <p><strong>Họ và tên nhân viên:</strong> {employeeInfo.name}</p>
                        </div>
                        <div className="right-ttm">
                            <div className="input-group-ttm">
                                <label htmlFor="customer-id">Mã khách hàng:</label>
                                <input
                                    id="customer-id"
                                    type="text"
                                    placeholder="Nhập mã khách hàng"
                                    value={customerInfo.id}
                                    onChange={handleCustomerIdChange}
                                    required
                                />
                            </div>
                            <p><strong>Họ và tên khách hàng:</strong> {customerInfo.name}</p>
                            <p><strong>Số điện thoại:</strong> {customerInfo.phone}</p>
                            <p><strong>Email:</strong> {customerInfo.email}</p>
                            <p><strong>Số tiền nợ:</strong> {customerInfo.debt.toLocaleString()}đ</p>
                        </div>
                    </div>
                    <div className="actions-ttm">
                        <button type="button" className="finalize-button-ttm" onClick={handleCustomerInfoSubmit}>
                            Hoàn tất hóa đơn
                        </button>
                    </div>
                </div>
            )}

            {finalInvoice && (
                <div className="final-invoice-section-ttm" ref={finalInvoiceRef}>
                    <div className="header-ttm">
                        <h2 style={{ textAlign: 'center', textTransform: 'uppercase' }}>HÓA ĐƠN MUA SÁCH</h2>
                    </div>
                    <div className="info-section-ttm" style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', lineHeight: '2' }}>
                        <div className="left-info-ttm" style={{ flex: 1 }}>
                            <p><strong>Ngày lập hóa đơn:</strong> {new Date().toLocaleDateString()}</p>
                            <p><strong>Mã hóa đơn:</strong> {invoice ? invoice.MaHD : newInvoiceId || 'Đang tạo...'}</p>
                            <p><strong>Mã nhân viên:</strong> {employeeInfo.id}</p>
                            <p><strong>Tên nhân viên:</strong> {employeeInfo.name}</p>
                        </div>
                        <div className="right-info-ttm" style={{ flex: 1 }}>
                            <p><strong>Mã khách hàng:</strong> {customerInfo.id}</p>
                            <p><strong>Tên khách hàng:</strong> {customerInfo.name}</p>
                            <p><strong>Số điện thoại:</strong> {customerInfo.phone}</p>
                            <p><strong>Email:</strong> {customerInfo.email}</p>
                        </div>
                    </div>
                    <div className="books-list-ttm">
                        <table className="invoice-table-ttm">
                            <thead>
                                <tr>
                                    <th>Mã sách</th>
                                    <th>Tên sách</th>
                                    <th>Đơn giá</th>
                                    <th>Số lượng</th>
                                    <th>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item) => (
                                    <tr key={item.maSach}>
                                        <td>{item.maSach}</td>
                                        <td>{item.tenSach}</td>
                                        <td>{item.donGia.toLocaleString()}đ</td>
                                        <td>{item.soLuongMua}</td>
                                        <td>{(item.soLuongMua * item.donGia).toLocaleString()}đ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="totals-ttm" style={{ marginTop: '2rem', textAlign: 'right' }}>
                        <p><strong>Tổng tiền sách:</strong> {totalPrice.toLocaleString()}đ</p>
                        <p>
                            <strong>Tiền khách trả:</strong>
                            <input
                                type="text"
                                style={{
                                    marginLeft: '1rem',
                                    width: '9rem',
                                    padding: '0.3rem 0.5rem',
                                    fontSize: '1rem',
                                    border: tienKhachTraError ? '2px solid #ff4d4d' : '0.1% solid #ccc',
                                    borderRadius: '10%',
                                    textAlign: 'right',
                                    color: tienKhachTraError ? '#ff4d4d' : undefined,
                                    background: tienKhachTraError ? '#fff0f0' : undefined
                                }}
                                value={formatNumber(tienKhachTra)}
                                onChange={e => {
                                    const raw = e.target.value.replace(/[^0-9]/g, '');
                                    if (!raw) {
                                        setTienKhachTraError(true);
                                        setTienKhachTraErrorMsg('Vui lòng nhập số tiền khách trả!');
                                    } else if (parseInt(raw || '0') > totalPrice) {
                                        setTienKhachTraError(true);
                                        setTienKhachTraErrorMsg('Số tiền khách trả không được vượt quá tổng tiền sách!');
                                    } else {
                                        setTienKhachTraError(false);
                                        setTienKhachTraErrorMsg('');
                                    }
                                    setTienKhachTra(raw);
                                }}
                                placeholder="Nhập số tiền trả"
                                inputMode="numeric"
                            /> đ
                        </p>
                        {tienKhachTraError && (
                            <p style={{ color: '#ff4d4d', fontWeight: 'bold', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
                                {tienKhachTraErrorMsg}
                            </p>
                        )}
                        <p>
                            <strong>Còn lại:</strong>{' '}
                            {(totalPrice - parseInt(parseNumber(tienKhachTra) || '0')).toLocaleString()}đ
                        </p>
                    </div>
                    <div className="actions-ttm">
                        <button
                            type="button"
                            className="finalize-button-ttm"
                            style={{ backgroundColor: '#007bff', margin: '0 auto', display: 'block', color: 'white', marginBottom: '1rem', marginTop: '2rem' }}
                            onClick={handleSaveInvoice}
                        >
                            Lưu hóa đơn
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ThanhToanMoi;