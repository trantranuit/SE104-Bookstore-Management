import React, { useState, useEffect } from 'react';

function CustomerModal({ customer, onSave, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        debtAmount: 0
    });
    const [phoneError, setPhoneError] = useState('');
    const [submitting, setSubmitting] = useState(false); 

    useEffect(() => {
        if (customer) {
            setFormData(customer);
        }
    }, [customer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'phone') {
            // Only allow numbers
            if (!/^\d*$/.test(value)) {
                setPhoneError('Số điện thoại chỉ được chứa số');
                return;
            }
            setPhoneError('');
        }

        setFormData(prev => ({
            ...prev,
            [name]: name === 'debtAmount' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (phoneError) {
            return;
        }
        
        setSubmitting(true); // Set submitting to true when starting the save
        try {
            await onSave(formData);
            // If we get here, the save was successful
        } catch (error) {
            console.error('Error saving customer:', error);
            // Handle error if needed
        } finally {
            setSubmitting(false); // Set submitting to false when done
        }
    };

    return (
        <div className="modal-overlay">
            <div className="kh-modal-content"> {/* Changed from modal-content to kh-modal-content */}
                <h2>{customer ? 'Cập Nhật Khách Hàng' : 'Thêm Khách Hàng'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Họ tên:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại:</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            maxLength={10}
                        />
                        {phoneError && <div className="error-message">{phoneError}</div>}
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Số tiền nợ:</label>
                        <input
                            type="number"
                            name="debtAmount"
                            value={formData.debtAmount}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" disabled={!!phoneError || submitting}>
                            {submitting ? 'Đang lưu...' : (customer ? 'Cập nhật' : 'Thêm')}
                        </button>
                        <button type="button" onClick={onClose} disabled={submitting}>
                            Huỷ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CustomerModal;