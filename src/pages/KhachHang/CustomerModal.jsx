import React, { useState, useEffect } from 'react';

function CustomerModal({ customer, onSave, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        debtAmount: 0  // Will always be 0 for new customers
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
        
        setSubmitting(true);
        try {
            // Just call onSave and let parent component handle modals
            await onSave(formData);
            // Parent will close this modal
        } catch (error) {
            console.error('Error saving customer:', error);
        } finally {
            setSubmitting(false);
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
                            disabled={true} // Always disable this field
                            className="disabled-input" // Add this class for styling
                            style={{ backgroundColor: '#f0f0f0' }} // Make it look disabled
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