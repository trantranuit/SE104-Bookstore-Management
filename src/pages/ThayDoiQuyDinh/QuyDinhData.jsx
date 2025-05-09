const QuyDinhData = [
  {
    id: 1,
    name: "Số lượng nhập tối thiểu",
    description: "Số lượng sách nhập vào mỗi lần phải ít nhất 10 cuốn",
    isActive: true,
  },
  {
    id: 2,
    name: "Số lượng tồn tối đa",
    description: "Số lượng sách tồn kho không được vượt quá 300 cuốn",
    isActive: true,
  },
  {
    id: 3,
    name: "Số tiền nợ tối đa",
    description: "Khách hàng không được nợ quá 500,000 VNĐ",
    isActive: true,
  },
  {
    id: 4,
    name: "Quy định về đặt sách",
    description: "Chỉ đặt sách khi số lượng tồn ít hơn 50 cuốn",
    isActive: true,
  },
  {
    id: 5,
    name: "Quy định về thanh toán",
    description: "Khách hàng phải thanh toán ít nhất 50% giá trị đơn hàng",
    isActive: true,
  },
  {
    id: 6,
    name: "Quy định về khuyến mãi",
    description: "Giảm giá tối đa 20% cho mỗi đơn hàng",
    isActive: false,
  },
  {
    id: 7,
    name: "Quy định về hoàn trả",
    description: "Chỉ nhận hoàn trả trong vòng 7 ngày kể từ ngày mua",
    isActive: true,
  },
  {
    id: 8,
    name: "Điều kiện thẻ thành viên",
    description: "Khách hàng phải có ít nhất 5 đơn hàng để đăng ký thẻ",
    isActive: false,
  },
];

export default QuyDinhData;
