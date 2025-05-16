import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const customerData = [
    {
        id: 'KH001',
        name: 'Nguyễn Văn A',
        phone: '0123456789',
        debtAmount: 1000000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH002',
        name: 'Trần Thị B',
        phone: '0123456789',
        debtAmount: 500000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH003',
        name: 'Lê Văn C',
        phone: '0123456789',
        debtAmount: 1500000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH004',
        name: 'Phạm Thị D',
        phone: '0123456789',
        debtAmount: 800000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH005',
        name: 'Hoàng Văn E',
        phone: '0123456789',
        debtAmount: 1200000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH006',
        name: 'Đỗ Thị F',
        phone: '0123456789',
        debtAmount: 700000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH007',
        name: 'Ngô Văn G',
        phone: '0123456789',
        debtAmount: 900000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH008',
        name: 'Bùi Thị H',
        phone: '0123456789',
        debtAmount: 1100000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH009',
        name: 'Vũ Văn I',
        phone: '0123456789',
        debtAmount: 600000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH010',
        name: 'Đặng Thị J',
        phone: '0123456789',
        debtAmount: 1300000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH011',
        name: 'Trịnh Văn K',
        phone: '0123456789',
        debtAmount: 1400000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH012',
        name: 'Mai Thị L',
        phone: '0123456789',
        debtAmount: 400000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH013',
        name: 'Tạ Văn M',
        phone: '0123456789',
        debtAmount: 1600000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH014',
        name: 'Hồ Thị N',
        phone: '0123456789',
        debtAmount: 300000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH015',
        name: 'Phan Văn O',
        phone: '0123456789',
        debtAmount: 1700000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH016',
        name: 'Dương Thị P',
        phone: '0123456789',
        debtAmount: 200000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH017',
        name: 'Châu Văn Q',
        phone: '0123456789',
        debtAmount: 1900000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH018',
        name: 'Đinh Thị R',
        phone: '0123456789',
        debtAmount: 100000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH019',
        name: 'Kiều Văn S',
        phone: '0123456789',
        debtAmount: 1800000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH020',
        name: 'Cao Thị T',
        phone: '0123456789',
        debtAmount: 2000000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH021',
        name: 'Lương Văn U',
        phone: '0123456789',
        debtAmount: 500000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH022',
        name: 'Đoàn Thị V',
        phone: '0123456789',
        debtAmount: 1300000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH023',
        name: 'Nguyễn Văn W',
        phone: '0123456789',
        debtAmount: 800000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH024',
        name: 'Trần Thị X',
        phone: '0123456789',
        debtAmount: 700000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
    {
        id: 'KH025',
        name: 'Lê Văn Y',
        phone: '0123456789',
        debtAmount: 900000,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
];

export default customerData;
