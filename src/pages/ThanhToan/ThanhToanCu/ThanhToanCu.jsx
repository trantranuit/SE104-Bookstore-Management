import React, { useState, useEffect } from 'react';
import '../../../styles/PathStyles.css';
import { khachHangData, nhanVienData, danhSachPhieuThu } from './ThanhToanCuData';
import './ThanhToanCu.css';

function ThanhToanCu() {
    const [maKhachHang, setMaKhachHang] = useState('');
    const [tienKhachTra, setTienKhachTra] = useState('');
    const [maNhanVien, setMaNhanVien] = useState('');
    const [ngayLap, setNgayLap] = useState('');
    const [highlightMaKH, setHighlightMaKH] = useState(true);
    const [highlightTien, setHighlightTien] = useState(true);
    const [highlightMaNV, setHighlightMaNV] = useState(true);
    const [isFocused, setIsFocused] = useState({ tien: false });
    const [maPhieuThu, setMaPhieuThu] = useState('');

    const customerInfo = khachHangData[maKhachHang];
    const nguoiLapPhieu = nhanVienData[maNhanVien];

    useEffect(() => {
        const getNewMaPhieu = () => {
            if (danhSachPhieuThu.length === 0) return 'PT000001';
            const lastMaPhieu = danhSachPhieuThu[danhSachPhieuThu.length - 1].maPhieuThu;
            const numberPart = parseInt(lastMaPhieu.slice(2)) + 1;
            return 'PT' + numberPart.toString().padStart(6, '0');
        };
        setMaPhieuThu(getNewMaPhieu());
    }, []);

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

    const parseNumber = (str) => Number(str.replace(/\./g, ''));

    const tienNo = customerInfo ? parseNumber(customerInfo.tienNo) : '';
    const tienConLai = tienNo && tienKhachTra ? tienNo - parseInt(tienKhachTra) : '';

    const getInputClass = (value, highlight) => {
        return `input-ma custom-input ${highlight && value.trim() === '' ? 'highlight' : ''}`;
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Phiếu Thu Tiền</h1>
            <div className="content-wrapper">
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
                            <span className="value">{nguoiLapPhieu || ''}</span>
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
                            <span className="value">{customerInfo?.tenKhachHang || ''}</span>
                        </div>
                        <div className="line">
                            <span className="label-name">Số điện thoại</span>
                            <span className="colon">:</span>
                            <span className="value">{customerInfo?.soDienThoai || ''}</span>
                        </div>
                        <div className="line">
                            <span className="label-name">Địa chỉ email</span>
                            <span className="colon">:</span>
                            <span className="value">{customerInfo?.diaChiEmail || ''}</span>
                        </div>
                    </div>
                </div>

                <div className="thanhtoan financial-info">
                    <div className="line">
                        <span className="label-name">Số tiền khách nợ</span>
                        <span className="colon">:</span>
                        <span className="value">
                            {tienNo ? tienNo.toLocaleString() + ' VNĐ' : ''}
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
                            {tienConLai >= 0 ? tienConLai.toLocaleString() + ' VNĐ' : ''}
                        </span>
                    </div>
                </div>
                <button
                    className="btn-thanh-toan"
                    onClick={() => {
                        const userChoice = window.confirm(
                            "Bạn muốn làm gì tiếp theo?\nNhấn OK để về trang chủ, Cancel để tạo phiếu thanh toán mới."
                        );
                        if (userChoice) {
                            // Điều hướng về trang chủ
                            window.location.href = "/"; // Thay "/" bằng đường dẫn trang chủ của bạn
                        } else {
                            // Tạo phiếu thanh toán mới
                            setMaKhachHang('');
                            setTienKhachTra('');
                            setMaNhanVien('');
                            setNgayLap('');
                            setHighlightMaKH(true);
                            setHighlightTien(true);
                            setHighlightMaNV(true);
                            setIsFocused({ tien: false });
                            alert("Đã tạo phiếu thanh toán mới!");
                        }
                    }}
                >
                    Thanh toán
                </button>
            </div>
        </div>
    );
}

export default ThanhToanCu;
