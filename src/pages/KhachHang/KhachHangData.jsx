import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const customerData = [
    {
        id: 'KH001',
        name: 'Nguyễn Văn A',
        phone: '0123456789',
        email: 'nguyenvana@gmail.com',
        address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
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
        phone: '0987654321',
        email: 'tranthib@gmail.com',
        address: '456 Đường Nguyễn Huệ, Quận 3, TP.HCM',
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
        email: 'levanc@email.com',
        address: '789 Đường GHI, Quận 3, TP.HCM',
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
        email: 'phamthid@email.com',
        address: '101 Đường JKL, Quận 4, TP.HCM',
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
        email: 'hoangvane@email.com',
        address: '202 Đường MNO, Quận 5, TP.HCM',
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
        email: 'dothif@email.com',
        address: '303 Đường PQR, Quận 6, TP.HCM',
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
        email: 'ngovang@email.com',
        address: '404 Đường STU, Quận 7, TP.HCM',
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
        email: 'buithih@email.com',
        address: '505 Đường VWX, Quận 8, TP.HCM',
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
        email: 'vuvani@email.com',
        address: '606 Đường YZ, Quận 9, TP.HCM',
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
        email: 'dangthij@email.com',
        address: '707 Đường ABC, Quận 10, TP.HCM',
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
        email: 'trinhvank@email.com',
        address: '808 Đường DEF, Quận 11, TP.HCM',
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
        email: 'maithil@email.com',
        address: '909 Đường GHI, Quận 12, TP.HCM',
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
        email: 'tavanm@email.com',
        address: '1010 Đường JKL, Quận 13, TP.HCM',
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
        email: 'hothin@email.com',
        address: '1111 Đường MNO, Quận 14, TP.HCM',
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
        email: 'phanvano@email.com',
        address: '1212 Đường PQR, Quận 15, TP.HCM',
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
        email: 'duongthip@email.com',
        address: '1313 Đường STU, Quận 16, TP.HCM',
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
        email: 'chauvanq@email.com',
        address: '1414 Đường VWX, Quận 17, TP.HCM',
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
        email: 'dinhthir@email.com',
        address: '1515 Đường YZ, Quận 18, TP.HCM',
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
        email: 'kieuvans@email.com',
        address: '1616 Đường ABC, Quận 19, TP.HCM',
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
        email: 'caothit@email.com',
        address: '1717 Đường DEF, Quận 20, TP.HCM',
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
        email: 'luongvanu@email.com',
        address: '1818 Đường GHI, Quận 21, TP.HCM',
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
        email: 'doanthiv@email.com',
        address: '1919 Đường JKL, Quận 22, TP.HCM',
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
        email: 'nguyenvanw@email.com',
        address: '2020 Đường MNO, Quận 23, TP.HCM',
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
        email: 'tranthix@email.com',
        address: '2121 Đường PQR, Quận 24, TP.HCM',
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
        email: 'levany@email.com',
        address: '2222 Đường STU, Quận 25, TP.HCM',
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
