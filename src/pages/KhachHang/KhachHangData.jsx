import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const customerData = [
    {
        id: 'KH001',
        name: 'Nguyễn Văn A',
        phone: '0123456789',
        invoiceId: 'HD1001',
        quantity: 10,
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
        invoiceId: 'HD1002',
        quantity: 5,
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
        invoiceId: 'HD1003',
        quantity: 15,
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
        invoiceId: 'HD1004',
        quantity: 8,
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
        invoiceId: 'HD1005',
        quantity: 12,
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
        invoiceId: 'HD1006',
        quantity: 7,
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
        invoiceId: 'HD1007',
        quantity: 9,
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
        invoiceId: 'HD1008',
        quantity: 11,
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
        invoiceId: 'HD1009',
        quantity: 6,
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
        invoiceId: 'HD1010',
        quantity: 13,
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
        invoiceId: 'HD1011',
        quantity: 14,
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
        invoiceId: 'HD1012',
        quantity: 4,
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
        invoiceId: 'HD1013',
        quantity: 16,
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
        invoiceId: 'HD1014',
        quantity: 3,
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
        invoiceId: 'HD1015',
        quantity: 17,
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
        invoiceId: 'HD1016',
        quantity: 2,
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
        invoiceId: 'HD1017',
        quantity: 19,
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
        invoiceId: 'HD1018',
        quantity: 1,
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
        invoiceId: 'HD1019',
        quantity: 18,
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
        invoiceId: 'HD1020',
        quantity: 20,
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
        invoiceId: 'HD1021',
        quantity: 5,
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
        invoiceId: 'HD1022',
        quantity: 13,
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
        invoiceId: 'HD1023',
        quantity: 8,
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
        invoiceId: 'HD1024',
        quantity: 7,
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
        invoiceId: 'HD1025',
        quantity: 9,
        note: (
            <div>
                <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
        )
    },
];

export default customerData;
