import React from 'react';
import { 
    useReactTable, 
    getCoreRowModel,
    getPaginationRowModel 
} from '@tanstack/react-table';

function TableCongNo({ data, pageSize }) {
    const columns = [
        {
            header: 'Mã Khách Hàng',
            accessorKey: 'id',
        },
        {
            header: 'Tên Khách Hàng',
            accessorKey: 'name',
        },
        {
            header: 'Số Điện Thoại',
            accessorKey: 'phone',
        },
        {
            header: 'Nợ đầu',
            accessorKey: 'startDebt',
        },
        {
            header: 'Phát sinh',
            accessorKey: 'change',
        },
        {
            header: 'Nợ cuối',
            accessorKey: 'endDebt',
        }
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize,
            },
        },
    });

    return (
        <div>
            <table className="report-table">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : header.column.columnDef.header}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {cell.getValue()}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    ←
                </button>
                <span>
                    Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                </span>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    →
                </button>
            </div>
        </div>
    );
}

export default TableCongNo;