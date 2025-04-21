// Customer data
export const customers = [
    {
        id: 'KH001',
        name: 'Nguyen Van A',
        phone: '0123456789',
        email: 'nguyenvana@example.com',
        debt: 500000,
    },
    {
        id: 'KH002',
        name: 'Tran Thi B',
        phone: '0987654321',
        email: 'tranthib@example.com',
        debt: 200000,
    },
    // ...add more customers as needed
];

// Employee data
export const employees = [
    {
        id: 'NV001',
        name: 'Le Van C',
    },
    {
        id: 'NV002',
        name: 'Pham Thi D',
    },
    // ...add more employees as needed
];

// Book data
export const books = [
    {
        maSach: 'S001',
        tenSach: 'Book A',
        tacGia: 'Author A',
        nhaXuatBan: 'Publisher A',
        donGia: 100000,
        soLuongTon: 50,
    },
    {
        maSach: 'S002',
        tenSach: 'Book B',
        tacGia: 'Author B',
        nhaXuatBan: 'Publisher B',
        donGia: 150000,
        soLuongTon: 30,
    },
    // ...add more books as needed
];

// Invoice data
export const invoices = [
    {
        maHoaDon: 'HD001',
        ngayLap: '2023-10-01',
        maNhanVien: 'NV001',
        nhanVien: 'Le Van C',
        maKhachHang: 'KH001',
        tenKhachHang: 'Nguyen Van A',
        sdt: '0123456789',
        email: 'nguyenvana@example.com',
        soNo: 500000,
        danhSachSach: [
            { maSach: 'S001', tenSach: 'Book A', soLuong: 2, donGia: 100000 },
            { maSach: 'S002', tenSach: 'Book B', soLuong: 1, donGia: 150000 },
        ],
    },
    // ...add more invoices as needed
];

// Receipt data
export const receipts = [
    {
        maPhieuThu: 'PT001',
        ngayThu: '2023-10-02',
        maKhachHang: 'KH001',
        tenKhachHang: 'Nguyen Van A',
        soTienThu: 300000,
    },
    {
        maPhieuThu: 'PT002',
        ngayThu: '2023-10-03',
        maKhachHang: 'KH002',
        tenKhachHang: 'Tran Thi B',
        soTienThu: 200000,
    },
    // ...add more receipts as needed
];
