import React from "react";

const TableNhapSach = ({ data, onEdit }) => {
  return (
    <div className="table-container">
      <table className="nhap-sach-table">
        <thead>
          <tr>
            <th>Mã phiếu nhập</th>
            <th>Ngày nhập</th>
            <th>Tên người nhập</th>{" "}
            {/* Thay Mã người nhập thành Tên người nhập */}
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Thể loại</th>
            <th>Nhà xuất bản</th>
            <th>Năm xuất bản</th>
            <th>Giá nhập</th>
            <th>Số lượng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="11" style={{ textAlign: "center" }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.ctNhapId}>
                <td>{item.maPhieuNhap}</td>
                <td>{item.ngayNhap}</td>
                <td>{item.TenNguoiNhap}</td> {/* Hiển thị TenNguoiNhap */}
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableNhapSach;
