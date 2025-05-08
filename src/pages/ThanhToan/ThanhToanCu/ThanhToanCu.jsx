import React, { useState, useEffect } from 'react';
import '../../../styles/PathStyles.css';
import employeeData from '../ThanhToanMoi/EmployeeData'; // Use employee data from ThanhToan folder
import customerData from '../ThanhToanMoi/CustomerData'; // Use customer data from ThanhToan folder
import './ThanhToanCu.css';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation

function ThanhToanCu() {
    const navigate = useNavigate();
    const location = useLocation(); // Access passed state
    const receipt = location.state?.receipt; // Retrieve receipt data if available
    const isEditing = location.state?.isEditing || false; // Check if editing
    const [maKhachHang, setMaKhachHang] = useState('');
    const [tienKhachTra, setTienKhachTra] = useState('');
    const [maNhanVien, setMaNhanVien] = useState('');
    const [ngayLap, setNgayLap] = useState('');
    const [highlightMaKH, setHighlightMaKH] = useState(true);
    const [highlightTien, setHighlightTien] = useState(true);
    const [highlightMaNV, setHighlightMaNV] = useState(true);
    const [isFocused, setIsFocused] = useState({ tien: false });
    const [maPhieuThu, setMaPhieuThu] = useState('');

    const customerInfo = customerData.find(customer => customer.id === maKhachHang);
    const employeeInfo = employeeData.find(employee => employee.id === maNhanVien);

    useEffect(() => {
        if (isEditing && receipt) {
            setMaPhieuThu(receipt.maPhieuThu); // Use existing maPhieuThu when editing
            setMaKhachHang(receipt.maKhachHang || '');
            setTienKhachTra(receipt.soTienTra?.toString() || '');
            setMaNhanVien(receipt.maNhanVien || '');
            setNgayLap(receipt.ngayLap || '');
            setHighlightMaKH(false);
            setHighlightTien(false);
            setHighlightMaNV(false);
        } else {
            // Generate a new maPhieuThu for new receipts
            const getNewMaPhieu = () => {
                const existingReceipts = JSON.parse(localStorage.getItem('receipts') || '[]');
                if (existingReceipts.length === 0) return 'PT000001';
                const lastMaPhieu = existingReceipts.reduce((max, receipt) => {
                    const numberPart = parseInt(receipt.maPhieuThu.slice(2));
                    return Math.max(max, numberPart);
                }, 0);
                return 'PT' + (lastMaPhieu + 1).toString().padStart(6, '0');
            };
            setMaPhieuThu(getNewMaPhieu());
        }
    }, [isEditing, receipt]);

    const handleMaKhachHangChange = (e) => {
        const value = e.target.value;
        setMaKhachHang(value);
        setHighlightMaKH(value.trim() === '');
    };

    const handleTienKhachTraChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        setTienKhachTra(rawValue);
        setHighlightTien(rawValue.trim() === '');
    };

    const handleMaNhanVienChange = (e) => {
        const value = e.target.value;
        setMaNhanVien(value);
        setHighlightMaNV(value.trim() === '');
    };

    const handleNgayLapChange = (e) => {
        setNgayLap(e.target.value);
    };

    const handleSavePayment = () => {
        if (!maKhachHang || !tienKhachTra || !maNhanVien || !ngayLap) {
            alert('Vui lòng nhập đầy đủ thông tin trước khi lưu.');
            return;
        }

        const newPayment = {
            maPhieuThu,
            maKhachHang,
            tenKhachHang: customerInfo?.name || '',
            soDienThoai: customerInfo?.phone || '',
            diaChiEmail: customerInfo?.email || '',
            soTienNo: customerInfo?.debt || 0,
            soTienTra: parseInt(tienKhachTra),
            soTienConLai: customerInfo?.debt - parseInt(tienKhachTra),
            maNhanVien,
            nguoiLapPhieu: employeeInfo?.name || '',
            ngayLap,
        };

        const existingReceipts = JSON.parse(localStorage.getItem('receipts') || '[]');
        if (isEditing) {
            // Update the existing receipt
            const updatedReceipts = existingReceipts.map(receipt =>
                receipt.maPhieuThu === maPhieuThu ? newPayment : receipt
            );
            localStorage.setItem('receipts', JSON.stringify(updatedReceipts));
        } else {
            // Add a new receipt
            localStorage.setItem('receipts', JSON.stringify([...existingReceipts, newPayment]));
        }

        alert(isEditing ? 'Phiếu thu tiền đã được cập nhật thành công!' : 'Phiếu thu tiền đã được lưu thành công!');
        setMaKhachHang('');
        setTienKhachTra('');
        setMaNhanVien('');
        setNgayLap('');
        setHighlightMaKH(true);
        setHighlightTien(true);
        setHighlightMaNV(true);
    };

    const getInputClass = (value, highlight) => {
        return `input-ma custom-input ${highlight && value.trim() === '' ? 'highlight' : ''}`;
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Phiếu Thu Tiền</h1>
            <div className="content-wrapper">
                <div className="button-wrapper">
                    <button
                        className="invoice-list-button"
                        onClick={() => navigate('/thanhtoan/phieuthutien')}
                    >
                        Danh Sách Các Hóa Đơn
                    </button>
                </div>
                <h2 className="receipt-subtitle">PHIẾU THU TIỀN TIỆM SÁCH TRÂN TRÂN</h2>

                <div className="two-columns">
                    <div className="thanhtoan thanhtoan-left">
                        <div className="line">
                            <span className="label-name">Mã nhân viên</span>
                            <span className="colon">:</span>
                            <span className="value">
                                <input
                                    type="text"
                                    value={maNhanVien}
                                    onChange={handleMaNhanVienChange}
                                    className={getInputClass(maNhanVien, highlightMaNV)}
                                    placeholder="Nhập mã nhân viên"
                                />
                            </span>
                        </div>
                        <div className="line">
                            <span className="label-name">Người lập phiếu</span>
                            <span className="colon">:</span>
                            <span className="value">{employeeInfo?.name || ''}</span>
                        </div>
                        <div className="line">
                            <span className="label-name">Mã phiếu thu</span>
                            <span className="colon">:</span>
                            <span className="value">{maPhieuThu}</span>
                        </div>
                        <div className="line">
                            <span className="label-name">Ngày lập</span>
                            <span className="colon">:</span>
                            <span className="value">
                                <input type="date" value={ngayLap} onChange={handleNgayLapChange} className="custom-input" />
                            </span>
                        </div>
                    </div>

                    <div className="thanhtoan thanhtoan-right">
                        <div className="line">
                            <span className="label-name">Mã khách hàng</span>
                            <span className="colon">:</span>
                            <span className="value">
                                <input
                                    type="text"
                                    value={maKhachHang}
                                    onChange={handleMaKhachHangChange}
                                    className={getInputClass(maKhachHang, highlightMaKH)}
                                    placeholder="Nhập mã khách hàng"
                                />
                            </span>
                        </div>
                        <div className="line">
                            <span className="label-name">Tên khách hàng</span>
                            <span className="colon">:</span>
                            <span className="value">{customerInfo?.name || ''}</span>
                        </div>
                        <div className="line">
                            <span className="label-name">Số điện thoại</span>
                            <span className="colon">:</span>
                            <span className="value">{customerInfo?.phone || ''}</span>
                        </div>
                        <div className="line">
                            <span className="label-name">Địa chỉ email</span>
                            <span className="colon">:</span>
                            <span className="value">{customerInfo?.email || ''}</span>
                        </div>
                    </div>
                </div>

                <div className="thanhtoan financial-info">
                    <div className="line">
                        <span className="label-name">Số tiền khách nợ</span>
                        <span className="colon">:</span>
                        <span className="value">
                            {customerInfo?.debt ? customerInfo.debt.toLocaleString() + ' VNĐ' : ''}
                        </span>
                    </div>
                    <div className="line">
                        <span className="label-name">Số tiền khách trả</span>
                        <span className="colon">:</span>
                        <span className="value">
                            <div className="input-vnd-wrapper">
                                <input
                                    type="text"
                                    className={`${getInputClass(tienKhachTra, highlightTien)} ${!isFocused.tien && tienKhachTra ? 'input-as-text' : ''}`}
                                    value={
                                        isFocused.tien
                                            ? tienKhachTra
                                            : tienKhachTra
                                            ? parseInt(tienKhachTra.replace(/\D/g, '')).toLocaleString('vi-VN')
                                            : ','
                                    }
                                    onChange={handleTienKhachTraChange}
                                    onFocus={() => setIsFocused({ ...isFocused, tien: true })}
                                    onBlur={() => setIsFocused({ ...isFocused, tien: false })}
                                    placeholder="Nhập số tiền trả"
                                />
                                <span className="vnd-label">VNĐ</span>
                            </div>
                        </span>
                    </div>
                    <div className="line">
                        <span className="label-name">Còn nợ</span>
                        <span className="colon">:</span>
                        <span className="value">
                            {customerInfo?.debt && tienKhachTra
                                ? (customerInfo.debt - parseInt(tienKhachTra)).toLocaleString() + ' VNĐ'
                                : ''}
                        </span>
                    </div>
                </div>
                <div className="save-button-wrapper">
                    <button className="save-button" onClick={handleSavePayment}>
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ThanhToanCu;
