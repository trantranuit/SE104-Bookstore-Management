import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import customerService from "../../services/customerService";
import CustomerModal from "./CustomerModal"; // Add this import
import "./KhachHang.css";

function TableKhachHang({ 
    searchTerm, 
    isModalOpen, 
    setIsModalOpen, 
    setCurrentCustomer, 
    refreshTrigger,
    setRefreshTrigger 
}) {
    // State for managing customers
    const [customers, setCustomers] = useState([]);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Add pagination state
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // Fetch customers from API on component mount and when searchTerm or refreshTrigger changes
    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await customerService.getAllCustomers(searchTerm);
                
                // Transform and filter the data locally as well for redundancy
                const transformedData = data
                    .map(customer => ({
                        id: customer.MaKhachHang,
                        name: customer.HoTen,
                        phone: customer.DienThoai,
                        email: customer.Email,
                        address: customer.DiaChi,
                        debtAmount: customer.SoTienNo,
                    }))
                    // Filter customer
                    .filter(customer => 
                        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        customer.phone.includes(searchTerm)
                    );
                
                setCustomers(transformedData);
            } catch (err) {
                setError("Failed to load customers. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [searchTerm, refreshTrigger]);

    const columns = [
        {
            header: 'MaKH',
            accessorKey: 'id',
            cell: ({ getValue }) => {
                const id = getValue();
                return `MA${id.toString().padStart(3, '0')}`;
            },
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
                            setCurrentCustomer(row.original);
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
    const handleAddCustomer = async (newCustomer) => {
        setLoading(true);
        try {
            const createdCustomer = await customerService.createCustomer(newCustomer);
            
            // Transform created customer to match your data structure
            const transformedCustomer = {
                id: createdCustomer.MaKhachHang.toString(),
                name: createdCustomer.HoTen,
                phone: createdCustomer.DienThoai,
                email: createdCustomer.Email,
                address: createdCustomer.DiaChi,
                debtAmount: createdCustomer.SoTienNo,
            };
            
            setCustomers(prevCustomers => [...prevCustomers, transformedCustomer]);
            setIsModalOpen(false);
        } catch (err) {
            setError("Failed to add customer. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCustomer = async (updatedCustomer) => {
        setLoading(true);
        try {
            const response = await customerService.updateCustomer(
                updatedCustomer.id, 
                updatedCustomer
            );
            
            // Transform updated customer to match your data structure
            const transformedCustomer = {
                id: response.MaKhachHang.toString(),
                name: response.HoTen,
                phone: response.DienThoai,
                email: response.Email,
                address: response.DiaChi,
                debtAmount: response.SoTienNo,
            };
            
            setCustomers(prevCustomers => 
                prevCustomers.map(customer => 
                    customer.id === transformedCustomer.id ? transformedCustomer : customer
                )
            );
            setIsModalOpen(false);
            setEditingCustomer(null);
        } catch (err) {
            setError("Failed to update customer. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle delete confirmation setup
    const handleDeleteCustomer = (id) => {
        setCustomerToDelete(id);
        setShowDeleteConfirmation(true);
    };

    // Handle delete confirmation
    const confirmDelete = async () => {
        setLoading(true);
        try {
            await customerService.deleteCustomer(customerToDelete);
            // Remove the customer from the local state
            setCustomers(prevCustomers => 
                prevCustomers.filter(customer => customer.id !== customerToDelete)
            );
            setShowDeleteConfirmation(false);
            setCustomerToDelete(null);
            // Trigger refresh to ensure data is in sync with server
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            setError("Failed to delete customer. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const table = useReactTable({
        data: customers,
        columns,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
            <div className="kh-table-container">
                {loading && <div className="loading-indicator">Loading...</div>}
                {error && <div className="error-message">{error}</div>}
                
                <table className="khachhang-report-table">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="khachhang-th">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="khachhang-tr">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="khachhang-td">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {customers.length === 0 && !loading && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '1rem' }}>
                                    No customers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
                {isModalOpen && (
                    <CustomerModal
                        customer={editingCustomer}
                        onSave={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
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
                                    disabled={loading}
                                >
                                    {loading ? 'Đang xóa...' : 'Xóa'}
                                </button>
                                <button 
                                    className="cancel-button"
                                    onClick={() => setShowDeleteConfirmation(false)}
                                    disabled={loading}
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