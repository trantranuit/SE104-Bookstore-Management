import React, { useState, useRef } from 'react';
import { FaCartPlus } from "react-icons/fa6";
import { IoTrashBin } from "react-icons/io5";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import bookData from './ThanhToanMoiData';
import customerData from './CustomerData'; // Mock customer data
import employeeData from './EmployeeData'; // Mock employee data
import '../../../styles/PathStyles.css';
import './ThanhToanMoi.css';

function ThanhToanMoi() {
    const navigate = useNavigate(); // Initialize useNavigate
    const [searchTerm, setSearchTerm] = useState('');
    const [books] = useState(bookData);
    const [cart, setCart] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const booksPerPage = 5;
    const [showInvoice, setShowInvoice] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({ id: '', name: '', phone: '', email: '', debt: 0 });
    const [employeeInfo, setEmployeeInfo] = useState({ id: '', name: '' });
    const [finalInvoice, setFinalInvoice] = useState(false);
    const invoiceRef = useRef(null);
    const finalInvoiceRef = useRef(null);
    const [showNotification, setShowNotification] = useState(false);

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

    const handleThanhToan = () => {
        if (cart.length > 0) {
            setShowInvoice(true); // Show the invoice
            setTimeout(() => {
                invoiceRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to the invoice
            }, 100);
        } else {
            alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
        }
    };

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

    const handleCustomerInfoSubmit = (e) => {
        e.preventDefault();
        setFinalInvoice(true); // Show the final invoice
        setTimeout(() => {
            finalInvoiceRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to the final invoice
        }, 100);
    };

    return (
        <div className="page-container">
            {/* Notification Modal */}
            {showNotification && (
                <div className="notification-modal">
                    <div className="notification-content">
                        <p>Không thể thêm quá số lượng sách hiện có.</p>
                        <button onClick={() => setShowNotification(false)}>Đóng</button>
                    </div>
                </div>
            )}

            <h1 className="page-title">Tạo Hóa Đơn Mua Sách</h1>

            {/* Book Search Section */}
            <div className="book-search-section">
                <div className="search-header">
                    <button
                        className="invoice-list-button"
                        style={{marginTop: '1rem', marginBottom: '1rem', marginRight: '1.4rem'}}
                        onClick={() => navigate('/hoadon')} // Navigate to the HoaDon page
                    >
                        Danh sách các hóa đơn
                    </button>
                </div>
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Tìm kiếm sách..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <table className="book-table">
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
                    <tbody className="book-table-wrapper">
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
                                        className="icon-button"
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
                <div className="pagination-info-wrapper">
                    <button
                        className="pagination-button"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 0}
                    >
                        <FaCaretLeft />
                    </button>
                    <span className="pagination-info">
                        Hiển thị {currentPage * booksPerPage + 1} -{' '}
                        {Math.min((currentPage + 1) * booksPerPage, filteredBooks.length)} trên {filteredBooks.length} sách
                    </span>
                    <button
                        className="pagination-button"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages - 1}
                    >
                        <FaCaretRight />
                    </button>
                </div>
            </div>

            {/* Cart Section */}
            <div className="cart-section">
                <h2>Giỏ hàng</h2>
                <div className="cart-summary">
                    <span>Tổng số sách đã chọn: {cart.reduce((sum, item) => sum + item.soLuongMua, 0)}</span>
                    <span>Tổng số tiền: {cart.reduce((sum, item) => sum + item.soLuongMua * item.donGia, 0).toLocaleString()}đ</span>
                </div>
                <table className="cart-table">
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
                                    <div className="quantity-wrapper">
                                        <button
                                            className="quantity-button"
                                            onClick={() => handleDecrease(item.maSach)}
                                            disabled={item.soLuongMua <= 1} // Disable if quantity is less than or equal to 1
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            className="quantity-input"
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
                                            className="quantity-button"
                                            onClick={() => handleIncrease(item.maSach)}
                                            disabled={item.soLuongMua >= item.soLuongTon} // Disable if quantity reaches maximum stock
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td>{(item.soLuongMua * item.donGia).toLocaleString()}đ</td>
                                <td>
                                    <button className="icon-button" onClick={() => handleRemove(item.maSach)}><IoTrashBin /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button
                    className="next-button"
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
                <div className="invoice-section" ref={invoiceRef}>
                    <div className="header">
                        THÔNG TIN NHÂN VIÊN VÀ KHÁCH HÀNG
                    </div>
                    <div className="details">
                        <div className="left">
                            <div className="input-group">
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
                        <div className="right">
                            <div className="input-group">
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
                    <div className="actions">
                        <button type="button" className="finalize-button" onClick={handleCustomerInfoSubmit}>
                            Hoàn tất hóa đơn
                        </button>
                    </div>
                </div>
            )}

            {finalInvoice && (
                <div className="final-invoice-section" ref={finalInvoiceRef}>
                    {/* Div 1: Header */}
                    <div className="header">
                        <h2 style={{ textAlign: 'center', textTransform: 'uppercase' }}>HÓA ĐƠN MUA SÁCH</h2>
                    </div>

                    {/* Div 2: Employee and Customer Info */}
                    <div className="info-section" style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', lineHeight: '2' }}>
                        <div className="left-info" style={{ flex: 1 }}>
                            <p><strong>Ngày lập hóa đơn:</strong> {new Date().toLocaleDateString()}</p>
                            <p><strong>Mã hóa đơn:</strong> HD{Math.floor(Math.random() * 100000)}</p>
                            <p><strong>Mã nhân viên:</strong> {employeeInfo.id}</p>
                            <p><strong>Tên nhân viên:</strong> {employeeInfo.name}</p>
                        </div>
                        <div className="right-info" style={{ flex: 1}}>
                            <p><strong>Mã khách hàng:</strong> {customerInfo.id}</p>
                            <p><strong>Tên khách hàng:</strong> {customerInfo.name}</p>
                            <p><strong>Số điện thoại:</strong> {customerInfo.phone}</p>
                            <p><strong>Email:</strong> {customerInfo.email}</p>
                        </div>
                    </div>

                    {/* Div 3: Purchased Books List */}
                    <div className="books-list">
                        <table className="invoice-table">
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
                    <div className="totals" style={{ marginTop: '2rem', textAlign: 'right' }}>
                        <p><strong>Tổng tiền sách:</strong> {totalPrice.toLocaleString()}đ</p>
                        <p><strong>Tổng số tiền nợ sau hóa đơn:</strong> {(customerInfo.debt + totalPrice).toLocaleString()}đ</p>
                    </div>

                    {/* Div 5: Save Invoice Button */}
                    <div className="actions">
                        <button
                            type="button"
                            className="finalize-button"
                            style={{ backgroundColor: '#007bff', margin: '0 auto', display: 'block', color: 'white', marginBottom: '1rem', marginTop: '2rem' }} // Dark pink background
                            onClick={() => alert('Hóa đơn đã được lưu!')}
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