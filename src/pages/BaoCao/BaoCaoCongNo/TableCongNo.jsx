import React from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";

function TableCongNo({ data }) {
  const columns = [
    {
      header: "STT",
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
          <span className="pagination-info-bccn">
            Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
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
}

export default TableCongNo;