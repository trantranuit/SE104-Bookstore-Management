import React, { useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import baoCaoTonService from '../../../services/baoCaoTonService';

function TableTon({ month, year }) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const columns = [
        {
            header: 'STT',
            accessorFn: (row, index) => index + 1,
            cell: info => <div className="stt-cell">{info.getValue()}</div>
        },
        {
            header: 'Mã Sách',
            accessorKey: 'MaSach',
        },
        {
            header: 'Tên Sách',
            accessorKey: 'TenSach',
            cell: info => info.getValue() || 'Không có tên'
        },
        {
            header: 'NXB',
            accessorKey: 'NXB',
            cell: info => info.getValue() || 'Không có'
        },
        {
            header: 'Năm XB',
            accessorKey: 'NamXB',
            cell: info => info.getValue() || '-'
        },
        {
            header: 'Tồn đầu',
            accessorKey: 'TonDau',
            cell: info => info.getValue() || 0
        },
        {
            header: 'Phát sinh',
            accessorKey: 'PhatSinh',
            cell: info => info.getValue() || 0
        },
        {
            header: 'Tồn cuối',
            accessorKey: 'TonCuoi',
            cell: info => info.getValue() || 0
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

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const reports = await baoCaoTonService.getBaoCaoTon(month, year);
                
                if (reports && reports.length > 0) {
                    setData(reports);
                    setError(null);
                } else {
                    setData([]);
                    setError('Không có dữ liệu cho thời gian này');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Có lỗi xảy ra khi tải dữ liệu');
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (month && year) {
            fetchData();
        }
    }, [month, year]);

    if (isLoading) return <div className="loading-container">Đang tải dữ liệu...</div>;
    if (error) return <div className="error-container">Lỗi: {error}</div>;
    if (data.length === 0) return <div className="empty-data-container">Không có dữ liệu báo cáo tồn cho tháng {month}/{year}</div>;

    return (
        <>
            <div className="bct-table-container">
                <table className="bct-report-table">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {header.isPlaceholder ? null : header.column.columnDef.header}
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

export default TableTon;