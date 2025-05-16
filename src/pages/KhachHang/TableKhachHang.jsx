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
import CustomerModal from './CustomerModal';

function TableKhachHang({ searchTerm, isModalOpen, setIsModalOpen }) {
    // State for managing customers
    const [customers, setCustomers] = React.useState(customerData);
    const [editingCustomer, setEditingCustomer] = React.useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
    const [customerToDelete, setCustomerToDelete] = React.useState(null);
    
    // Add pagination state
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const columns = [
        {
            header: 'MaKH',
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
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'Địa chỉ',
            accessorKey: 'address',
        },
        {
            header: 'Số tiền nợ',
            accessorKey: 'debtAmount',
            cell: ({ getValue }) => `${getValue().toLocaleString('vi-VN')} VND`
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
        
        const newCustomers = [...customers, {
            ...newCustomer,
            id: newId
        }];
        setCustomers(newCustomers);
        setIsModalOpen(false);
    };

    // Handle edit customer
    const handleEditCustomer = (editedCustomer) => {
        const updatedCustomers = customers.map(customer => 
            customer.id === editedCustomer.id ? editedCustomer : customer
        );
        setCustomers(updatedCustomers);
        setIsModalOpen(false);
        setEditingCustomer(null);
    };

    // Handle delete customer
    const handleDeleteCustomer = (customerId) => {
        setCustomerToDelete(customerId);
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = () => {
        const currentPage = pagination.pageIndex;
        const updatedCustomers = customers.filter(customer => customer.id !== customerToDelete);
        setCustomers(updatedCustomers);
        
        // Calculate if we need to adjust the page number
        const totalPages = Math.ceil(updatedCustomers.length / pagination.pageSize);
        if (currentPage >= totalPages && totalPages > 0) {
            setPagination(prev => ({
                ...prev,
                pageIndex: totalPages - 1
            }));
        }
        setShowDeleteConfirmation(false);
        setCustomerToDelete(null);
    };

    // Filter data based on search term
    const filteredData = React.useMemo(() => {
        if (!searchTerm) return customers;
        
        const searchTermLower = searchTerm.toLowerCase();
        return customers.filter(customer => {
            return (
                customer.id.toLowerCase().includes(searchTermLower) ||
                customer.name.toLowerCase().includes(searchTermLower)
            );
        });
    }, [searchTerm, customers]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        manualPagination: false,
        autoResetPageIndex: false, // Prevent page reset on data changes
    });

    return (
        <div className="kh-table-container">
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

            {/* Thêm modal confirmation ở đây */}
            {showDeleteConfirmation && (
                <div className="confirmation-modal">
                    <div className="confirmation-content">
                        <p>Bạn có chắc muốn xóa khách hàng này không?</p>
                        <div className="confirmation-actions">
                            <button 
                                className="delete-button"
                                onClick={confirmDelete}
                            >
                                Xóa
                            </button>
                            <button 
                                className="cancel-button"
                                onClick={() => setShowDeleteConfirmation(false)}
                            >
                                Huỷ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TableKhachHang;