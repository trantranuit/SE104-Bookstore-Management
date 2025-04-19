import React, { useState, useRef } from 'react';
import { FaCartPlus } from "react-icons/fa6";
import { IoTrashBin } from "react-icons/io5";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import bookData from './ThanhToanMoiData';
import customerData from './CustomerData'; // Mock customer data
import '../../../styles/PathStyles.css';
import './ThanhToanMoi.css';

function ThanhToanMoi() {
    const [searchTerm, setSearchTerm] = useState('');
    const [books] = useState(bookData);
    const [cart, setCart] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const booksPerPage = 5;
    const [showInvoice, setShowInvoice] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({ id: '', name: '', phone: '', email: '', debt: 0 });
    const [finalInvoice, setFinalInvoice] = useState(false);
    const invoiceRef = useRef(null);
    const finalInvoiceRef = useRef(null);

    const handleAddToCart = (book) => {
        const existing = cart.find(item => item.maSach === book.maSach);
        if (existing) {
            setCart(cart.map(item =>
                item.maSach === book.maSach
                    ? { ...item, soLuongMua: item.soLuongMua + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...book, soLuongMua: 1 }]);
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
        book.tenSach.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    const displayedBooks = filteredBooks.slice(
        currentPage * booksPerPage,
        (currentPage + 1) * booksPerPage
    );

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

    const handleCustomerInfoSubmit = (e) => {
        e.preventDefault();
        setFinalInvoice(true); // Show the final invoice
        setTimeout(() => {
            finalInvoiceRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to the final invoice
        }, 100);
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Tạo Hóa Đơn Mua Sách</h1>

            {/* Book Search Section */}
            <div className="book-search-section">
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
                                            disabled={item.soLuongMua <= 1}
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
                                            disabled={item.soLuongMua >= item.soLuongTon}
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
                <div className="summary-bar">
                    <span>Tổng số sách: {totalQuantity}</span>
                    <span>Tổng tiền: {totalPrice.toLocaleString()}đ</span>
                </div>
                <button className="next-button" onClick={handleThanhToan}>Thanh toán</button>
            </div>

            {showInvoice && (
                <div className="invoice-section" ref={invoiceRef}>
                    <h2>Hóa Đơn</h2>
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
                    <div className="summary-bar">
                        <span>Tổng số sách: {totalQuantity}</span>
                        <span>Tổng tiền: {totalPrice.toLocaleString()}đ</span>
                    </div>
                    <div className="customer-info">
                        <h3>Thông tin khách hàng</h3>
                        <form onSubmit={handleCustomerInfoSubmit}>
                            <label>
                                Mã khách hàng:
                                <input
                                    type="text"
                                    name="customerId"
                                    value={customerInfo.id}
                                    onChange={handleCustomerIdChange}
                                    required
                                />
                            </label>
                            <p><strong>Họ và tên:</strong> {customerInfo.name}</p>
                            <p><strong>Số điện thoại:</strong> {customerInfo.phone}</p>
                            <p><strong>Email:</strong> {customerInfo.email}</p>
                            <p><strong>Số tiền nợ:</strong> {customerInfo.debt.toLocaleString()}đ</p>
                            <button type="submit" className="finalize-button">Hoàn tất hóa đơn</button>
                        </form>
                    </div>
                </div>
            )}

            {finalInvoice && (
                <div className="final-invoice-section" ref={finalInvoiceRef}>
                    <h2>Hóa Đơn Hoàn Tất</h2>
                    <div className="customer-details">
                        <p><strong>Họ và tên:</strong> {customerInfo.name}</p>
                        <p><strong>Số điện thoại:</strong> {customerInfo.phone}</p>
                        <p><strong>Email:</strong> {customerInfo.email}</p>
                        <p><strong>Số tiền nợ:</strong> {customerInfo.debt.toLocaleString()}đ</p>
                    </div>
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
            )}
        </div>
    );
}

export default ThanhToanMoi;