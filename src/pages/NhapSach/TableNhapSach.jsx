import React, { useState, useEffect } from "react";
import "./TableNhapSach.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const TableNhapSach = ({ data, onEdit }) => {
  const [pagination, setPagination] = useState(() => {
    const savedPagination = localStorage.getItem("nhapSachPagination");
    return savedPagination
      ? JSON.parse(savedPagination)
      : { pageIndex: 0, pageSize: 10 };
  });

  useEffect(() => {
    localStorage.setItem("nhapSachPagination", JSON.stringify(pagination));
  }, [pagination]);

  const pageCount = Math.ceil(data.length / pagination.pageSize);
  const displayData = data.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  );

  const nextPage = () => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: Math.min(prev.pageIndex + 1, pageCount - 1),
    }));
  };

  const previousPage = () => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: Math.max(0, prev.pageIndex - 1),
    }));
  };

  return (
    <div className="table-container-tns">
      <table className="nhap-sach-table-tns">
        <thead>
          <tr>
            <th>No.</th>
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
          {displayData.length === 0 ? (
            <tr>
              <td colSpan="12" style={{ textAlign: "center" }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            displayData.map((item, index) => (
              <tr key={item.ctNhapId}>
                <td>
                  {pagination.pageIndex * pagination.pageSize + index + 1}
                </td>
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
                  <div className="nhap-sach-action-buttons-tns">
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="nhap-sach-edit-icon-tns"
                      onClick={() => onEdit(item)}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="nhap-sach-pagination">
        <button
          onClick={previousPage}
          disabled={pagination.pageIndex === 0}
          className="nhap-sach-pagination-button"
        >
          ←
        </button>
        <span className="nhap-sach-pagination-info">
          Trang {pagination.pageIndex + 1} / {pageCount || 1}
        </span>
        <button
          onClick={nextPage}
          disabled={pagination.pageIndex >= pageCount - 1}
          className="nhap-sach-pagination-button"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default TableNhapSach;
