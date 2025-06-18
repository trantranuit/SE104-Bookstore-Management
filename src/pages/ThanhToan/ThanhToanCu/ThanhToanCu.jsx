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
    const [showConfirmSaveModal, setShowConfirmSaveModal] = useState(false);
    const [savedReceiptId, setSavedReceiptId] = useState(null);
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
    const [pdfUrl, setPdfUrl] = useState(null);
    const [showPdfModal, setShowPdfModal] = useState(false);

    const formatNumber = (value) => {
        if (!value && value !== 0) return '';
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

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

    const handleMaKhachHangChange = async (e) => {
        const value = e.target.value.toUpperCase();
        setMaKhachHang(value);
        setCustomerInfo({ ...customerInfo, id: value });

        if (!value) {
            setCustomerInfo({ id: '', name: '', phone: '', email: '', debt: 0, SoTienNo: 0 });
            return;
        }

        try {
            const customerId = value.replace(/^KH/, '');
            const customer = await thanhToanCuApi.getCustomerById(customerId);
            const soTienNo = parseInt(customer.SoTienNo || '0');
            setCustomerInfo({
                id: value,
                name: customer.HoTen || '',
                phone: customer.DienThoai || '',
                email: customer.Email || '',
                debt: soTienNo,
                SoTienNo: soTienNo
            });
        } catch (error) {
            console.error('Error fetching customer:', error);
            setCustomerInfo({ id: value, name: '', phone: '', email: '', debt: 0, SoTienNo: 0 });
        }
    };

    const handleTienKhachTraChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        const tienKhachTraNum = parseInt(rawValue || '0');
        if (customerInfo?.SoTienNo && tienKhachTraNum > customerInfo.SoTienNo) {
            setTienKhachTra(customerInfo.SoTienNo.toString());
            setTienKhachTraError(false);
            setTienKhachTraErrorMsg('');
        } else {
            setTienKhachTra(rawValue);
            setTienKhachTraError(false);
            setTienKhachTraErrorMsg('');
        }
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
        const value = e.target.value.toUpperCase();
        setMaNhanVien(value);
        setEmployeeInfo({ ...employeeInfo, id: value });

        if (!value) {
            setEmployeeInfo({ id: '', name: '' });
            return;
        }

        try {
            const employeeId = value.replace(/^NV/, '');
            const employee = await thanhToanCuApi.getUserById(employeeId);
            setEmployeeInfo({
                id: value,
                name: `${employee.last_name} ${employee.first_name}`
            });
        } catch {
            setEmployeeInfo({ id: value, name: '' });
        }
    };

    const handlePrintPT = async () => {
        if (!savedReceiptId) {
            console.error('No receipt ID found');
            return;
        }

        try {
            const receiptId = savedReceiptId.toString().replace(/^PT/, '');
            console.log('Printing receipt with ID:', receiptId); // Debug log

            const response = await fetch(`http://localhost:8000/api/phieuthutien/${receiptId}/export-pdf/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
                    'Content-Type': 'application/pdf',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setPdfUrl(url);
            setShowPdfModal(true);
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                response: error.response
            });
            alert('Có lỗi khi in phiếu thu tiền. Vui lòng thử lại.');
        }
    };

    const handleSavePayment = () => {
        // Check if all required fields are filled
        if (!maKhachHang || !tienKhachTra || !maNhanVien || !ngayLap) {
            setMessage('Vui lòng điền đầy đủ thông tin!');
            setShowValidationModal(true);
            return;
        }

        // Validate maKhachHang and maNhanVien format
        if (!maKhachHang.match(/^KH\d{3}$/) || !maNhanVien.match(/^NV\d{3}$/)) {
            setMessage('Mã khách hàng hoặc mã nhân viên không đúng định dạng (KHxxx hoặc NVxxx)!');
            setShowValidationModal(true);
            return;
        }

        // Check if customer debt is 0
        if (customerInfo?.SoTienNo === 0) {
            setMessage('Không thể lập phiếu thu tiền cho số nợ là 0!');
            setShowValidationModal(true);
            return;
        }

        // Check if payment amount is 0 or empty
        if (parseInt(tienKhachTra) === 0) {
            setMessage('Số tiền trả phải lớn hơn 0!');
            setShowValidationModal(true);
            return;
        }

        // Show confirmation modal
        setShowConfirmSaveModal(true);
    };

    const confirmSavePayment = async () => {
        try {
            const formattedCustomerId = maKhachHang.replace(/^KH/, '');
            const formattedEmployeeId = maNhanVien.replace(/^NV/, '');

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
                setShowConfirmSaveModal(false);
                resetForm();
            }
        } catch (error) {
            console.error('Error saving receipt:', error);
            setMessage(error.response?.data?.message || 'Có lỗi xảy ra khi lưu phiếu thu');
            setShowValidationModal(true);
            setShowConfirmSaveModal(false);
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
                {/* <h2 className="receipt-subtitle-ttc">PHIẾU THU TIỀN TIỆM SÁCH TRÂN TRÂN</h2> */}

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
                                    placeholder="Nhập mã nhân viên (NVxxx)"
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
                                <input
                                    type="date"
                                    value={formatDateForInput(ngayLap)}
                                    onChange={handleNgayLapChange}
                                    className="custom-input-ttc date-input-ttc"
                                />
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
                                    onChange={handleMaKhachHangChange}
                                    className={getInputClass()}
                                    placeholder="Nhập mã khách hàng (KHxxx)"
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
                                ? formatNumber(customerInfo.SoTienNo) + ' VNĐ'
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
                                    value={tienKhachTra ? formatNumber(parseInt(tienKhachTra.replace(/\D/g, ''))) : ''}
                                    onChange={handleTienKhachTraChange}
                                    onFocus={() => setIsFocused({ ...isFocused, tien: true })}
                                    onBlur={() => setIsFocused({ ...isFocused, tien: false })}
                                    placeholder="Nhập số tiền trả"
                                    disabled={!maKhachHang}
                                />
                                <span className="vnd-label-ttc"> VNĐ</span>
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
                                ? formatNumber(Math.max(0, customerInfo.SoTienNo - parseInt(tienKhachTra.replace(/\D/g, '')))) + ' VNĐ'
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
                            <p>Phiếu thu tiền đã được lưu thành công!</p>
                            <div className="modal-actions-ttc">
                                <button
                                    className="print-modal-button-ttc"
                                    onClick={handlePrintPT}
                                    style={{ marginRight: '10px' }}
                                >
                                    In phiếu thu
                                </button>
                                <button
                                    className="close-modal-button-ttc"
                                    onClick={() => setShowSuccessModal(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showConfirmSaveModal && (
                    <div className="validation-modal-ttc">
                        <div className="validation-modal-content-ttc">
                            <p>Bạn có chắc muốn lưu phiếu thu tiền này không?</p>
                            <div className="modal-actions-ttc">
                                <button
                                    className="confirm-button-ttc"
                                    onClick={confirmSavePayment}
                                >
                                    Có
                                </button>
                                <button
                                    className="close-modals-button-ttc"
                                    onClick={() => setShowConfirmSaveModal(false)}
                                >
                                    Không
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showPdfModal && pdfUrl && (
                    <div className="pdf-modal-overlay-ttc" onClick={(e) => {
                        if (e.target.className === 'pdf-modal-overlay-ttc') {
                            setShowPdfModal(false);
                            window.URL.revokeObjectURL(pdfUrl);
                            setPdfUrl(null);
                        }
                    }}>
                        <div className="pdf-modal-content-ttc">
                            <iframe
                                src={pdfUrl}
                                title="Receipt PDF"
                                width="100%"
                                height="100%"
                                style={{ border: 'none' }}
                            />
                            <div style={{ textAlign: 'right', padding: 8 }}>
                                <button
                                    className="close-modal-button-ttc"
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
            </div>
        </div>
    );
}

export default ThanhToanCu;