import React from 'react';
import { 
    useReactTable, 
    getCoreRowModel,
    getPaginationRowModel 
} from '@tanstack/react-table';
import baoCaoCongNoData from './BaoCaoCongNoData';

function TableCongNo() {
    const columns = [
        {
            header: 'Mã KH',
            accessorKey: 'id',
        },
        {
            header: 'Tên KH',
            accessorKey: 'name',
        },
        {
            header: 'SĐT',
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
        },
        {
            header: 'Ghi chú',
            accessorKey: 'note',
        },
    ];

    const table = useReactTable({
        data: baoCaoCongNoData,
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