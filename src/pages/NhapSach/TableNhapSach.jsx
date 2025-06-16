import React, { useState, useEffect } from "react";
import "./TableNhapSach.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const TableNhapSach = ({
  data,
  onEdit,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}) => {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="12" style={{ textAlign: "center" }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            currentItems.map((item, index) => (
              <tr key={item.ctNhapId}>
                <td>{startIndex + index + 1}</td>
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
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="nhap-sach-pagination-button"
        >
          ←
        </button>
        <span className="nhap-sach-pagination-info">
          Trang {currentPage}/{Math.max(1, totalPages)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="nhap-sach-pagination-button"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default TableNhapSach;
