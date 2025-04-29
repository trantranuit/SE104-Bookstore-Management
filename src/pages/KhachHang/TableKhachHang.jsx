import React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
} from '@tanstack/react-table';
import './KhachHang.css';
import customerData from './KhachHangData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function TableKhachHang({searchTerm}) {
    const columns = [
        {
            header: 'Mã khách hàng',
            accessorKey: 'id',
            size: 150
        },
        {
            header: 'Tên khách hàng',
            accessorKey: 'name',
        },
        {
            header: 'Số điện thoại', 
            accessorKey: 'phone',
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
            header: 'Thao tác',
            accessorKey: 'actions',
            cell: () => (
                <div className="khachhang-action-buttons">
                    <FontAwesomeIcon icon={faEdit} className="khachhang-edit-icon" />
                    <FontAwesomeIcon icon={faTrash} className="khachhang-delete-icon" />
                </div>
            ),
        },
    ];

    const filteredData = React.useMemo(() => {
        return customerData.filter(customer => {
            const searchTermLower = searchTerm.toLowerCase();
            return (
                customer.id.toLowerCase().includes(searchTermLower) ||
                customer.name.toLowerCase().includes(searchTermLower)||
                customer.invoiceId.toLowerCase().includes(searchTermLower)
            );
        });
    }, [searchTerm]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 9,
            },
        },
    });

    return (
        <>
            <table className="khachhang-report-table">
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
                                    {cell.column.columnDef.cell ? 
                                        cell.column.columnDef.cell(cell) : 
                                        cell.getValue()}
                                </td>
                            ))}
                        </tr>
                    ))}
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
        </>
    );
}

export default TableKhachHang;
