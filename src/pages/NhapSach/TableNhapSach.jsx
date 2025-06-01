import React from "react";

const TableNhapSach = ({ data, onEdit }) => {
  return (
    <table className="table-nhap-sach">
      <thead>
        <tr>
          <th>Mã Phiếu Nhập</th>
          <th>Ngày Nhập</th>
          <th>Người Nhập</th> {/* Thay Ma Nguoi Nhap bang Nguoi Nhap */}
          <th>Mã Sách</th>
          <th>Tên Sách</th>
          <th>Thể Loại</th>
          <th>Nhà Xuất Bản</th>
          <th>Năm Xuất Bản</th>
          <th>Giá Nhập</th>
          <th>Số Lượng</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.ctNhapId}>
            <td>{item.maPhieuNhap}</td>
            <td>{item.ngayNhap || "Chưa xác định"}</td>
            <td>{item.NguoiNhap || "Không xác định"}</td>{" "}
            {/* Thay Ma Nguoi Nhap bang Nguoi Nhap */}
            <td>{item.maSach}</td>
            <td>{item.tenSach}</td>
            <td>{item.theLoai}</td>
            <td>{item.nhaXuatBan}</td>
            <td>{item.namXuatBan}</td>
            <td>{item.giaNhap}</td>
            <td>{item.soLuong}</td>
            <td>
              <button onClick={() => onEdit(item)}>Sửa</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableNhapSach;