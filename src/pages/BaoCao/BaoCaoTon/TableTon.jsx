import React, { useState, forwardRef, useImperativeHandle, useCallback, useEffect } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table";
import baoCaoTonService from "../../../services/baoCaoTonService";

const TableTon = forwardRef(({ month, year }, ref) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageInput, setPageInput] = useState(1);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const reports = await baoCaoTonService.getBaoCaoTon(month, year);
      if (reports && reports.length > 0) {
        setData(reports);
      } else {
        setData([]);
        setError(`Không có dữ liệu báo cáo tồn cho tháng ${month}/${year}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Có lỗi xảy ra khi tải dữ liệu");
      setData([]);
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
      header: "Mã Sách",
      accessorKey: "MaSach",
    },
    {
      header: "Tên Sách",
      accessorKey: "TenSach",
      cell: (info) => info.getValue() || "Không có tên",
    },
    {
      header: "Nhà xuất bản",
      accessorKey: "NXB",
      cell: (info) => info.getValue() || "Không có",
    },
    {
      header: "Năm xuất bản",
      accessorKey: "NamXB",
      cell: (info) => info.getValue() || "-",
    },
    {
      header: "Tồn Đầu",
      accessorKey: "TonDau",
      cell: (info) => info.getValue() || 0,
    },
    {
      header: "Phát Sinh",
      accessorKey: "PhatSinh",
      cell: (info) => info.getValue() || 0,
    },
    {
      header: "Tồn Cuối",
      accessorKey: "TonCuoi",
      cell: (info) => info.getValue() || 0,
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
      setPageInput(pageIndex + 1);
    }
  };

  // Loại bỏ useEffect tự động fetch dữ liệu khi month hoặc year thay đổi
  // Giờ việc fetch dữ liệu sẽ chỉ được thực hiện khi gọi hàm refreshData từ parent component

  if (isLoading) return <div className="loading-container">Đang tải dữ liệu...</div>;
  if (error && data.length === 0) return <div className="error-container">{error}</div>;
  if (data.length === 0) return <div className="empty-container">Vui lòng bấm nút "Xuất báo cáo" để xem báo cáo tồn</div>;

  return (
    <div className="bct-table-container">
      <table className="bct-report-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
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
                <td key={cell.id}>{cell.getValue()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 0 && (
        <div className="pagination-bct">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="pagination-button-bct"
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
            className="pagination-button-bct"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
});

export default TableTon;