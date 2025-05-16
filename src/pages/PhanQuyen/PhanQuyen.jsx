import React, { useState } from 'react';
import '../../styles/PathStyles.css';
import './PhanQuyen.css';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

function PhanQuyen() {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showPassword, setShowPassword] = useState({});
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false); // State for add user modal
    const [newUser, setNewUser] = useState({ name: '', phone: '', role: '', maNV: '', email: '' });
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [rolePermissions, setRolePermissions] = useState(() => {
        // Load from localStorage or initialize default
        return JSON.parse(localStorage.getItem('rolePermissions')) || {
            Kho: {},
            'Thu Ngân': {},
            'Quản Lý': {},
            Admin: {}
        };
    });

    const pages = [
        'Trang Chủ',
        'Tất Cả Sách',
        'Nhập Sách',
        'Thanh Toán',
        'Khách Hàng',
        'Báo Cáo',
        'Thay Đổi Quy Định'
    ];

    const users = [
        { id: 1, maNV: 'NV001', name: 'Nguyễn Văn A', phone: '0901234567', email: 'a@gmail.com', password: '123456', role: 'Kho', status: 'Đang hoạt động', lastAccess: '2023-10-01 10:00' },
        { id: 2, maNV: 'NV002', name: 'Trần Thị B', phone: '0912345678', email: 'b@gmail.com', password: 'abcdef', role: 'Thu Ngân', status: 'Tạm nghỉ', lastAccess: '2023-10-02 15:30' },
        { id: 3, maNV: 'NV003', name: 'Lê Văn C', phone: '0987654321', email: 'c@gmail.com', password: 'password', role: 'Quản Lý', status: 'Đang hoạt động', lastAccess: '2023-10-03 09:45' },
    ];

    const filteredUsers = users.filter(user =>
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (roleFilter === '' || user.role === roleFilter) &&
        (statusFilter === '' || user.status === statusFilter)
    );

    const handleTogglePassword = (id) => {
        setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleAddUser = () => {
        const generatedPassword = `${newUser.name.split(' ')[0].toLowerCase()}_${newUser.role.toLowerCase()}`;
        const newUserData = {
            id: users.length + 1,
            maNV: newUser.maNV,
            name: newUser.name,
            phone: newUser.phone,
            email: newUser.email,
            password: generatedPassword,
            role: newUser.role,
            status: 'Đang hoạt động',
            lastAccess: 'Chưa truy cập',
        };
        users.push(newUserData); // Add the new user to the list
        setIsAddUserModalOpen(false); // Close the modal
        setNewUser({ name: '', phone: '', role: '', maNV: '', email: '' }); // Reset the form
    };

    const handleEditUser = (user) => {
        setEditUser({ ...user });
        setIsEditUserModalOpen(true);
    };

    const handleSaveEditUser = () => {
        // Update user in users array (mock, not persistent)
        const idx = users.findIndex(u => u.id === editUser.id);
        if (idx !== -1) {
            users[idx] = {
                ...users[idx],
                phone: editUser.phone,
                role: editUser.role,
                status: editUser.status,
                password: editUser.password // allow password update
            };
        }
        setIsEditUserModalOpen(false);
        setEditUser(null);
    };

    const handlePermissionChange = (role, page, value) => {
        const updated = {
            ...rolePermissions,
            [role]: { ...rolePermissions[role], [page]: value }
        };
        setRolePermissions(updated);
        localStorage.setItem('rolePermissions', JSON.stringify(updated));
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Phân Quyền</h1>
            <div className="content-wrapper content-wrapper-pq">
                {/* User List Block */}
                <div className="user-list-block-pq">
                    <h2 className="page-title-pq">Danh Sách Người Dùng</h2>
                    <div className="user-list-filters-pq">
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                            <option value="">Lọc theo vai trò</option>
                            <option value="Kho">Kho</option>
                            <option value="Thu Ngân">Thu Ngân</option>
                            <option value="Quản Lý">Quản Lý</option>
                            <option value="Admin">Admin</option>
                        </select>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">Lọc theo trạng thái</option>
                            <option value="Đang hoạt động">Đang hoạt động</option>
                            <option value="Tạm nghỉ">Tạm nghỉ</option>
                        </select>
                        <button className="add-user-button-pq" onClick={() => setIsAddUserModalOpen(true)}>Thêm Người Dùng</button>
                    </div>
                    <table className="user-table-pq">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Mã NV</th>
                                <th>Họ Tên</th>
                                <th>Số điện thoại</th>
                                <th>Email</th>
                                <th>Mật Khẩu</th>
                                <th>Vai Trò</th>
                                <th>Trạng Thái</th>
                                <th>Thời Gian Truy Cập Cuối Cùng</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.maNV}</td>
                                    <td>{user.name}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div className="password-cell-pq">
                                            {showPassword[user.id] ? user.password : '******'}
                                            <button onClick={() => handleTogglePassword(user.id)}>
                                                {showPassword[user.id] ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </td>
                                    <td>{user.role}</td>
                                    <td>{user.status}</td>
                                    <td>{user.lastAccess}</td>
                                    <td>
                                        <div className="action-buttons-pq">
                                            <button className="icon-button-pq" onClick={() => handleEditUser(user)}><FaEdit /></button>
                                            <button className="icon-button-pq"><FaTrash /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add User Modal */}
                {isAddUserModalOpen && (
                    <div className="modal-overlay-pq">
                        <div className="modal-pq">
                            <h2 className="modal-title-pq">Thêm Người Dùng Mới</h2>
                            <div className="modal-content-pq">
                                <label>Họ Tên</label>
                                <input
                                    type="text"
                                    placeholder="Họ Tên"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                />
                                <label>Số điện thoại</label>
                                <input
                                    type="text"
                                    placeholder="Số điện thoại"
                                    value={newUser.phone}
                                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                />
                                <label>Mã Nhân Viên</label>
                                <input
                                    type="text"
                                    placeholder="Mã Nhân Viên"
                                    value={newUser.maNV}
                                    onChange={(e) => setNewUser({ ...newUser, maNV: e.target.value })}
                                />
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                />
                                <label>Vai Trò</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="">Chọn Vai Trò</option>
                                    <option value="Kho">Kho</option>
                                    <option value="Thu Ngân">Thu Ngân</option>
                                    <option value="Quản Lý">Quản Lý</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div className="modal-buttons-pq">
                                <button className="apply-button-pq" onClick={handleAddUser}>Thêm</button>
                                <button className="cancel-button-pq" onClick={() => setIsAddUserModalOpen(false)}>Hủy</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {isEditUserModalOpen && editUser && (
                    <div className="modal-overlay-pq">
                        <div className="modal-pq">
                            <h2 className="modal-title-pq">Sửa Người Dùng</h2>
                            <div className="modal-content-pq">
                                <label>Họ Tên</label>
                                <input type="text" value={editUser.name} disabled />
                                <label>Mã Nhân Viên</label>
                                <input type="text" value={editUser.maNV} disabled />
                                <label>Email</label>
                                <input type="email" value={editUser.email} disabled />
                                <label>Số điện thoại</label>
                                <input
                                    type="text"
                                    value={editUser.phone}
                                    onChange={e => setEditUser({ ...editUser, phone: e.target.value })}
                                />
                                <label>Mật Khẩu</label>
                                <input
                                    type="text"
                                    value={editUser.password}
                                    onChange={e => setEditUser({ ...editUser, password: e.target.value })}
                                />
                                <label>Vai Trò</label>
                                <select
                                    value={editUser.role}
                                    onChange={e => setEditUser({ ...editUser, role: e.target.value })}
                                >
                                    <option value="Kho">Kho</option>
                                    <option value="Thu Ngân">Thu Ngân</option>
                                    <option value="Quản Lý">Quản Lý</option>
                                    <option value="Admin">Admin</option>
                                </select>
                                <label>Trạng Thái</label>
                                <select
                                    value={editUser.status}
                                    onChange={e => setEditUser({ ...editUser, status: e.target.value })}
                                >
                                    <option value="Đang hoạt động">Đang hoạt động</option>
                                    <option value="Tạm nghỉ">Tạm nghỉ</option>
                                </select>
                            </div>
                            <div className="modal-buttons-pq">
                                <button className="apply-button-pq" onClick={handleSaveEditUser}>Lưu</button>
                                <button className="cancel-button-pq" onClick={() => setIsEditUserModalOpen(false)}>Hủy</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Role Configuration Block */}
                <div className="role-config-block-pq">
                    <h2 className="page-title-pq">Cấu Hình Quyền</h2>
                    <table className="role-config-table-pq">
                        <thead>
                            <tr>
                                <th>Vai Trò</th>
                                {pages.map((page) => (
                                    <th key={page}>{page}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {['Kho', 'Thu Ngân', 'Quản Lý', 'Admin'].map((role) => (
                                <tr key={role}>
                                    <td>{role}</td>
                                    {pages.map((page) => (
                                        <td key={page}>
                                            <select
                                                value={rolePermissions[role]?.[page] || 'none'}
                                                onChange={e => handlePermissionChange(role, page, e.target.value)}
                                            >
                                                <option value="none">Không</option>
                                                <option value="view">Chỉ Xem</option>
                                                <option value="edit">Được Sửa</option>
                                            </select>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PhanQuyen;