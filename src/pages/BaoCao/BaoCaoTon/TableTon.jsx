import React from 'react';
import { 
    useReactTable, 
    getCoreRowModel,
    getPaginationRowModel 
} from '@tanstack/react-table';

function TableCongNo({ data }) {
    const columns = [
        {
            header: 'STT',
            accessorFn: (row, index) => index + 1,
            cell: info => <div className="stt-cell">{info.getValue()}</div>
        },
        {
            header: 'Mã Sách',
            accessorKey: 'id',
        },
        {
            header: 'Tên Sách',
            accessorKey: 'name',
        },
        {
            header: 'Tác Giả',
            accessorKey: 'author',
        },
        {
            header: 'Thể Loại',
            accessorKey: 'category',
        },
        {
            header: 'Tồn đầu',
            accessorKey: 'startStock',
        },
        {
            header: 'Phát sinh',
            accessorKey: 'change',
        },
        {
            header: 'Tồn cuối',
            accessorKey: 'endStock',
        }
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
            <div className="table-container">
                <table className="report-table">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className={header.id === 'stt' ? 'stt-header' : ''}>
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
                                    <td key={cell.id} className={cell.column.id === 'stt' ? 'stt-cell' : ''}>
                                        {cell.getValue()}
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