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
        const data = await customerService.getAllCustomers("");
        // Thêm chỉ số vào dữ liệu gốc để sử dụng cho cột No.
        let transformedData = data.map((customer, index) => ({
          MaKhachHang: customer.MaKhachHang.toString(),
          _index: index, // Thêm chỉ số gốc vào dữ liệu
          name: customer.HoTen,
          phone: customer.DienThoai,
          email: customer.Email,
          address: customer.DiaChi,
          debtAmount: parseInt(customer.SoTienNo) || 0,
        }));
        // Lọc tổng hợp theo searchTerm
        if (searchTerm.trim()) {
          const term = searchTerm.trim().toLowerCase();
          transformedData = transformedData.filter(c =>
            c.MaKhachHang.toLowerCase().includes(term) ||
            c.MaKhachHang.replace(/^KH/, '').includes(term.replace(/^kh/, '')) ||
            c.name.toLowerCase().includes(term) ||
            c.phone.includes(term)
          );
        }
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
      cell: ({ row }) => {
        // Sử dụng index của dòng trong mảng gốc để tính số thứ tự
        return row.original._index + 1; // Sử dụng _index từ dữ liệu gốc
      },
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
            style={{ marginLeft: 6, color: '#e74c3c', cursor: 'pointer' }}
            title="Xoá khách hàng"
            onClick={() => handleDeleteCustomer(row.original.MaKhachHang)}
          />
        </div>
      ),
    },
  ];

  const canDeleteCustomer = async (customer) => {
    try {
      const customerDetail = await customerService.getCustomerById(customer.MaKhachHang.replace('KH', ''));
      // Kiểm tra có hóa đơn không
      if (customerDetail.hoadon && customerDetail.hoadon.length > 0) {
        return { canDelete: false, reason: 'Không thể xóa khách hàng vì đã có hóa đơn liên quan.' };
      }
      // Kiểm tra có phiếu thu tiền không
      if (customerDetail.phieuthutien_set && customerDetail.phieuthutien_set.length > 0) {
        return { canDelete: false, reason: 'Không thể xóa khách hàng vì đã có phiếu thu tiền liên quan.' };
      }
      // Kiểm tra có chi tiết báo cáo công nợ không (nếu backend trả về)
      if (customerDetail.ct_bccongno_set && customerDetail.ct_bccongno_set.length > 0) {
        return { canDelete: false, reason: 'Không thể xóa khách hàng vì còn dòng công nợ liên quan trong báo cáo công nợ (CT_BCCongNo). Vui lòng liên hệ quản trị viên để xóa các dòng công nợ này trước.' };
      }
      return { canDelete: true, reason: '' };
    } catch (error) {
      return { canDelete: false, reason: 'Không thể kiểm tra điều kiện xóa.' };
    }
  };

  const handleDeleteCustomer = async (MaKhachHang) => {
    const customer = customers.find(c => c.MaKhachHang === MaKhachHang);
    if (!customer) return;
    setLoading(true);
    const checkResult = await canDeleteCustomer(customer);
    setLoading(false);
    if (!checkResult.canDelete) {
      setError(checkResult.reason);
      return;
    }
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
      setError(null);
    } catch (err) {
      // Xử lý lỗi RestrictedError trả về dạng HTML (Internal Server Error)
      let errorMsg = "Không thể xóa khách hàng. Vui lòng thử lại.";
      if (err?.response?.data) {
        // Nếu trả về HTML có chứa 'RestrictedError' và 'CT_BCCongNo'
        const dataStr = typeof err.response.data === 'string' ? err.response.data : '';
        if (dataStr.includes('RestrictedError') && dataStr.includes('CT_BCCongNo')) {
          errorMsg = 'Không thể xóa khách hàng vì còn dòng công nợ liên quan trong báo cáo công nợ (CT_BCCongNo). Vui lòng liên hệ quản trị viên để xóa các dòng công nợ này trước.';
        } else if (dataStr.includes('RestrictedError') && dataStr.includes('HoaDon')) {
          errorMsg = 'Không thể xóa khách hàng vì đã có hóa đơn liên quan.';
        } else if (dataStr.includes('RestrictedError')) {
          errorMsg = 'Không thể xóa khách hàng vì còn dữ liệu liên quan trong hệ thống.';
        }
      }
      setError(errorMsg);
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

  // Thêm debug để kiểm tra pagination sau khi khởi tạo table
  useEffect(() => {
    console.log("Pagination state:", pagination);
    console.log("Customers data length:", customers.length);
  }, [pagination, customers]);

  // Thêm log để theo dõi sự thay đổi pagination khi chuyển trang
  useEffect(() => {
    console.log("Table state after page change:", {
      tablePagination: table?.getState()?.pagination,
      componentPagination: pagination
    });
  }, [pagination, table]);

  // Khi gặp lỗi không thể xoá khách hàng, ẩn modal xác nhận xoá
  useEffect(() => {
    if (error && error.toLowerCase().includes('không thể xóa khách hàng')) {
      setShowDeleteConfirmation(false);
    }
  }, [error]);

  return (
    <div className="kh-table-container">
      {loading && <div className="loading-indicator">Đang tải...</div>}
      {error && error.toLowerCase().includes('không thể xóa khách hàng') ? (
        <div className="cannot-delete-customer-alert cannot-delete-customer-alert-small">
          {error}
          <button
            className="close-cannot-delete-alert"
            onClick={() => setError(null)}
            title="Đóng thông báo"
          >
            ×
          </button>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : null}

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