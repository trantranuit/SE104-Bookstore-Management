import React, { useState, forwardRef, useImperativeHandle, useCallback, useEffect } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import baoCaoCongNoService from "../../../services/baoCaoCongNoService";

const TableCongNo = forwardRef(({ month, year }, ref) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageInput, setPageInput] = useState(1);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const reports = await baoCaoCongNoService.getBaoCaoCongNo(month, year);
      if (reports && reports.length > 0) {
        setData(reports);
        // Get report ID after successfully fetching data
        const reportId = await baoCaoCongNoService.getReportId(month, year);
        return reportId; // Return report ID to parent
      } else {
        setData([]);
        setError(`Không có dữ liệu báo cáo công nợ cho tháng ${month}/${year}`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Có lỗi xảy ra khi tải dữ liệu");
      setData([]);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [month, year]);

  // Expose refreshData method to parent component
  useImperativeHandle(ref, () => ({
    refreshData: fetchData
  }), [fetchData]);

  const columns = [
    {
      header: "No.",
      accessorFn: (row, index) => index + 1,
      cell: (info) => <div className="stt-cell">{info.getValue()}</div>,
    },
    {
      header: "Mã khách hàng",
      accessorKey: "MaKH",
    },
    {
      header: "Tên khách hàng",
      accessorKey: "TenKH",
    },
    {
      header: "Số Điện Thoại",
      accessorKey: "DienThoai",
      cell: (info) => info.getValue() || "N/A",
    },
    {
      header: "Email",
      accessorKey: "Email",
      cell: (info) => info.getValue() || "N/A",
    },
    {
      header: "Nợ Đầu",
      accessorKey: "NoDau",
      cell: (info) => `${parseFloat(info.getValue()).toLocaleString("vi-VN")} VND`,
    },
    {
      header: "Phát Sinh",
      accessorKey: "PhatSinh",
      cell: (info) => `${parseFloat(info.getValue()).toLocaleString("vi-VN")} VND`,
    },
    {
      header: "Nợ Cuối",
      accessorKey: "NoCuoi",
      cell: (info) => `${parseFloat(info.getValue()).toLocaleString("vi-VN")} VND`,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const pageIndex = table.getState().pagination.pageIndex;
  useEffect(() => {
    setPageInput(pageIndex + 1);
  }, [pageIndex]);

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    let pageNumber = parseInt(pageInput);
    if (pageNumber >= 1 && pageNumber <= table.getPageCount()) {
      table.setPageIndex(pageNumber - 1);
    } else {
      setPageInput(table.getState().pagination.pageIndex + 1);
    }
  };

  if (isLoading) return <div className="loading-container">Đang tải dữ liệu...</div>;
  if (error && data.length === 0) return <div className="error-container">{error}</div>;
  if (data.length === 0) return <div className="empty-container">Vui lòng bấm nút "Xuất báo cáo" để xem báo cáo công nợ</div>;

  return (
    <div className="bccn-table-container">
      <table className="bccn-report-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className={header.id === "stt" ? "stt-header" : ""}>
                  {header.isPlaceholder ? null : header.column.columnDef.header}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={cell.column.id === "stt" ? "stt-cell" : ""}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 0 && (
        <div className="pagination-bccn">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="pagination-button-bccn"
          >
            ←
          </button>
          <form onSubmit={handlePageSubmit} className="nhap-sach-page-input-form">
            <span>Trang </span>
            <input
              type="number"
              value={pageInput}
              onChange={handlePageInputChange}
              min="1"
              max={table.getPageCount()}
              className="nhap-sach-page-input"
            />
            <span>/{Math.max(1, table.getPageCount())}</span>
          </form>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="pagination-button-bccn"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
});

export default TableCongNo;