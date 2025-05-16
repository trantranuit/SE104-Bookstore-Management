import React, { useState, useEffect } from "react";

const TableNhapSach = ({ data, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 10; // Số lượng phiếu nhập tối đa trên mỗi trang

  // Tính tổng số trang
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Khi dữ liệu thay đổi, tự động chuyển đến trang cuối nếu có thêm phiếu nhập
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages); // Chuyển đến trang cuối nếu trang hiện tại không hợp lệ
    }
  }, [data, totalPages, currentPage]); // Thêm totalPages và currentPage vào mảng phụ thuộc

  // Hàm chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Mã nhập</th>
            <th>Ngày nhập</th>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Thể loại</th>
            <th>Nhà xuất bản</th>
            <th>Năm xuất bản</th>
            <th>Giá nhập</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>{item.maNhap}</td>
              <td>{item.ngayNhap}</td>
              <td>{item.maSach}</td>
              <td>{item.tenSach}</td>
              <td>{item.tacGia}</td>
              <td>{item.theLoai}</td>
              <td>{item.nhaXuatBan}</td>
              <td>{item.namXuatBan}</td>
              <td>{item.giaNhap}</td>
              <td>{item.donGia}</td>
              <td>{item.soLuong}</td>
              <td>
                <button
                  className="action-btn edit-btn"
                  onClick={() => onEdit(item)}
                >
                  ✏️
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => onDelete(item.maNhap)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination-ns">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`pagination-btn-ns ${
              currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TableNhapSach;
