import React, { useState, useEffect } from 'react';
import '../../../styles/PathStyles.css';
import './ThanhToanCu.css';
import { useNavigate, useLocation } from 'react-router-dom';
import thanhToanCuApi from '../../../services/thanhToanCuApi';

function ThanhToanCu() {
    const navigate = useNavigate();
    const location = useLocation();
    const receipt = location.state?.receipt;
    const isEditing = location.state?.isEditing || false;
    const [maKhachHang, setMaKhachHang] = useState('');
    const [tienKhachTra, setTienKhachTra] = useState('');
    const [maNhanVien, setMaNhanVien] = useState('');
    const [ngayLap, setNgayLap] = useState(() => {
        const today = new Date();
        today.setHours(today.getHours() + 7);
        const day = today.getDate().toString().padStart(2, '0');
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const year = today.getFullYear();
        return `${day}/${month}/${year}`;
    });
    const [isFocused, setIsFocused] = useState({ tien: false });
    const [maPhieuThu, setMaPhieuThu] = useState('PT001');
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [savedReceiptId, setSavedReceiptId] = useState('');
    const [tienKhachTraError, setTienKhachTraError] = useState(false);
    const [tienKhachTraErrorMsg, setTienKhachTraErrorMsg] = useState('');
    const [customerData, setCustomerData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [customerInfo, setCustomerInfo] = useState({
        id: '',
        name: '',
        phone: '',
        email: '',
        debt: 0,
        SoTienNo: 0
    });
    const [employeeInfo, setEmployeeInfo] = useState({ id: '', name: '' });
    const [message, setMessage] = useState('');


    const getNewMaPhieu = async () => {
        try {
            const nextId = await thanhToanCuApi.getNextReceiptId();
            setMaPhieuThu(nextId);
        } catch (error) {
            console.error('Error getting receipt ID:', error);
            setMaPhieuThu('PT001');
        }

    };

    useEffect(() => {
        if (isEditing && receipt) {
            setMaPhieuThu(receipt.maPhieuThu);
            setMaKhachHang(receipt.maKhachHang || '');
            setTienKhachTra(receipt.soTienTra?.toString() || '');
            setMaNhanVien(receipt.maNhanVien || '');
            setEmployeeInfo({
                id: receipt.maNhanVien || '',
                name: receipt.tenNhanVien || ''
            });
            if (receipt.ngayLap) {
                const dateParts = receipt.ngayLap.includes('-') ? receipt.ngayLap.split('-') : receipt.ngayLap.split('/');
                if (dateParts.length === 3) {
                    const [year, month, day] = receipt.ngayLap.includes('-') ? [dateParts[0], dateParts[1], dateParts[2]] : [dateParts[2], dateParts[1], dateParts[0]];
                    setNgayLap(`${day}/${month}/${year}`);
                } else {
                    setNgayLap(receipt.ngayLap);
                }
            }
        } else {
            getNewMaPhieu();
            const today = new Date();
            today.setHours(today.getHours() + 7);
            const day = today.getDate().toString().padStart(2, '0');
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const year = today.getFullYear();
            setNgayLap(`${day}/${month}/${year}`);
        }
    }, [isEditing, receipt]);

    useEffect(() => {
        thanhToanCuApi.getAllCustomers()
            .then(data => setCustomerData(data))
            .catch(err => {
                console.error('Lỗi khi lấy khách hàng:', err);
                setCustomerData([]);
            });

        thanhToanCuApi.getAllUsers()
            .then(data => setEmployeeData(data))
            .catch(err => {
                console.error('Lỗi khi lấy nhân viên:', err);
                setEmployeeData([]);
            });
    }, []);

    const handleMaKhachHangChange = (e) => {
        const value = e.target.value;
        setMaKhachHang(value);
    };

    const handleTienKhachTraChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        const tienKhachTraNum = parseInt(rawValue || '0');
        if (customerInfo?.SoTienNo && tienKhachTraNum > customerInfo.SoTienNo) {
            setTienKhachTraError(true);

            setMessage('Số tiền trả không được lớn hơn số tiền khách đang nợ!');
            setShowValidationModal(true);
        } else {
            setTienKhachTraError(false);
            setTienKhachTraErrorMsg('');
        }
        setTienKhachTra(rawValue);
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

    const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    };

    const handleEmployeeIdChange = async (e) => {
        const input = e.target.value;
        const employeeId = input.toString().replace(/^NV0*/, '').replace(/^0*/, '');
        const displayValue = employeeId ? `NV${employeeId.padStart(3, '0')}` : '';
        setMaNhanVien(displayValue);
        setEmployeeInfo({ ...employeeInfo, id: displayValue });

        if (!employeeId) {
            setEmployeeInfo({ id: '', name: '' });
            setMaNhanVien('');
            return;
        }

        try {
            const employee = await thanhToanCuApi.getUserById(employeeId);
            setEmployeeInfo({
                id: `NV${employeeId.padStart(3, '0')}`,
                name: `${employee.last_name} ${employee.first_name}`
            });
            setMaNhanVien(`NV${employeeId.padStart(3, '0')}`);
        } catch {
            setEmployeeInfo({ id: displayValue, name: '' });
        }
    };

    const handleCustomerIdChange = async (e) => {
        const input = e.target.value;
        const customerId = input.toString().replace(/^KH0*/, '').replace(/^0*/, '');
        const displayValue = customerId ? `KH${customerId.padStart(3, '0')}` : '';
        setMaKhachHang(displayValue);
        setCustomerInfo({ ...customerInfo, id: displayValue });

        if (!customerId) {
            setCustomerInfo({ id: '', name: '', phone: '', email: '', debt: 0, SoTienNo: 0 });
            return;
        }

        try {
            const customer = await thanhToanCuApi.getCustomerById(customerId);
            const soTienNo = parseInt(customer.SoTienNo || '0');
            setCustomerInfo({
                id: displayValue,
                name: customer.HoTen || '',
                phone: customer.DienThoai || '',
                email: customer.Email || '',
                debt: soTienNo,
                SoTienNo: soTienNo
            });
        } catch (error) {
            console.error('Error fetching customer:', error);
            setCustomerInfo({ id: displayValue, name: '', phone: '', email: '', debt: 0, SoTienNo: 0 });
        }
    };

    const handleSavePayment = async () => {
        // Check if customer debt is 0
        if (customerInfo?.SoTienNo === 0) {
            setMessage('Không thể lập phiếu thu tiền khi khách hàng không có nợ!');
            setShowValidationModal(true);
            return;
        }

        // Check if payment amount is 0 or empty
        if (!tienKhachTra || parseInt(tienKhachTra) === 0) {
            setMessage('Số tiền trả phải lớn hơn 0!');
            setShowValidationModal(true);
            return;
        }

        if (!maKhachHang || !tienKhachTra || !maNhanVien || !ngayLap) {
            setMessage('Vui lòng nhập đủ các thông tin trước khi lưu.');
            setShowValidationModal(true);
            return;
        }
        if (tienKhachTraError) {
            return;
        }

        try {
            const formattedCustomerId = customerInfo.id.replace(/^KH0*/, '');
            const formattedEmployeeId = employeeInfo.id.replace(/^NV0*/, '');

            const receiptData = {
                SoTienThu: parseInt(tienKhachTra),
                NgayThu: ngayLap,
                MaKH_input: formattedCustomerId,
                NguoiThu_input: formattedEmployeeId
            };

            const newReceipt = await thanhToanCuApi.createReceipt(receiptData);

            if (newReceipt) {
                const newDebt = customerInfo.SoTienNo - parseInt(tienKhachTra);
                await thanhToanCuApi.updateCustomerDebt(formattedCustomerId, { SoTienNo: newDebt });

                setSavedReceiptId(newReceipt.MaPhieuThu);
                setShowSuccessModal(true);
                resetForm();
            }
        } catch (error) {
            console.error('Error saving receipt:', error);
            setMessage(error.response?.data?.message || 'Có lỗi xảy ra khi lưu phiếu thu');
        }
    };

    const resetForm = () => {
        getNewMaPhieu();
        setMaKhachHang('');
        setTienKhachTra('');
        setMaNhanVien('');
        setEmployeeInfo({ id: '', name: '' });
        setNgayLap(() => {
            const today = new Date();
            today.setHours(today.getHours() + 7);
            const day = today.getDate().toString().padStart(2, '0');
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const year = today.getFullYear();
            return `${day}/${month}/${year}`;
        });
        setCustomerInfo({ id: '', name: '', phone: '', email: '', debt: 0, SoTienNo: 0 });
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
                                    value={employeeInfo.id}
                                    onChange={handleEmployeeIdChange}
                                    className={getInputClass()}
                                    placeholder="Nhập mã nhân viên"
                                />
                            </span>
                        </div>
                        <div className="line-ttc">
                            <span className="label-name-ttc">Người lập phiếu</span>
                            <span className="colon-ttc">:</span>
                            <span className="value-ttc">{employeeInfo.name}</span>
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
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="date"
                                        value={formatDateForInput(ngayLap)}
                                        onChange={handleNgayLapChange}
                                        className="custom-input-ttc"
                                        style={{ marginRight: '10px' }}
                                    />
                                    <span>{ngayLap}</span>
                                </div>
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
                                    value={customerInfo.id}
                                    onChange={handleCustomerIdChange}
                                    className={getInputClass()}
                                    placeholder="Nhập mã khách hàng"
                                />
                            </span>
                        </div>
                        <div className="line-ttc">
                            <span className="label-name-ttc">Tên khách hàng</span>
                            <span className="colon-ttc">:</span>
                            <span className="value-ttc">{customerInfo.name}</span>
                        </div>
                        <div className="line-ttc">
                            <span className="label-name-ttc">Số điện thoại</span>
                            <span className="colon-ttc">:</span>
                            <span className="value-ttc">{customerInfo.phone}</span>
                        </div>
                        <div className="line-ttc">
                            <span className="label-name-ttc">Địa chỉ email</span>
                            <span className="colon-ttc">:</span>
                            <span className="value-ttc">{customerInfo.email}</span>
                        </div>
                    </div>
                </div>

                <div className="thanhtoan financial-info-ttc">
                    <div className="line-ttc">
                        <span className="label-name-ttc">Số tiền khách nợ</span>
                        <span className="colon-ttc">:</span>
                        <span className="value-ttc">
                            {(typeof customerInfo.SoTienNo === 'number')
                                ? customerInfo.SoTienNo.toLocaleString('vi-VN').replace(/\./g, ',') + ' VNĐ'
                                : '0 VNĐ'}
                        </span>
                    </div>
                    <div className="line-ttc">
                        <span className="label-name-ttc">Số tiền khách trả</span>
                        <span className="colon-ttc">:</span>
                        <span className="value-ttc">
                            <div className="input-vnd-wrapper-ttc">
                                <input
                                    type="text"
                                    className={`${getInputClass()} ${tienKhachTraError ? 'error' : ''}`}
                                    value={
                                        tienKhachTra
                                            ? (
                                                customerInfo?.SoTienNo === 0
                                                    ? '0'
                                                    : (customerInfo?.SoTienNo && parseInt(tienKhachTra.replace(/\D/g, '')) > customerInfo.SoTienNo
                                                        ? customerInfo.SoTienNo.toLocaleString('vi-VN').replace(/\./g, ',')
                                                        : parseInt(tienKhachTra.replace(/\D/g, '')).toLocaleString('vi-VN').replace(/\./g, ',')
                                                    )
                                            )
                                            : ''
                                    }
                                    onChange={handleTienKhachTraChange}
                                    onFocus={() => setIsFocused({ ...isFocused, tien: true })}
                                    onBlur={() => setIsFocused({ ...isFocused, tien: false })}
                                    placeholder="Nhập số tiền trả"
                                    disabled={!maKhachHang}
                                />
                                <span className="vnd-label-ttc">VNĐ</span>
                            </div>
                            {tienKhachTraError && (
                                <div style={{ color: '#ff4d4d', fontWeight: 'bold', marginTop: '0.2rem' }}>
                                    {tienKhachTraErrorMsg}
                                </div>
                            )}
                        </span>
                    </div>
                    <div className="line-ttc">
                        <span className="label-name-ttc">Còn nợ</span>
                        <span className="colon-ttc">:</span>
                        <span className="value-ttc">
                            {tienKhachTra
                                ? (Math.max(0, customerInfo.SoTienNo - parseInt(tienKhachTra.replace(/\D/g, ''))))
                                    .toLocaleString('vi-VN').replace(/\./g, ',') + ' VNĐ'
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
                            <p>{message}</p>
                            <button
                                className="close-modal-button-ttc"
                                onClick={() => {
                                    setShowValidationModal(false);
                                    setMessage('');
                                }}
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