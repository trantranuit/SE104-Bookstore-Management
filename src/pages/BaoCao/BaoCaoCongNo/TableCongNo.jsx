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
        header: 'MaKH',
        accessorKey: 'id',
        cell: ({ row }) => {
            const id = row.original.id;
            return `MA${String(id).padStart(3, '0')}`;
        },
    },
    {
      header: "Tên KH",
      accessorKey: "name",
    },
    {
      header: "Số Điện Thoại",
      accessorKey: "phone",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Nợ đầu",
      accessorKey: "startDebt",
      cell: (info) => `${info.getValue().toLocaleString("vi-VN")} VND`,
    },
    {
      header: "Phát sinh",
      accessorKey: "change",
      cell: (info) => `${info.getValue().toLocaleString("vi-VN")} VND`,
    },
    {
      header: "Nợ cuối",
      accessorKey: "endDebt",
      cell: (info) => `${info.getValue().toLocaleString("vi-VN")} VND`,
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
    <>
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
      </div>
      <div className="pagination">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="pagination-button"
        >
          ←
        </button>
        <span className="pagination-info">
          Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="pagination-button"
        >
          →
        </button>
      </div>
    </>
  );
}

export default TableCongNo;