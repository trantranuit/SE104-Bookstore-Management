// TableKhachHang.js
import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import customerService from "../../services/customerService";
import "./KhachHang.css";

function TableKhachHang({
  searchTerm,
  isModalOpen,
  setIsModalOpen,
  setCurrentCustomer,
  refreshTrigger,
  setRefreshTrigger,
}) {
  const [customers, setCustomers] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState(() => {
    const savedPagination = localStorage.getItem("khachHangPagination");
    return savedPagination
      ? JSON.parse(savedPagination)
      : { pageIndex: 0, pageSize: 10 };
  });

  useEffect(() => {
    localStorage.setItem("khachHangPagination", JSON.stringify(pagination));
  }, [pagination]);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await customerService.getAllCustomers(searchTerm);
        // Transform and filter the data locally as well for redundancy
        const transformedData = data
          .map((customer) => ({
            MaKhachHang: customer.MaKhachHang.toString(), // Keep as string to handle KH001 format
            name: customer.HoTen,
            phone: customer.DienThoai,
            email: customer.Email,
            address: customer.DiaChi,
            debtAmount: parseInt(customer.SoTienNo) || 0, // Convert string to number for display
          }))
          .filter(
            (customer) =>
              customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              customer.phone.includes(searchTerm)
          );
        setCustomers(transformedData);

        const pageCount = Math.ceil(transformedData.length / pagination.pageSize);
        if (transformedData.length === 0 || (pagination.pageIndex >= pageCount && pageCount > 0)) {
          setPagination((prev) => ({
            ...prev,
            pageIndex: Math.max(0, pageCount - 1),
          }));
        }
      } catch (err) {
        setError("Không thể tải danh sách khách hàng. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [searchTerm, refreshTrigger]);

  const columns = [
    {
      header: "No.",
      accessorKey: "index",
      size: 80,
      cell: ({ row }) => (pagination.pageIndex * pagination.pageSize) + row.index + 1
    },
    { header: "Mã KH", accessorKey: "MaKhachHang", size: 150 },
    { header: "Tên khách hàng", accessorKey: "name" },
    { header: "Số điện thoại", accessorKey: "phone" },
    { header: "Email", accessorKey: "email" },
    { header: "Địa chỉ", accessorKey: "address" },
    {
      header: "Số tiền nợ",
      accessorKey: "debtAmount",
      cell: ({ getValue }) => `${getValue().toLocaleString("vi-VN")} VND`,
    },
    {
      header: "Thao tác",
      accessorKey: "actions",
      cell: ({ row }) => (
        <div className="khachhang-action-buttons">
          <FontAwesomeIcon
            icon={faEdit}
            className="khachhang-edit-icon"
            onClick={() => {
              setCurrentCustomer(row.original);
              setIsModalOpen(true);
            }}
          />
          <FontAwesomeIcon
            icon={faTrash}
            className="khachhang-delete-icon"
            onClick={() => handleDeleteCustomer(row.original.MaKhachHang)}
          />
        </div>
      ),
    },
  ];

  const handleDeleteCustomer = (MaKhachHang) => {
    setCustomerToDelete(MaKhachHang);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await customerService.deleteCustomer(customerToDelete);
      setCustomers((prev) => prev.filter((customer) => customer.MaKhachHang !== customerToDelete));
      setShowDeleteConfirmation(false);
      setCustomerToDelete(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setError("Không thể xóa khách hàng. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle add customer
  const handleAddCustomer = async (newCustomer) => {
    setLoading(true);
    try {
      const createdCustomer = await customerService.createCustomer(newCustomer);

      // Transform created customer to match your data structure
      const transformedCustomer = {
        MaKhachHang: createdCustomer.MaKhachHang.toString(), // Keep as string for new format
        name: createdCustomer.HoTen,
        phone: createdCustomer.DienThoai,
        email: createdCustomer.Email,
        address: createdCustomer.DiaChi,
        debtAmount: parseInt(createdCustomer.SoTienNo) || 0, // Convert string to number
      };

      setCustomers((prev) => [...prev, transformedCustomer]);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setError("Không thể thêm khách hàng. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const table = useReactTable({
    data: customers,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  return (
    <div className="kh-table-container">
      {loading && <div className="loading-indicator">Đang tải...</div>}
      {error && <div className="error-message">{error}</div>}

      <table className="khachhang-report-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="khachhang-th">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="khachhang-tr">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="khachhang-td">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {customers.length === 0 && !loading && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "1rem" }}>
                Không tìm thấy khách hàng.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="khachhang-pagination">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="khachhang-pagination-button"
        >
          ←
        </button>
        <span className="khachhang-pagination-info">
          Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="khachhang-pagination-button"
        >
          →
        </button>
      </div>

      {showDeleteConfirmation && (
        <div className="confirmation-modal-kh">
          <div className="confirmation-content-kh">
            <p>Bạn có chắc muốn xóa khách hàng này không?</p>
            <div className="confirmation-actions-kh">
              <button
                className="delete-button-kh"
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? "Đang xóa..." : "Xóa"}
              </button>
              <button
                className="cancel-button-kh"
                onClick={() => setShowDeleteConfirmation(false)}
                disabled={loading}
              >
                Huỷ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableKhachHang;