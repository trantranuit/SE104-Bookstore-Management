import React, { useState, useEffect } from 'react';
import { 
    useReactTable, 
    getCoreRowModel,
    getPaginationRowModel 
} from '@tanstack/react-table';
import baoCaoCongNoData from './BaoCaoCongNoData';

function TableCongNo() {
    const [pageSize, setPageSize] = useState(calculatePageSize()); // State cho page size

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

    // Hàm tính toán page size dựa trên chiều cao cửa sổ
    function calculatePageSize() {
        const windowHeight = window.innerHeight; // Chiều cao cửa sổ
        const headerHeight = 150; // Chiều cao header (ước tính)
        const rowHeight = 50; // Chiều cao mỗi hàng trong bảng (ước tính)
        return Math.floor((windowHeight - headerHeight) / rowHeight); // Số hàng có thể hiển thị
    }

    // Lắng nghe sự kiện resize để cập nhật page size
    useEffect(() => {
        const handleResize = () => {
            setPageSize(calculatePageSize());
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Tạo bảng với dữ liệu và cột
    const table = useReactTable({
        data: baoCaoCongNoData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize, // Sử dụng pageSize linh hoạt
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
