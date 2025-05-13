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
    const [isFocused, setIsFocused] = useState({ tien: false });
    const [maPhieuThu, setMaPhieuThu] = useState('');
    const [showValidationModal, setShowValidationModal] = useState(false); // State for validation modal
    const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
    const [savedReceiptId, setSavedReceiptId] = useState(''); // State for saved receipt ID

    const customerInfo = customerData.find(customer => customer.id === maKhachHang);
    const employeeInfo = employeeData.find(employee => employee.id === maNhanVien);

    // Define getNewMaPhieu function
    const getNewMaPhieu = () => {
        const existingReceipts = JSON.parse(localStorage.getItem('receipts') || '[]');
        const maxExistingId = existingReceipts.length > 0
            ? Math.max(...existingReceipts.map(receipt => parseInt(receipt.maPhieuThu.slice(2))))
            : 0; // Get the largest existing ID or default to 0
        const nextId = maxExistingId + 1; // Increment the largest ID
        return 'PT' + nextId.toString().padStart(6, '0'); // Format the new ID with leading zeros
    };

    useEffect(() => {
        if (isEditing && receipt) {
            setMaPhieuThu(receipt.maPhieuThu); // Use existing maPhieuThu when editing
            setMaKhachHang(receipt.maKhachHang || '');
            setTienKhachTra(receipt.soTienTra?.toString() || '');
            setMaNhanVien(receipt.maNhanVien || '');
            setNgayLap(receipt.ngayLap || '');
        } else {
            setMaPhieuThu(getNewMaPhieu()); // Generate a new maPhieuThu for new receipts
        }
    }, [isEditing, receipt]);

    const handleMaKhachHangChange = (e) => {
        const value = e.target.value;
        setMaKhachHang(value);
    };

    const handleTienKhachTraChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        setTienKhachTra(rawValue);
    };

    const handleMaNhanVienChange = (e) => {
        const value = e.target.value;
        setMaNhanVien(value);
    };

    const handleNgayLapChange = (e) => {
        setNgayLap(e.target.value);
    };

    const handleSavePayment = () => {
        if (!maKhachHang || !tienKhachTra || !maNhanVien || !ngayLap) {
            setShowValidationModal(true); // Show validation modal
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
            const updatedReceipts = existingReceipts.map(receipt =>
                receipt.maPhieuThu === maPhieuThu ? newPayment : receipt
            );
            localStorage.setItem('receipts', JSON.stringify(updatedReceipts));
        } else {
            localStorage.setItem('receipts', JSON.stringify([...existingReceipts, newPayment]));
        }

        // Update customer's debt in customerData and localStorage
        const updatedCustomers = customerData.map(customer => {
            if (customer.id === maKhachHang) {
                const previousDebt = customer.debt || 0;
                const newDebt = isEditing
                    ? previousDebt + (receipt?.soTienTra || 0) - parseInt(tienKhachTra) // Adjust debt for editing
                    : previousDebt - parseInt(tienKhachTra); // Subtract payment for new receipt
                return { ...customer, debt: newDebt };
            }
            return customer;
        });

        // Update customerData in memory
        customerData.splice(0, customerData.length, ...updatedCustomers);

        // Save updated customers to localStorage
        localStorage.setItem('customers', JSON.stringify(updatedCustomers));

        setSavedReceiptId(maPhieuThu); // Set the saved receipt ID
        setShowSuccessModal(true); // Show success modal

        setMaPhieuThu(getNewMaPhieu());
        setMaKhachHang('');
        setTienKhachTra('');
        setMaNhanVien('');
        setNgayLap('');
    };

    const getInputClass = () => {
        return `input-ma custom-input`;
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Phiếu Thu Tiền</h1>
            <div className="content-wrapper">
                <div className="button-wrapper-ttc">
                    <button
                        className="invoice-list-button-ttc"
                        onClick={() => navigate('/thanhtoan/phieuthutien')}
                    >
                        Danh Sách Các Phiếu Thu Tiền
                    </button>
                </div>
                <h2 className="receipt-subtitle-ttc">PHIẾU THU TIỀN TIỆM SÁCH TRÂN TRÂN</h2>

                <div className="two-columns-ttc">
                    <div className="thanhtoan-left-ttc">
                        <div className="line-ttc">
                            <span className="label-name-ttc">Mã nhân viên</span>
                            <span className="colon-ttc">:</span>
                            <span className="value-ttc">
                                <input
                                    type="text"
                                    value={maNhanVien}
                                    onChange={handleMaNhanVienChange}
                                    className={getInputClass(maNhanVien)}
                                    placeholder="Nhập mã nhân viên"
                                />
                            </span>
                        </div>
                        <div className="line-ttc">
                            <span className="label-name-ttc">Người lập phiếu</span>
                            <span className="colon-ttc">:</span>
                            <span className="value-ttc">{employeeInfo?.name || ''}</span>
                        </div>
                        <div className="line-ttc">
                            <span className="label-name-ttc">Mã phiếu thu</span>
                            <span className="colon-ttc">:</span>
                            <span className="value-ttc">{maPhieuThu}</span>
                        </div>
                        <div className="line-ttc">
                            <span className="label-name-ttc">Ngày lập</span>
                            <span className="colon-ttc">:</span>
                            <span className="value-ttc">
                                <input type="date" value={ngayLap} onChange={handleNgayLapChange} className="custom-input-ttc" />
                            </span>
                        </div>
                    </div>

                    <div className="thanhtoan-right-ttc">
                        <div className="line-ttc">
                            <span className="label-name-ttc">Mã khách hàng</span>
                            <span className="colon-ttc">:</span>
                            <span className="value-ttc">
                                <input
                                    type="text"
                                    value={maKhachHang}
                                    onChange={handleMaKhachHangChange}
                                    className={getInputClass(maKhachHang)}
                                    placeholder="Nhập mã khách hàng"
                                />
                            </span>
                        </div>
                        <div className="line-ttc">
                            <span className="label-name-ttc">Tên khách hàng</span>
                            <span className="colon-ttc">:</span>
                            <span className="value-ttc">{customerInfo?.name || ''}</span>
                        </div>
                        <div className="line-ttc">
                            <span className="label-name-ttc">Số điện thoại</span>
                            <span className="colon-ttc">:</span>
                            <span className="value-ttc">{customerInfo?.phone || ''}</span>
                        </div>
                        <div className="line-ttc">
                            <span className="label-name-ttc">Địa chỉ email</span>
                            <span className="colon-ttc">:</span>
                            <span className="value-ttc">{customerInfo?.email || ''}</span>
                        </div>
                    </div>
                </div>

                <div className="thanhtoan financial-info-ttc">
                    <div className="line-ttc">
                        <span className="label-name-ttc">Số tiền khách nợ</span>
                        <span className="colon-ttc">:</span>
                        <span className="value-ttc">
                            {customerInfo?.debt ? customerInfo.debt.toLocaleString() + ' VNĐ' : ''}
                        </span>
                    </div>
                    <div className="line-ttc">
                        <span className="label-name-ttc">Số tiền khách trả</span>
                        <span className="colon-ttc">:</span>
                        <span className="value-ttc">
                            <div className="input-vnd-wrapper-ttc">
                                <input
                                    type="text"
                                    className={`${getInputClass(tienKhachTra)} ${!isFocused.tien && tienKhachTra ? 'input-as-text-ttc' : ''}`}
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
                                <span className="vnd-label-ttc">VNĐ</span>
                            </div>
                        </span>
                    </div>
                    <div className="line-ttc">
                        <span className="label-name-ttc">Còn nợ</span>
                        <span className="colon-ttc">:</span>
                        <span className="value-ttc">
                            {customerInfo?.debt && tienKhachTra
                                ? (customerInfo.debt - parseInt(tienKhachTra)).toLocaleString() + ' VNĐ'
                                : ''}
                        </span>
                    </div>
                </div>
                <div className="save-button-wrapper-ttc">
                    <button className="save-button-ttc" onClick={handleSavePayment}>
                        Lưu
                    </button>
                </div>

                {showValidationModal && (
                    <div className="validation-modal-ttc">
                        <div className="validation-modal-content-ttc">
                            <p>Vui lòng nhập đủ các thông tin trước khi lưu.</p>
                            <button
                                className="close-modal-button-ttc"
                                onClick={() => setShowValidationModal(false)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}

                {showSuccessModal && (
                    <div className="success-modal-ttc">
                        <div className="success-modal-content-ttc">
                            <p>Hóa đơn mã <strong>{savedReceiptId}</strong> đã được lưu thành công!</p>
                            <button
                                className="close-modal-button-ttc"
                                onClick={() => setShowSuccessModal(false)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ThanhToanCu;
