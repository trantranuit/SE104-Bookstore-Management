import React, { useState, useEffect } from 'react';
import '../../../styles/PathStyles.css';
import './ThanhToanCu.css';
import { useNavigate, useLocation } from 'react-router-dom';
import thanhToanCuApi from '../../../services/thanhToanCuApi';

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
    const [maPhieuThu, setMaPhieuThu] = useState('PT1');
    const [showValidationModal, setShowValidationModal] = useState(false); // State for validation modal
    const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
    const [savedReceiptId, setSavedReceiptId] = useState(''); // State for saved receipt ID
    const [tienKhachTraError, setTienKhachTraError] = useState(false);
    const [tienKhachTraErrorMsg, setTienKhachTraErrorMsg] = useState('');
    const [customerData, setCustomerData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [customerInfo, setCustomerInfo] = useState({
        id: '',
        name: '',
        phone: '',
        email: '',
        debt: 0
    });
    const [employeeInfo, setEmployeeInfo] = useState({ id: '', name: '' });
    const [message, setMessage] = useState(''); // Add message state

    // Update getNewMaPhieu to use state instead of returning Promise
    const getNewMaPhieu = async () => {
        try {
            const response = await thanhToanCuApi.getAllPhieuThuTien();
            let maxId = 0;

            if (response.data && response.data.length > 0) {
                // Find the highest receipt number by extracting numeric part after 'PT'
                maxId = Math.max(...response.data.map(receipt => {
                    const numId = parseInt(receipt.MaPhieuThu.replace('PT', ''), 10);
                    return isNaN(numId) ? 0 : numId;
                }));
            }

            // Create new ID by adding 1 to max and padding with zeros
            const nextId = (maxId + 1).toString().padStart(3, '0');
            setMaPhieuThu(`PT${nextId}`);
        } catch (error) {
            console.error('Error getting receipt ID:', error);
            setMaPhieuThu('PT001'); // Default to PT001 if error occurs
        }
    };

    useEffect(() => {
        if (isEditing && receipt) {
            setMaPhieuThu(receipt.maPhieuThu); // Use existing maPhieuThu when editing
            setMaKhachHang(receipt.maKhachHang || '');
            setTienKhachTra(receipt.soTienTra?.toString() || '');
            setMaNhanVien(receipt.maNhanVien || '');
            setNgayLap(receipt.ngayLap || '');
        } else {
            getNewMaPhieu(); // Call the async function here
        }
    }, [isEditing, receipt]);

    useEffect(() => {
        // Fetch customer data
        thanhToanCuApi.getAllCustomers()
            .then(data => setCustomerData(data))
            .catch(err => {
                console.error('Lỗi khi lấy khách hàng:', err);
                setCustomerData([]);
            });

        // Fetch employee data
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
        // Kiểm tra nếu nhập lớn hơn số tiền nợ thì báo lỗi
        if (customerInfo?.SoTienNo && parseInt(rawValue || '0') > customerInfo.SoTienNo) {
            setTienKhachTraError(true);
            setTienKhachTraErrorMsg('Số tiền trả không được lớn hơn số tiền khách đang nợ!');
        } else {
            setTienKhachTraError(false);
            setTienKhachTraErrorMsg('');
        }
        setTienKhachTra(rawValue);
    };

    const handleMaNhanVienChange = (e) => {
        const value = e.target.value;
        setMaNhanVien(value);
    };

    const handleNgayLapChange = (e) => {
        setNgayLap(e.target.value);
    };

    const handleEmployeeIdChange = async (e) => {
        const input = e.target.value;
        // Remove prefix and leading zeros
        const employeeId = input.toString().replace(/^NV0*/, '').replace(/^0*/, '');

        // Format display value as NVxxx
        const displayValue = employeeId ? `NV${employeeId.padStart(3, '0')}` : '';
        setEmployeeInfo({ ...employeeInfo, id: displayValue });

        if (!employeeId) {
            setEmployeeInfo({ id: '', name: '' });
            return;
        }

        try {
            const employee = await thanhToanCuApi.getUserById(employeeId);
            setEmployeeInfo({
                id: `NV${employeeId.padStart(3, '0')}`,
                name: `${employee.last_name} ${employee.first_name}`
            });
        } catch {
            setEmployeeInfo({ id: displayValue, name: '' });
        }
    };

    const handleCustomerIdChange = async (e) => {
        const input = e.target.value;
        const customerId = input.toString().replace(/^KH0*/, '').replace(/^0*/, '');
        const displayValue = customerId ? `KH${customerId.padStart(3, '0')}` : '';
        setCustomerInfo({ ...customerInfo, id: displayValue });

        if (!customerId) {
            setCustomerInfo({ id: '', name: '', phone: '', email: '', debt: 0 });
            return;
        }

        try {
            const customer = await thanhToanCuApi.getCustomerById(customerId);
            setCustomerInfo({
                id: displayValue,
                name: customer.HoTen,
                phone: customer.DienThoai,
                email: customer.Email,
                debt: customer.SoTienNo || 0, // Use customer's actual debt from API
                SoTienNo: customer.SoTienNo || 0 // Keep this for compatibility
            });
        } catch (error) {
            console.error('Error fetching customer:', error);
            setCustomerInfo({ id: displayValue, name: '', phone: '', email: '', debt: 0 });
        }
    };

    const handleSavePayment = async () => {
        if (!maKhachHang || !tienKhachTra || !maNhanVien || !ngayLap) {
            setShowValidationModal(true);
            return;
        }
        if (tienKhachTraError) {
            return;
        }

        try {
            const formattedCustomerId = customerInfo.id.replace(/^KH0*/, '');
            const formattedEmployeeId = employeeInfo.id.replace(/^NV0*/, '');

            // Format data for API
            const receiptData = {
                SoTienThu: parseInt(tienKhachTra),
                NgayThu: ngayLap,
                MaKH_input: formattedCustomerId,
                NguoiThu_input: formattedEmployeeId
            };

            // Create receipt first
            const newReceipt = await thanhToanCuApi.createReceipt(receiptData);

            if (newReceipt) {
                // Update customer's debt
                const newDebt = customerInfo.debt - parseInt(tienKhachTra);
                await thanhToanCuApi.updateCustomerDebt(formattedCustomerId, { SoTienNo: newDebt });

                // Show success message and reset form
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
                                    value={employeeInfo.id}
                                    onChange={handleEmployeeIdChange}
                                    className={getInputClass(maNhanVien)}
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
                                    value={customerInfo.id}
                                    onChange={handleCustomerIdChange}
                                    className={getInputClass(maKhachHang)}
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
                            {(customerInfo && typeof customerInfo.SoTienNo === 'number')
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
                                    className={`${getInputClass(tienKhachTra)}${tienKhachTraError ? ' error' : ''}`}
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
                                    disabled={!maKhachHang || !maNhanVien}
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
                            {customerInfo?.SoTienNo && tienKhachTra
                                ? (customerInfo.SoTienNo - parseInt(tienKhachTra)).toLocaleString() + ' VNĐ'
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