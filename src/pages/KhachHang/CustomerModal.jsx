import React, { useState, useEffect } from 'react';

function CustomerModal({ customer, onSave, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        invoiceId: '',
        quantity: ''
    });
    const [phoneError, setPhoneError] = useState('');
    const [quantityError, setQuantityError] = useState('');

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

        if (name === 'quantity') {
            // Only allow numbers
            if (!/^\d*$/.test(value)) {
                setQuantityError('Số lượng chỉ được chứa số');
                return;
            }
            setQuantityError('');
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (phoneError || quantityError) {
            return;
        }
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
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
                        <label>Mã hoá đơn:</label>
                        <input
                            type="text"
                            name="invoiceId"
                            value={formData.invoiceId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Số lượng:</label>
                        <input
                            type="text"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            pattern="\d*"
                            inputMode="numeric"
                        />
                        {quantityError && <span className="error-message">{quantityError}</span>}
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" disabled={!!phoneError || !!quantityError}>
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