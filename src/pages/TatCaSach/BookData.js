const bookData = [
    {
        id: 'B001',
        maSach: 'SA001',
        tenSach: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ',
        tacGia: 'Tác giả mẫu',
        theLoai: 'Thể loại mẫu',
        namXuatBan: 2023,
        nhaXuatBan: 'Nhà xuất bản mẫu',
        soLuongTon: 10, // Quantity in stock
        donGiaBan: 150000 // Added price
    },
    {
        id: 'B002',
        maSach: 'SA002',
        tenSach: 'Tên sách khác',
        tacGia: 'Tác giả khác',
        theLoai: 'Thể loại khác',
        namXuatBan: 2022,
        nhaXuatBan: 'Nhà xuất bản khác',
        soLuongTon: 15, // Quantity in stock
        donGiaBan: 120000 // Added price
    },
    {
        id: 'B003',
        maSach: 'SA003',
        tenSach: 'Lập Trình JavaScript',
        tacGia: 'Nguyễn Văn A',
        theLoai: 'Công nghệ thông tin',
        namXuatBan: 2021,
        nhaXuatBan: 'NXB Khoa Học',
        soLuongTon: 20, // Quantity in stock
        donGiaBan: 90000 // Added price
    },
    {
        id: 'B004',
        maSach: 'SA004',
        tenSach: 'Học Python Cơ Bản',
        tacGia: 'Trần Thị B',
        theLoai: 'Công nghệ thông tin',
        namXuatBan: 2020,
        nhaXuatBan: 'NXB Giáo Dục',
        soLuongTon: 25, // Quantity in stock
        donGiaBan: 200000 // Added price
    },
    {
        id: 'B005',
        maSach: 'SA005',
        tenSach: 'Tư Duy Lập Trình',
        tacGia: 'Lê Văn C',
        theLoai: 'Công nghệ thông tin',
        namXuatBan: 2019,
        nhaXuatBan: 'NXB Trẻ',
        soLuongTon: 30, // Quantity in stock
        donGiaBan: 180000 // Added price
    },
    {
        id: 'B006',
        maSach: 'SA006',
        tenSach: 'Học C++ Qua Ví Dụ',
        tacGia: 'Phạm Minh D',
        theLoai: 'Công nghệ thông tin',
        namXuatBan: 2018,
        nhaXuatBan: 'NXB Lao Động',
        soLuongTon: 12, // Quantity in stock
        donGiaBan: 150000 // Added price
    },
    {
        id: 'B007',
        maSach: 'SA007',
        tenSach: 'Lịch Sử Việt Nam',
        tacGia: 'Nguyễn Thị E',
        theLoai: 'Lịch sử',
        namXuatBan: 2017,
        nhaXuatBan: 'NXB Văn Hóa',
        soLuongTon: 8, // Quantity in stock
        donGiaBan: 120000 // Added price
    },
    {
        id: 'B008',
        maSach: 'SA008',
        tenSach: 'Văn Học Việt Nam Hiện Đại',
        tacGia: 'Hoàng Văn F',
        theLoai: 'Văn học',
        namXuatBan: 2016,
        nhaXuatBan: 'NXB Văn Học',
        soLuongTon: 18, // Quantity in stock
        donGiaBan: 90000 // Added price
    },
    {
        id: 'B009',
        maSach: 'SA009',
        tenSach: 'Toán Học Cao Cấp',
        tacGia: 'Lý Văn G',
        theLoai: 'Toán học',
        namXuatBan: 2015,
        nhaXuatBan: 'NXB Đại Học Quốc Gia',
        soLuongTon: 22, // Quantity in stock
        donGiaBan: 200000 // Added price
    },
    {
        id: 'B010',
        maSach: 'SA010',
        tenSach: 'Hóa Học Cơ Bản',
        tacGia: 'Trần Văn H',
        theLoai: 'Hóa học',
        namXuatBan: 2014,
        nhaXuatBan: 'NXB Giáo Dục',
        soLuongTon: 16, // Quantity in stock
        donGiaBan: 180000 // Added price
    },
    {
        id: 'B011',
        maSach: 'SA011',
        tenSach: 'Sinh Học Phổ Thông',
        tacGia: 'Nguyễn Văn I',
        theLoai: 'Sinh học',
        namXuatBan: 2013,
        nhaXuatBan: 'NXB Giáo Dục',
        soLuongTon: 14, // Quantity in stock
        donGiaBan: 150000 // Added price
    },
    {
        id: 'B012',
        maSach: 'SA012',
        tenSach: 'Kỹ Năng Giao Tiếp',
        tacGia: 'Phạm Thị J',
        theLoai: 'Kỹ năng sống',
        namXuatBan: 2012,
        nhaXuatBan: 'NXB Trẻ',
        soLuongTon: 19, // Quantity in stock
        donGiaBan: 120000 // Added price
    },
    {
        id: 'B013',
        maSach: 'SA013',
        tenSach: 'Tâm Lý Học Hiện Đại',
        tacGia: 'Lê Văn K',
        theLoai: 'Tâm lý học',
        namXuatBan: 2011,
        nhaXuatBan: 'NXB Khoa Học',
        soLuongTon: 11, // Quantity in stock
        donGiaBan: 90000 // Added price
    },
    {
        id: 'B014',
        maSach: 'SA014',
        tenSach: 'Kinh Tế Học Cơ Bản',
        tacGia: 'Nguyễn Văn L',
        theLoai: 'Kinh tế',
        namXuatBan: 2010,
        nhaXuatBan: 'NXB Lao Động',
        soLuongTon: 13, // Quantity in stock
        donGiaBan: 200000 // Added price
    },
    {
        id: 'B015',
        maSach: 'SA015',
        tenSach: 'Hướng Dẫn Nấu Ăn',
        tacGia: 'Trần Thị M',
        theLoai: 'Ẩm thực',
        namXuatBan: 2009,
        nhaXuatBan: 'NXB Văn Hóa',
        soLuongTon: 9, // Quantity in stock
        donGiaBan: 180000 // Added price
    },
    {
        id: 'B016',
        maSach: 'SA016',
        tenSach: 'Học Tiếng Anh Qua Truyện',
        tacGia: 'Phạm Văn N',
        theLoai: 'Ngoại ngữ',
        namXuatBan: 2008,
        nhaXuatBan: 'NXB Giáo Dục',
        soLuongTon: 17, // Quantity in stock
        donGiaBan: 150000 // Added price
    },
    {
        id: 'B017',
        maSach: 'SA017',
        tenSach: 'Lập Trình Java Nâng Cao',
        tacGia: 'Nguyễn Văn O',
        theLoai: 'Công nghệ thông tin',
        namXuatBan: 2007,
        nhaXuatBan: 'NXB Khoa Học',
        soLuongTon: 21, // Quantity in stock
        donGiaBan: 120000 // Added price
    },
    // Add more book entries as needed
];

export default bookData;
