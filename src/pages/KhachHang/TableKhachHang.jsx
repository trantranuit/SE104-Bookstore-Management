import React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
} from '@tanstack/react-table';
import customerData from './KhachHangData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function TableKhachHang() {
    const columns = [
        {
            header: 'Mã khách hàng',
            accessorKey: 'id',
        },
        {
            header: 'Tên khách hàng',
            accessorKey: 'name',
        },
        {
            header: 'Mã hoá đơn',
            accessorKey: 'invoiceId',
        },
        {
            header: 'Số lượng',
            accessorKey: 'quantity',
        },
        {
            header: 'Ghi chú',
            accessorKey: 'note',
            cell: (info) => (
                <div>
                    <FontAwesomeIcon icon={faEdit} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                    <FontAwesomeIcon icon={faTrash} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: customerData,
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
            </div>

            <div className="pagination">
                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    {'<'}
                </button>
                <span>
                    Trang {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    {'>'}
                </button>
            </div>
        </>
    );
}

export default TableKhachHang;