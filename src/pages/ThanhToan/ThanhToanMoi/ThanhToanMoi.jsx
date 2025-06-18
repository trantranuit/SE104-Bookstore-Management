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
    const [invoices, setInvoices] = useState([]);
    const [cart, setCart] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
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
    const [savedInvoiceId, setSavedInvoiceId] = useState(null);
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
    const [showPaymentErrorModal, setShowPaymentErrorModal] = useState(false);
    const [showConfirmSaveModal, setShowConfirmSaveModal] = useState(false);
    const [ngayLap, setNgayLap] = useState(() => {
        const today = new Date();
        today.setHours(today.getHours() + 7);
        const day = today.getDate().toString().padStart(2, '0');
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const year = today.getFullYear();
        return `${day}/${month}/${year}`;
    });
    const [pdfUrl, setPdfUrl] = useState(null);
    const [showPdfModal, setShowPdfModal] = useState(false);

    const formatNumber = (value) => {
        if (!value) return '';
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const parseNumber = (value) => value.replace(/\./g, '');

    const calculatePrice = (sach, ctNhapSachList, thamSo) => {
        const ctNhapSach = [...ctNhapSachList]
            .filter(ct => ct.MaSach === sach.MaSach)
            .sort((a, b) => b.MaPhieuNhap.localeCompare(a.MaPhieuNhap))[0];
        const giaNhap = ctNhapSach ? parseFloat(ctNhapSach.GiaNhap) : 0;
        return thamSo ? Math.round(giaNhap * parseFloat(thamSo.TiLe)) : 0;
    };

    const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    };

    const handleNgayLapChange = (e) => {
        const selectedDate = new Date(e.target.value + 'T00:00:00+07:00');
        if (!isNaN(selectedDate.getTime())) {
            const day = selectedDate.getDate().toString().padStart(2, '0');
            const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
            const year = selectedDate.getFullYear();
            setNgayLap(`${day}/${month}/${year}`);
        }
    };

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
                const thamSo = thamSoList[0];
                const booksData = sachList.map(sach => {
                    const dauSach = dauSachList.find(ds => ds.MaDauSach === sach.MaDauSach);
                    return {
                        maSach: sach.MaSach,
                        tenSach: sach.TenDauSach,
                        tacGia: dauSach && Array.isArray(dauSach.TenTacGia) ? dauSach.TenTacGia.join(', ') : '',
                        nhaXuatBan: sach.TenNXB,
                        namXuatBan: sach.NamXB,
                        soLuongTon: sach.SLTon,
                        donGia: calculatePrice(sach, ctNhapSachList, thamSo),
                        maDauSach: sach.MaDauSach
                    };
                });
                setBooks(booksData);
                setCart(prevCart => prevCart.filter(item => booksData.some(b => b.maSach === item.maSach)));
                if (!invoice) {
                    setCustomerInfo({ id: '', name: '', phone: '', email: '', debt: 0 });
                    setEmployeeInfo({ id: '', name: '' });
                    setShowInvoice(false);
                    setFinalInvoice(false);
                    setNewInvoiceId(null);
                    setTienKhachTra('');
                }
            } catch (error) {
                console.error('Error fetching books:', error);
                setBooks([]);
            }
        };
        fetchBooks();
    }, [showSaveNotification, invoice]);

    useEffect(() => {
        const generateNewInvoiceId = async () => {
            if (finalInvoice && !invoice) {
                try {
                    const invoices = await thanhToanMoiApi.getAllHoaDon();
                    let maxId = 0;
                    if (invoices.data && invoices.data.length > 0) {
                        maxId = Math.max(...invoices.data.map(inv => {
                            const matches = inv.MaHD.match(/HD(\d+)/);
                            return matches ? parseInt(matches[1]) : 0;
                        }));
                    }
                    const newId = (maxId + 1).toString().padStart(3, '0');
                    setNewInvoiceId(`HD${newId}`);
                } catch {
                    setNewInvoiceId('HD001');
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
            setNewInvoiceId(invoice.MaHD);
            setShowInvoice(true);
            setFinalInvoice(true);
            if (invoice.NgayLap) {
                const dateParts = invoice.NgayLap.includes('-') ? invoice.NgayLap.split('-') : invoice.NgayLap.split('/');
                if (dateParts.length === 3) {
                    const [year, month, day] = invoice.NgayLap.includes('-') ? [dateParts[0], dateParts[1], dateParts[2]] : [dateParts[2], dateParts[1], dateParts[0]];
                    setNgayLap(`${day}/${month}/${year}`);
                } else {
                    setNgayLap(invoice.NgayLap);
                }
            }
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
            const today = new Date();
            today.setHours(today.getHours() + 7);
            const day = today.getDate().toString().padStart(2, '0');
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const year = today.getFullYear();
            setNgayLap(`${day}/${month}/${year}`);
        }
    }, [invoice]);

    const handleAddToCart = async (book) => {
        try {
            const thamSoList = await thanhToanMoiApi.getAllThamSo();
            const thamSo = thamSoList[0];
            const bookExists = books.find(b => b.maSach === book.maSach);
            if (!bookExists) {
                alert(`Sách ${book.tenSach} (Mã: ${book.maSach}) không tồn tại trong danh sách!`);
                return;
            }
            if (!book.maSach.match(/^S\d{3}$/)) {
                alert(`Mã sách ${book.maSach} không đúng định dạng Sxxx!`);
                return;
            }
            const existing = cart.find(item => item.maSach === book.maSach);
            if (existing) {
                if (existing.soLuongMua >= book.soLuongTon) {
                    setShowNotification(true);
                    return;
                }
                if (thamSo.SLBanTT && existing.soLuongMua + 1 < thamSo.SLBanTT) {
                    alert(`Số lượng mua tối thiểu là ${thamSo.SLBanTT} sách!`);
                    return;
                }
                setCart(cart.map(item =>
                    item.maSach === book.maSach
                        ? { ...item, soLuongMua: item.soLuongMua + 1 }
                        : item
                ));
            } else {
                if (book.soLuongTon <= 0) {
                    setShowNotification(true);
                    return;
                }
                if (thamSo.SLBanTT && 1 < thamSo.SLBanTT) {
                    alert(`Số lượng mua tối thiểu là ${thamSo.SLBanTT} sách!`);
                    return;
                }
                setCart([...cart, { ...book, soLuongMua: 1 }]);
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra thông số:', error);
            alert('Lỗi khi kiểm tra thông số mua sách!');
        }
    };

    const handleIncrease = async (maSach) => {
        try {
            const thamSoList = await thanhToanMoiApi.getAllThamSo();
            const thamSo = thamSoList[0];
            const item = cart.find(item => item.maSach === maSach);
            if (item.soLuongMua >= item.soLuongTon) {
                setShowNotification(true);
                return;
            }
            if (thamSo.SLBanTT && item.soLuongMua + 1 < thamSo.SLBanTT) {
                alert(`Số lượng mua tối thiểu là ${thamSo.SLBanTT} sách!`);
                return;
            }
            setCart(cart.map(item =>
                item.maSach === maSach
                    ? { ...item, soLuongMua: item.soLuongMua + 1 }
                    : item
            ));
        } catch (error) {
            console.error('Error checking parameters:', error);
            alert('Lỗi khi kiểm tra thông số mua sách!');
        }
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
        : books.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage);

    useEffect(() => {
        const totalItems = searchTerm ? filteredBooks.length : books.length;
        const pages = Math.ceil(totalItems / booksPerPage);
        setTotalPages(pages);
        // Bỏ điều kiện kiểm tra currentPage > pages
    }, [searchTerm, filteredBooks.length, books.length]);

    const startIndex = (currentPage - 1) * booksPerPage + 1;
    const endIndex = Math.min((currentPage - 1) * booksPerPage + booksPerPage, (searchTerm ? filteredBooks : books).length);
    const totalItems = (searchTerm ? filteredBooks : books).length;

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const totalQuantity = cart.reduce((sum, item) => sum + item.soLuongMua, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.soLuongMua * item.donGia, 0);

    const handleCustomerIdChange = async (e) => {
        const input = e.target.value.toUpperCase();
        setCustomerInfo({ ...customerInfo, id: input });

        if (!input) {
            setCustomerInfo({ id: '', name: '', phone: '', email: '', debt: 0 });
            if (finalInvoice) {
                setFinalInvoice(false);
            }
            return;
        }

        try {
            const customer = await thanhToanMoiApi.getCustomerById(input.replace(/^KH/, ''));
            const updatedCustomerInfo = {
                id: input,
                name: customer.HoTen,
                phone: customer.DienThoai,
                email: customer.Email,
                debt: customer.SoTienNo,
            };
            setCustomerInfo(updatedCustomerInfo);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin khách hàng:', error);
            setCustomerInfo({ id: input, name: '', phone: '', email: '', debt: 0 });
            if (finalInvoice) {
                setFinalInvoice(false);
            }
        }
    };

    const handleEmployeeIdChange = async (e) => {
        const input = e.target.value.toUpperCase();
        setEmployeeInfo({ ...employeeInfo, id: input });

        if (!input) {
            setEmployeeInfo({ id: '', name: '' });
            return;
        }

        try {
            const employee = await thanhToanMoiApi.getUserById(input.replace(/^NV/, ''));
            setEmployeeInfo({
                id: input,
                name: `${employee.last_name} ${employee.first_name}`,
            });
        } catch {
            setEmployeeInfo({ id: input, name: '' });
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
            const thamSoList = await thanhToanMoiApi.getAllThamSo();
            const thamSo = thamSoList[0];
            if (!thamSo) {
                console.error('Không tìm thấy tham số NoTD');
                alert('Lỗi hệ thống: Không tìm thấy tham số nợ tối đa.');
                return;
            }

            if (customerInfo.debt >= thamSo.NoTD) {
                setShowDebtNotification(true);
                return;
            }

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
        try {
            if (!tienKhachTra) {
                setShowPaymentErrorModal(true);
                setTienKhachTraError(true);
                setTienKhachTraErrorMsg('Vui lòng nhập số tiền khách trả!');
                return;
            }

            if (!employeeInfo.id || !employeeInfo.name) {
                setShowEmployeeNotification(true);
                return;
            }
            if (!customerInfo.id || !customerInfo.name || !customerInfo.phone || !customerInfo.email) {
                setShowCustomerNotification(true);
                return;
            }
            if (cart.length === 0) {
                alert('Giỏ hàng đang trống!');
                return;
            }
            const totalAmount = cart.reduce((sum, item) => sum + item.soLuongMua * item.donGia, 0);
            const amountPaid = parseInt(parseNumber(tienKhachTra) || '0');
            if (amountPaid < 0) {
                setTienKhachTraError(true);
                setTienKhachTraErrorMsg('Số tiền khách trả không hợp lệ!');
                return;
            }
            if (amountPaid > totalAmount) {
                setTienKhachTra(totalAmount.toString());
                setTienKhachTraError(false);
                setTienKhachTraErrorMsg('');
                return;
            }

            const thamSoList = await thanhToanMoiApi.getAllThamSo();
            const thamSo = thamSoList[0];
            if (!thamSo) {
                console.error('Không tìm thấy tham số');
                alert('Lỗi hệ thống: Không tìm thấy tham số.');
                return;
            }

            if (customerInfo.debt > thamSo.NoTD) {
                setShowDebtNotification(true);
                return;
            }

            for (const item of cart) {
                if (thamSo.SLBanTT && item.soLuongMua < thamSo.SLBanTT) {
                    alert(`Số lượng mua tối thiểu cho sách ${item.tenSach} là ${thamSo.SLBanTT}!`);
                    return;
                }
                if (!item.maSach.match(/^S\d{3}$/)) {
                    alert(`Mã sách ${item.maSach} không đúng định dạng Sxxx!`);
                    return;
                }
                const bookInList = books.find(b => b.maSach === item.maSach);
                if (!bookInList) {
                    alert(`Sách ${item.tenSach} (Mã: ${item.maSach}) không tồn tại trong danh sách sách!`);
                    return;
                }
                try {
                    const book = await thanhToanMoiApi.getBookById(item.maSach.replace(/^S/, ''));
                    if (!book) {
                        alert(`Sách ${item.tenSach} (Mã: ${item.maSach}) không tồn tại!`);
                        return;
                    }
                    if (book.SLTon < item.soLuongMua) {
                        alert(`Sách ${item.tenSach} không đủ số lượng tồn (còn: ${book.SLTon})!`);
                        return;
                    }
                } catch (error) {
                    console.error(`Lỗi khi kiểm tra sách ${item.maSach}:`, error);
                    alert(`Không tìm thấy sách ${item.tenSach} (Mã: ${item.maSach})!`);
                    return;
                }
            }

            // Hiển thị modal xác nhận
            setShowConfirmSaveModal(true);
        } catch (err) {
            console.error('Lỗi khi kiểm tra dữ liệu hóa đơn:', err);
            alert('Không thể kiểm tra dữ liệu hóa đơn. Vui lòng thử lại.');
        }
    };

    const handlePrintInvoice = async () => {
        if (!savedInvoiceId) return;

        try {
            const invoiceId = savedInvoiceId.replace('HD', '');
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

    // Add modal close handler
    const handleCloseModal = (e) => {
        if (e.target.classList.contains('pdf-modal-overlay')) {
            setShowPdfModal(false);
            setPdfUrl(null);
        }
    };

    const confirmSaveInvoice = async () => {
        try {
            const totalAmount = cart.reduce((sum, item) => sum + item.soLuongMua * item.donGia, 0);
            const amountPaid = parseInt(parseNumber(tienKhachTra) || '0');
            const remaining = totalAmount - amountPaid;
            const formattedCustomerId = customerInfo.id.replace(/^KH/, '');
            const formattedEmployeeId = employeeInfo.id.replace(/^NV/, '');

            if (!formattedCustomerId) {
                setShowCustomerNotification(true);
                setShowConfirmSaveModal(false);
                return;
            }
            if (!formattedEmployeeId) {
                setShowEmployeeNotification(true);
                setShowConfirmSaveModal(false);
                return;
            }

            try {
                const customer = await thanhToanMoiApi.getCustomerById(formattedCustomerId);
                if (!customer) {
                    alert('Khách hàng không tồn tại!');
                    setShowConfirmSaveModal(false);
                    return;
                }
            } catch (error) {
                console.error(`Lỗi khi kiểm tra khách hàng ${formattedCustomerId}:`, error);
                alert('Không tìm thấy khách hàng!');
                setShowConfirmSaveModal(false);
                return;
            }

            try {
                const employee = await thanhToanMoiApi.getUserById(formattedEmployeeId);
                if (!employee) {
                    alert('Nhân viên không tồn tại!');
                    setShowConfirmSaveModal(false);
                    return;
                }
            } catch (error) {
                console.error(`Lỗi khi kiểm tra nhân viên ${formattedEmployeeId}:`, error);
                alert('Không tìm thấy nhân viên!');
                setShowConfirmSaveModal(false);
                return;
            }

            const invoiceData = {
                MaKH_input: formattedCustomerId,
                NgayLap: ngayLap,
                NguoiLapHD_input: formattedEmployeeId,
                SoTienTra: amountPaid.toString(),
                TongTien: totalAmount.toString(),
                ConLai: remaining.toString()
            };

            const invoiceResponse = await thanhToanMoiApi.createInvoice(invoiceData);
            if (!invoiceResponse || !invoiceResponse.MaHD) {
                throw new Error('Phản hồi hóa đơn không hợp lệ');
            }
            const newInvoiceId = invoiceResponse.MaHD;
            setSavedInvoiceId(newInvoiceId); // Lưu ID hóa đơn mới

            for (const item of cart) {
                const ctHoaDon = {
                    MaHD_input: newInvoiceId.replace(/^HD/, ''),
                    MaSach_input: item.maSach.replace(/^S/, ''),
                    SLBan: item.soLuongMua,
                    GiaBan: item.donGia,
                    ThanhTien: item.soLuongMua * item.donGia
                };

                try {
                    await thanhToanMoiApi.createCTHoaDon(ctHoaDon);
                } catch (error) {
                    console.error(`Lỗi khi lưu chi tiết hóa đơn cho sách ${item.maSach}:`, error.response?.data);
                    alert(`Không thể lưu chi tiết hóa đơn cho sách ${item.tenSach}!`);
                    setShowConfirmSaveModal(false);
                    return;
                }

                try {
                    const newStock = Math.max(0, item.soLuongTon - item.soLuongMua);
                    await thanhToanMoiApi.updateBookStock(item.maSach.replace(/^S/, ''), newStock);
                } catch (error) {
                    console.error(`Lỗi khi cập nhật tồn kho cho sách ${item.maSach}:`, error);
                    alert(`Không thể cập nhật tồn kho cho sách ${item.tenSach}!`);
                    setShowConfirmSaveModal(false);
                    return;
                }
            }

            try {
                const newDebt = customerInfo.debt + remaining;
                await thanhToanMoiApi.updateCustomerDebt(formattedCustomerId, newDebt);
            } catch (error) {
                console.error(`Lỗi khi cập nhật nợ khách hàng ${formattedCustomerId}:`, error);
                alert('Không thể cập nhật nợ khách hàng!');
                setShowConfirmSaveModal(false);
                return;
            }

            setShowConfirmSaveModal(false);
            setShowSaveNotification(true);
            setTienKhachTra('');
            setTienKhachTraError(false);
            setTienKhachTraErrorMsg('');
            setCart([]);
            setCustomerInfo({ id: '', name: '', phone: '', email: '', debt: 0 });
            setEmployeeInfo({ id: '', name: '' });
            setShowInvoice(false);
            setFinalInvoice(false);
            setNewInvoiceId(null);
        } catch (err) {
            console.error('Lỗi tổng quát khi lưu hóa đơn:', err);
            let errorMessage = 'Không thể tạo hóa đơn. Vui lòng kiểm tra lại thông tin và thử lại.';
            if (err.response?.data) {
                errorMessage = `Lỗi: ${JSON.stringify(err.response.data)}`;
            }
            alert(errorMessage);
            setShowConfirmSaveModal(false);
        }
    };

    const handleCloseNotification = () => {
        setShowSaveNotification(false);
        navigate('/thanhtoan/moi', { state: null });
    };

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const result = await thanhToanMoiApi.getAllHoaDon();
                setInvoices(result.data);
                setTotalPages(Math.ceil(result.count / 10));
            } catch (error) {
                console.error('Error fetching invoices:', error);
            }
        };
        fetchInvoices();
    }, [currentPage]);

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
                                className="print-button-ttm"
                                onClick={handlePrintInvoice}
                                style={{ marginRight: '10px' }}
                            >
                                In hóa đơn
                            </button>
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
                        <p>Vui lòng nhập đầy đủ thông tin nhân viên!</p>
                        <button className="close-button-ttm" onClick={() => setShowEmployeeNotification(false)}>Đóng</button>
                    </div>
                </div>
            )}

            {showCustomerNotification && (
                <div className="notification-modal-ttm">
                    <div className="notification-content-ttm">
                        <p>Vui lòng nhập đầy đủ thông tin khách hàng!</p>
                        <button className="close-button-ttm" onClick={() => setShowCustomerNotification(false)}>Đóng</button>
                    </div>
                </div>
            )}

            {showDebtNotification && (
                <div className="notification-modal-ttm">
                    <div className="notification-content-ttm">
                        <p>Số tiền nợ vượt quá mức cho phép mua sách.</p>
                        <button className="close-button-ttm" onClick={() => setShowDebtNotification(false)}>Đóng</button>
                    </div>
                </div>
            )}

            {showPaymentErrorModal && (
                <div className="notification-modal-ttm">
                    <div className="notification-content-ttm">
                        <p>{tienKhachTraErrorMsg || 'Số tiền khách trả không được vượt quá tổng tiền sách!'}</p>
                        <button
                            className="close-button-ttm"
                            onClick={() => {
                                setShowPaymentErrorModal(false);
                                setTienKhachTraError(false);
                                setTienKhachTraErrorMsg('');
                            }}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {showConfirmSaveModal && (
                <div className="notification-modal-ttm">
                    <div className="notification-content-ttm noti-sua-ttm">
                        <p>Bạn có chắc muốn lưu hóa đơn không?</p>
                        <div className="notification-actions-ttm">
                            <button
                                className="finalize-button-ttm"
                                onClick={confirmSaveInvoice}
                            >
                                Có
                            </button>
                            <button
                                className="finalize-button-ttm close-button-ttm-hoi"
                                onClick={() => setShowConfirmSaveModal(false)}
                            >
                                Không
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPdfModal && pdfUrl && (
                <div className="notification-modal-ttm">
                    <div className="notification-content-ttm" style={{ width: '80vw', height: '90vh', padding: 0 }}>
                        <iframe
                            src={pdfUrl}
                            title="Invoice PDF"
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                        />
                        <div style={{ textAlign: 'right', padding: 8 }}>
                            <button
                                className="close-button-ttm"
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
                            <th>No.</th>
                            <th>Mã sách</th>
                            <th>Tên sách</th>
                            <th>Tác giả</th>
                            <th>Nhà xuất bản</th>
                            <th>Năm xuất bản</th>
                            <th>Đơn giá</th>
                            <th>Tồn</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="book-table-wrapper-ttm">
                        {displayedBooks.map((book, index) => (
                            <tr key={book.maSach}>
                                <td>{(currentPage - 1) * booksPerPage + index + 1}</td>
                                <td>{book.maSach}</td>
                                <td>{book.tenSach}</td>
                                <td>{book.tacGia}</td>
                                <td>{book.nhaXuatBan}</td>
                                <td>{book.namXuatBan}</td>
                                <td>{formatNumber(book.donGia)} VNĐ</td>
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
                        disabled={currentPage === 1}
                    >
                        <FaCaretLeft />
                    </button>
                    <span className="pagination-info-ttm">
                        Hiển thị {startIndex} - {endIndex} trên {totalItems} sách
                    </span>
                    <button
                        className="pagination-button-ttm"
                        onClick={handleNextPage}
                        // disabled={currentPage === totalPages}
                        disabled={endIndex === totalItems || totalItems === 0}
                    >
                        <FaCaretRight />
                    </button>
                </div>
            </div>

            <div className="cart-section-ttm">
                <h2 className="cart-header-ttm">Giỏ hàng</h2>
                <div className="cart-summary-ttm">
                    <span>Tổng số sách đã chọn: {totalQuantity} quyển</span>
                    <span>Tổng số tiền: {formatNumber(totalPrice)} VNĐ</span>
                </div>
                <table className="cart-table-ttm">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Mã sách</th>
                            <th>Tên sách</th>
                            <th>Đơn giá</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item, index) => (
                            <tr key={item.maSach}>
                                <td>{index + 1}</td>
                                <td>{item.maSach}</td>
                                <td>{item.tenSach}</td>
                                <td>{formatNumber(item.donGia)}đ</td>
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
                                <td>{formatNumber(item.soLuongMua * item.donGia)}đ</td>
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
                                <label htmlFor="invoice-date">Ngày lập hóa đơn:</label>
                                <input
                                    id="invoice-date"
                                    type="date"
                                    value={formatDateForInput(ngayLap)}
                                    onChange={handleNgayLapChange}
                                    required
                                />
                            </div>
                            <div className="input-group-ttm">
                                <label htmlFor="employee-id">Mã nhân viên:</label>
                                <input
                                    id="employee-id"
                                    type="text"
                                    placeholder="Nhập mã nhân viên (NVxxx)"
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
                                    placeholder="Nhập mã khách hàng (KHxxx)"
                                    value={customerInfo.id}
                                    onChange={handleCustomerIdChange}
                                    required
                                />
                            </div>
                            <p><strong>Họ và tên khách hàng:</strong> {customerInfo.name}</p>
                            <p><strong>Số điện thoại:</strong> {customerInfo.phone}</p>
                            <p><strong>Email:</strong> {customerInfo.email}</p>
                            <p><strong>Số tiền nợ:</strong> {formatNumber(customerInfo.debt)} VNĐ</p>
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
                            <p><strong>Ngày lập hóa đơn:</strong> {ngayLap}</p>
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
                                    <th>No.</th>
                                    <th>Mã sách</th>
                                    <th>Tên sách</th>
                                    <th>Đơn giá</th>
                                    <th>Số lượng</th>
                                    <th>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, index) => (
                                    <tr key={item.maSach}>
                                        <td>{index + 1}</td>
                                        <td>{item.maSach}</td>
                                        <td>{item.tenSach}</td>
                                        <td>{formatNumber(item.donGia)}đ</td>
                                        <td>{item.soLuongMua}</td>
                                        <td>{formatNumber(item.soLuongMua * item.donGia)}VNĐ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="totals-ttm" style={{ marginTop: '2rem', textAlign: 'right' }}>
                        <p><strong>Tổng số sách:</strong> {totalQuantity} quyển</p>
                        <p><strong>Tổng tiền sách:</strong> {formatNumber(totalPrice)} VNĐ</p>
                        <p>
                            <strong>Tiền khách trả:</strong>
                            <input
                                type="text"
                                style={{
                                    marginLeft: '1rem',
                                    width: '9rem',
                                    padding: '0.3rem 0.5rem',
                                    fontSize: '1rem',
                                    border: '0.1% solid #ccc',
                                    borderRadius: '5%',
                                    textAlign: 'right'
                                }}
                                value={formatNumber(tienKhachTra)}
                                onChange={e => {
                                    const raw = e.target.value.replace(/[^0-9]/g, '');
                                    if (!raw) {
                                        setTienKhachTraError(true);
                                        setTienKhachTraErrorMsg('Vui lòng nhập số tiền khách trả!');
                                    } else if (parseInt(raw) > totalPrice) {
                                        setTienKhachTra(totalPrice.toString());
                                        setTienKhachTraError(false);
                                        setTienKhachTraErrorMsg('');
                                    } else {
                                        setTienKhachTraError(false);
                                        setTienKhachTraErrorMsg('');
                                        setTienKhachTra(raw);
                                    }
                                }}
                                placeholder="Nhập số tiền trả"
                                inputMode="numeric"
                            />  VNĐ
                        </p>
                        <p>
                            <strong>Còn lại:</strong>{' '}
                            {formatNumber(Math.max(0, totalPrice - parseInt(parseNumber(tienKhachTra) || '0')))} VNĐ
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