// Danh sách khách hàng mẫu
export const khachHangData = {
    KH001: {
        tenKhachHang: 'Nguyễn Văn A',
        soDienThoai: '0909123456',
        diaChiEmail: 'a.nguyen@example.com',
        tienNo: '1.200.000'
    },
    KH002: {
        tenKhachHang: 'Trần Thị B',
        soDienThoai: '0912345678',
        diaChiEmail: 'b.tran@example.com',
        tienNo: '3.450.000'
    }
};

// Danh sách nhân viên mẫu
export const nhanVienData = {
    NV001: 'Lê Thị Mai',
    NV002: 'Phạm Văn Cường'
};

// ✅ Danh sách phiếu thu đã có trước đó
export const danhSachPhieuThu = [
    {
        maPhieuThu: 'PT000001',
        maKhachHang: 'KH001',
        maNhanVien: 'NV001',
        ngayLap: '2024-04-01',
        tienKhachTra: 500000
    },
    {
        maPhieuThu: 'PT000002',
        maKhachHang: 'KH002',
        maNhanVien: 'NV002',
        ngayLap: '2024-04-03',
        tienKhachTra: 1000000
    }
];
