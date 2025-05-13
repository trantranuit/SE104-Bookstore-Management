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
    const [newUser, setNewUser] = useState({ name: '', role: '', maNV: '', email: '' });

    const users = [
        { id: 1, maNV: 'NV001', name: 'Nguyễn Văn A', email: 'a@gmail.com', password: '123456', role: 'Kho', status: 'Đang hoạt động', lastAccess: '2023-10-01 10:00' },
        { id: 2, maNV: 'NV002', name: 'Trần Thị B', email: 'b@gmail.com', password: 'abcdef', role: 'Thu Ngân', status: 'Tạm nghỉ', lastAccess: '2023-10-02 15:30' },
        { id: 3, maNV: 'NV003', name: 'Lê Văn C', email: 'c@gmail.com', password: 'password', role: 'Quản Lý', status: 'Đang hoạt động', lastAccess: '2023-10-03 09:45' },
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
            email: newUser.email,
            password: generatedPassword,
            role: newUser.role,
            status: 'Đang hoạt động',
            lastAccess: 'Chưa truy cập',
        };
        users.push(newUserData); // Add the new user to the list
        setIsAddUserModalOpen(false); // Close the modal
        setNewUser({ name: '', role: '', maNV: '', email: '' }); // Reset the form
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Phân Quyền</h1>
            <div className="content-wrapper">
            {/* User List Block */}
            <div className="user-list-block">
                <h2>Danh Sách Người Dùng</h2>
                <div className="user-list-filters">
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
                    <button className="add-user-button" onClick={() => setIsAddUserModalOpen(true)}>Thêm Người Dùng</button>
                </div>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Mã NV</th>
                            <th>Họ Tên</th>
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
                                <td>{user.email}</td>
                                <td>
                                    <div className="password-cell">
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
                                    <div className="action-buttons">
                                        <button className="icon-button"><FaEdit /></button>
                                        <button className="icon-button"><FaTrash /></button>
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
                        <h2 className="modal-title-pq">Thêm Người Dùng Mới</h2> {/* Updated title */}
                        <div className="modal-content-pq">
                            <input
                                type="text"
                                placeholder="Họ Tên"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Mã Nhân Viên"
                                value={newUser.maNV}
                                onChange={(e) => setNewUser({ ...newUser, maNV: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
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
                        <div className="modal-buttons"> {/* Buttons moved below the dropdown */}
                            <button className="apply-button" onClick={handleAddUser}>Thêm</button>
                            <button className="cancel-button" onClick={() => setIsAddUserModalOpen(false)}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Role Configuration Block */}
            <div className="role-config-block">
                <h2>Cấu Hình Quyền</h2>
                <table className="role-config-table">
                    <thead>
                        <tr>
                            <th>Vai Trò</th>
                            <th>Trang Chủ</th>
                            <th>Tất Cả Sách</th>
                            <th>Nhập Sách</th>
                            <th>Thanh Toán</th>
                            <th>Khách Hàng</th>
                            <th>Báo Cáo</th>
                            <th>Thay Đổi Quy Định</th>
                        </tr>
                    </thead>
                    <tbody>
                        {['Kho', 'Thu Ngân', 'Quản Lý'].map((role) => (
                            <tr key={role}>
                                <td>{role}</td>
                                {['Trang Chủ', 'Tất Cả Sách', 'Nhập Sách', 'Thanh Toán', 'Khách Hàng', 'Báo Cáo', 'Thay Đổi Quy Định'].map((page) => (
                                    <td key={page}>
                                        <select>
                                            <option value="none">Không</option> {/* New option */}
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