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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (phoneError) {
            return;
        }
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="kh-modal-content">
                <h2>{customer ? 'Sửa Khách Hàng' : 'Thêm Khách Hàng'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tên khách hàng:</label>
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
                            pattern="\d*"
                            inputMode="numeric"
                        />
                        {phoneError && <span className="error-message">{phoneError}</span>}
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
                        <button type="submit" disabled={!!phoneError}>
                            {customer ? 'Cập nhật' : 'Thêm'}
                        </button>
                        <button type="button" onClick={onClose}>
                            Huỷ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CustomerModal;