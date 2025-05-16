import React, { useState, useRef, useEffect } from 'react';
import { FaCartPlus } from "react-icons/fa6";
import { IoTrashBin } from "react-icons/io5";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation for navigation
import bookData from './ThanhToanMoiData';
import customerData from './CustomerData'; // Mock customer data
import employeeData from './EmployeeData'; // Mock employee data
import '../../../styles/PathStyles.css';
import './ThanhToanMoi.css';

function ThanhToanMoi() {
    const navigate = useNavigate(); // Initialize useNavigate
    const location = useLocation(); // Access passed state
    const invoice = location.state?.invoice; // Retrieve invoice data if available

    const [searchTerm, setSearchTerm] = useState('');
    const [books] = useState(() => {
        const storedBooks = JSON.parse(localStorage.getItem('books') || '[]');
        return storedBooks.length > 0 ? storedBooks : bookData;
    });
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
        id: '', // Employee ID is not passed in the invoice
        name: '',
    });
    const [finalInvoice, setFinalInvoice] = useState(false);
    const invoiceRef = useRef(null);
    const finalInvoiceRef = useRef(null);
    const [showNotification, setShowNotification] = useState(false);
    const [showSaveNotification, setShowSaveNotification] = useState(false); // State for save notification modal
    const [showEmployeeNotification, setShowEmployeeNotification] = useState(false); // State for employee info notification
    const [showCustomerNotification, setShowCustomerNotification] = useState(false); // State for customer info notification
    const [tienKhachTra, setTienKhachTra] = useState('');
    const [tienKhachTraError, setTienKhachTraError] = useState(false);
    const [tienKhachTraErrorMsg, setTienKhachTraErrorMsg] = useState('');
    const formatNumber = (value) => {
        if (!value) return '';
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    const parseNumber = (value) => value.replace(/,/g, '');

    useEffect(() => {
        // Nếu có invoice (sửa hóa đơn), set lại cart và thông tin khách/nhân viên
        if (invoice) {
            setCart(
                invoice.danhSachSach.map(sach => ({
                    maSach: sach.maSach,
                    tenSach: sach.tenSach,
                    soLuongMua: sach.soLuong,
                    donGia: sach.donGia,
                }))
            );
            setCustomerInfo({
                id: invoice.maKhachHang,
                name: invoice.tenKhachHang,
                phone: invoice.sdt,
                email: invoice.email,
                debt: invoice.soNo,
            });
            setEmployeeInfo({
                id: invoice.maNhanVien || '', // Include maNhanVien
                name: invoice.nhanVien,
            });
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
                setShowNotification(true); // Show notification modal
            }
        } else {
            if (book.soLuongTon > 0) {
                setCart([...cart, { ...book, soLuongMua: 1 }]);
            }
        }
    };

    const handleIncrease = (maSach) => {
        setCart(cart.map(item =>
            item.maSach === maSach
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
        book.maSach.toLowerCase().includes(searchTerm.toLowerCase()) // Search by book name or ID
    );

    const displayedBooks = searchTerm
        ? filteredBooks // Show all matching books if a search term is entered
        : books.slice(currentPage * booksPerPage, (currentPage + 1) * booksPerPage); // Otherwise, paginate

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

    const handleCustomerIdChange = (e) => {
        const customerId = e.target.value;
        setCustomerInfo({ ...customerInfo, id: customerId });

        // Fetch customer information based on the entered ID
        const customer = customerData.find(c => c.id === customerId);
        if (customer) {
            setCustomerInfo({
                id: customer.id,
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
                debt: customer.debt,
            });
        } else {
            setCustomerInfo({ id: customerId, name: '', phone: '', email: '', debt: 0 });
        }
    };

    const handleEmployeeIdChange = (e) => {
        const employeeId = e.target.value;
        setEmployeeInfo({ ...employeeInfo, id: employeeId });

        // Fetch employee information based on the entered ID
        const employee = employeeData.find(emp => emp.id === employeeId);
        if (employee) {
            setEmployeeInfo({
                id: employee.id,
                name: employee.name,
            });
        } else {
            setEmployeeInfo({ id: employeeId, name: '' });
        }
    };

    const generateInvoiceId = () => {
        const existingInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
        if (existingInvoices.length === 0) {
            return 'HD001'; // Start with HD001 if no invoices exist
        }
        const lastInvoiceId = existingInvoices[existingInvoices.length - 1].maHoaDon;
        const nextIdNumber = parseInt(lastInvoiceId.replace('HD', '')) + 1;
        return `HD${String(nextIdNumber).padStart(3, '0')}`; // Ensure 3-digit format
    };

    const handleCustomerInfoSubmit = (e) => {
        e.preventDefault();

        // Validate required fields
        if (!employeeInfo.id || !employeeInfo.name) {
            setShowEmployeeNotification(true); // Show notification modal
            return;
        }
        if (!customerInfo.id || !customerInfo.name || !customerInfo.phone || !customerInfo.email) {
            setShowCustomerNotification(true); // Show notification modal
            return;
        }

        // Chỉ chuyển sang xem hóa đơn, chưa lưu vào localStorage
        setFinalInvoice(true); // Show the final invoice
        setTimeout(() => {
            finalInvoiceRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to the final invoice
        }, 100);
    };

    const handleCreateNewInvoice = () => {
        navigate('/thanhtoan/moi', { state: null }); // Navigate to /thanhtoan/moi with no pre-filled data
        setTienKhachTra(''); // Xóa số tiền khách trả cũ khi tạo hóa đơn mới
        setTienKhachTraError(false);
        setTienKhachTraErrorMsg('');
    };

    const handleSaveInvoice = () => {
        // Không cho lưu nếu chưa nhập tiền khách trả hoặc có lỗi nhập tiền khách trả
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
        const tienNoSauThanhToan = customerInfo.debt + Math.max(0, totalInvoiceAmount - tienKhachTraNumber);

        const updatedInvoice = {
            ...invoice, // Use existing invoice details if editing
            maHoaDon: invoice?.maHoaDon || generateInvoiceId(), // Use existing ID or generate a new one
            nhanVien: employeeInfo.name,
            maNhanVien: employeeInfo.id,
            maKhachHang: customerInfo.id,
            tenKhachHang: customerInfo.name,
            sdt: customerInfo.phone,
            email: customerInfo.email,
            soNo: tienNoSauThanhToan, // Lưu số nợ sau thanh toán vào hóa đơn
            tienKhachTra: tienKhachTraNumber,
            ngayLap: new Date().toISOString().split('T')[0],
            danhSachSach: cart.map(item => ({
                maSach: item.maSach,
                tenSach: item.tenSach,
                soLuong: item.soLuongMua,
                donGia: item.donGia,
            })),
        };

        // Update the invoice in localStorage
        const existingInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
        const updatedInvoices = existingInvoices.map((inv) =>
            inv.maHoaDon === updatedInvoice.maHoaDon ? updatedInvoice : inv
        );
        if (!existingInvoices.some(inv => inv.maHoaDon === updatedInvoice.maHoaDon)) {
            updatedInvoices.push(updatedInvoice); // Add new invoice if it doesn't exist
        }
        localStorage.setItem('invoices', JSON.stringify(updatedInvoices));

        // Update customer debt in localStorage (lưu số nợ sau thanh toán)
        const updatedCustomers = customerData.map(customer =>
            customer.id === customerInfo.id
                ? { ...customer, debt: tienNoSauThanhToan }
                : customer
        );
        localStorage.setItem('customers', JSON.stringify(updatedCustomers));
        customerData.splice(0, customerData.length, ...updatedCustomers);

        // Không cập nhật lại số lượng tồn của sách, chỉ lưu hóa đơn và khách hàng

        setShowSaveNotification(true); // Show the save notification modal
        setTienKhachTra(''); // Xóa giá trị ô input sau khi lưu hóa đơn
        setTienKhachTraError(false);
        setTienKhachTraErrorMsg('');
    };

    const handleCloseNotification = () => {
        setCart([]); // Clear the cart
        setCustomerInfo({
            id: '',
            name: '',
            phone: '',
            email: '',
            debt: 0,
        }); // Reset customer info
        setEmployeeInfo({
            id: '',
            name: '',
        }); // Reset employee info
        setShowSaveNotification(false); // Close the notification modal
        setShowInvoice(false); // Reset the invoice view
        setFinalInvoice(false); // Reset the final invoice state
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Tạo Hóa Đơn Mua Sách</h1>

            {/* Notification Modal for Book Quantity */}
            {showNotification && (
                <div className="notification-modal-ttm">
                    <div className="notification-content-ttm">
                        <p>Không thể thêm quá số lượng sách hiện có.</p>
                        <button className="close-button-ttm" onClick={() => setShowNotification(false)}>Đóng</button>
                    </div>
                </div>
            )}

            {/* Notification Modal for Save Success */}
            {showSaveNotification && (
                <div className="notification-modal-ttm">
                    <div className="notification-content-ttm">
                        <p>Thanh toán thành công!</p>
                        <div className="notification-actions-ttm">
                            <button
                                className="close-button-ttm"
                                onClick={handleCloseNotification} // Reset and return to an empty cart
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Modal for Employee Info */}
            {showEmployeeNotification && (
                <div className="notification-modal-ttm">
                    <div className="notification-content-ttm">
                        <p>Vui lòng nhập đầy đủ thông tin nhân viên.</p>
                        <button
                            className="close-button-ttm"
                            onClick={() => setShowEmployeeNotification(false)} // Close the notification modal
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {/* Notification Modal for Customer Info */}
            {showCustomerNotification && (
                <div className="notification-modal-ttm">
                    <div className="notification-content-ttm">
                        <p>Vui lòng nhập đầy đủ thông tin khách hàng.</p>
                        <button
                            className="close-button-ttm"
                            onClick={() => setShowCustomerNotification(false)} // Close the notification modal
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {/* Book Search Section */}
            <div className="book-search-section-ttm">
                <div className="search-header-ttm">
                    <button
                        className="invoice-list-button-ttm"
                        style={{ marginTop: '1rem', marginBottom: '1rem', marginRight: '1.4rem' }}
                        onClick={() => navigate('/thanhToan/hoaDon')} // Corrected path to match the route for HoaDon.jsx
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
                                            backgroundColor: book.soLuongTon === 0 ? '#ccc' : '', // Gray color for disabled button
                                            cursor: book.soLuongTon === 0 ? 'not-allowed' : 'pointer', // Not-allowed cursor for disabled button
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

            {/* Cart Section */}
            <div className="cart-section-ttm">
                <h2 className="cart-header-ttm">Giỏ hàng</h2>
                <div className="cart-summary-ttm">
                    <span>Tổng số sách đã chọn: {cart.reduce((sum, item) => sum + item.soLuongMua, 0)}</span>
                    <span>Tổng số tiền: {cart.reduce((sum, item) => sum + item.soLuongMua * item.donGia, 0).toLocaleString()}đ</span>
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
                                            disabled={item.soLuongMua <= 1} // Disable if quantity is less than or equal to 1
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
                                            disabled={item.soLuongMua >= item.soLuongTon} // Disable if quantity reaches maximum stock
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
                            setShowInvoice(true); // Show the invoice section
                            setTimeout(() => {
                                invoiceRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to the invoice section
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
                    {/* Div 1: Header */}
                    <div className="header-ttm">
                        <h2 style={{ textAlign: 'center', textTransform: 'uppercase' }}>HÓA ĐƠN MUA SÁCH</h2>
                    </div>

                    {/* Div 2: Employee and Customer Info */}
                    <div className="info-section-ttm" style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', lineHeight: '2' }}>
                        <div className="left-info-ttm" style={{ flex: 1 }}>
                            <p><strong>Ngày lập hóa đơn:</strong> {new Date().toLocaleDateString()}</p>
                            <p><strong>Mã hóa đơn:</strong> HD{Math.floor(Math.random() * 100000)}</p>
                            <p><strong>Mã nhân viên:</strong> {employeeInfo.id}</p>
                            <p><strong>Tên nhân viên:</strong> {employeeInfo.name}</p>
                        </div>
                        <div className="right-info-ttm" style={{ flex: 1 }}>
                            <p><strong>Mã khách hàng:</strong> {customerInfo.id}</p>
                            <p><strong>Tên khách hàng:</strong> {customerInfo.name}</p>
                            <p><strong>Số điện thoại:</strong> {customerInfo.phone}</p>
                            <p><strong>Email:</strong> {customerInfo.email}</p>
                            <p>
                                <strong>Số tiền nợ trước khi lập hóa đơn:</strong> {
                                    (() => {
                                        const totalInvoiceAmount = cart.reduce((sum, item) => sum + item.soLuongMua * item.donGia, 0);
                                        const tienKhachTraNumber = parseInt(parseNumber(tienKhachTra) || '0');
                                        const tienNoSauThanhToan = customerInfo.debt + Math.max(0, totalInvoiceAmount - tienKhachTraNumber);
                                        return (tienNoSauThanhToan - Math.max(0, totalInvoiceAmount - tienKhachTraNumber)).toLocaleString() + 'đ';
                                    })()
                                }
                            </p>
                        </div>
                    </div>

                    {/* Div 3: Purchased Books List */}
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

                    {/* Div 4: Total Amounts */}
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
                            <strong>Tổng số tiền nợ sau hóa đơn:</strong> {
                                (
                                    customerInfo.debt +
                                    Math.max(0, totalPrice - (parseInt(parseNumber(tienKhachTra) || '0')))
                                ).toLocaleString()
                            }đ
                        </p>
                    </div>

                    {/* Div 5: Save Invoice Button */}
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