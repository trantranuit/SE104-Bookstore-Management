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
import CustomerModal from './CustomerModal'; // Add this import


function TableKhachHang({searchTerm}) {
    // State for managing customers
    const [customers, setCustomers] = React.useState(customerData);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingCustomer, setEditingCustomer] = React.useState(null);

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
            cell: ({row}) => (
                <div className="khachhang-action-buttons">
                    <FontAwesomeIcon 
                        icon={faEdit} 
                        className="khachhang-edit-icon" 
                        onClick={() => {
                            setEditingCustomer(row.original);
                            setIsModalOpen(true);
                        }}
                    />
                    <FontAwesomeIcon 
                        icon={faTrash} 
                        className="khachhang-delete-icon"
                        onClick={() => handleDeleteCustomer(row.original.id)}
                    />
                </div>
            ),
        },
    ];

    // Handle add customer
    const handleAddCustomer = (newCustomer) => {
        const lastId = customers[customers.length - 1].id;
        const newId = 'KH' + String(parseInt(lastId.substring(2)) + 1).padStart(3, '0');
        
        setCustomers([...customers, {
            ...newCustomer,
            id: newId
        }]);
        setIsModalOpen(false);
    };

    // Handle edit customer
    const handleEditCustomer = (editedCustomer) => {
        setCustomers(customers.map(customer => 
            customer.id === editedCustomer.id ? editedCustomer : customer
        ));
        setIsModalOpen(false);
        setEditingCustomer(null);
    };

    // Handle delete customer
    const handleDeleteCustomer = (customerId) => {
        if (window.confirm('Bạn có chắc muốn xóa khách hàng này?')) {
            setCustomers(customers.filter(customer => customer.id !== customerId));
        }
    };

    // Filter data based on search term
    const filteredData = React.useMemo(() => {
        if (!searchTerm) return customers;
        
        const searchTermLower = searchTerm.toLowerCase();
        return customers.filter(customer => {
            return (
                customer.id.toLowerCase().includes(searchTermLower) ||
                customer.name.toLowerCase().includes(searchTermLower) ||
                customer.invoiceId.toLowerCase().includes(searchTermLower)
            );
        });
    }, [searchTerm, customers]);

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
            
            {isModalOpen && (
                <CustomerModal
                    customer={editingCustomer}
                    onSave={editingCustomer ? handleEditCustomer : handleAddCustomer}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingCustomer(null);
                    }}
                />
            )}

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