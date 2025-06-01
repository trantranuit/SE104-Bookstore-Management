import React, { useState } from 'react';
import '../../styles/PathStyles.css';
import './PhanQuyen.css';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { addUser } from '../../services/phanQuyen.js';

function PhanQuyen() {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [showPassword, setShowPassword] = useState({});
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', phone: '', role: '', maNV: '', email: '', username: '' });
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [users, setUsers] = useState([
        { id: 1, maNV: 'NV001', username: 'nv001', name: 'Nguyễn Văn A', phone: '0901234567', email: 'a@gmail.com', password: '123456', role: 'Kho', lastAccess: '2023-10-01 10:00' },
        { id: 2, maNV: 'NV002', username: 'nv002', name: 'Trần Thị B', phone: '0912345678', email: 'b@gmail.com', password: 'abcdef', role: 'Thu Ngân', lastAccess: '2023-10-02 15:30' },
        { id: 3, maNV: 'NV003', username: 'nv003', name: 'Lê Văn C', phone: '0987654321', email: 'c@gmail.com', password: 'password', role: 'Quản Lý', lastAccess: '2023-10-03 09:45' },
    ]);
    const [message, setMessage] = useState('');
    const [showSavedModal, setShowSavedModal] = useState(false);

    const [rolePermissions, setRolePermissions] = useState(() => {
        return JSON.parse(localStorage.getItem('rolePermissions')) || {
            Kho: {},
            'Thu Ngân': {},
            'Quản Lý': {},
            Admin: {}
        };
    });
    const [rolePages, setRolePages] = useState(() => {
        return JSON.parse(localStorage.getItem('rolePages')) || {
            Kho: [],
            'Thu Ngân': [],
            'Quản Lý': [],
            Admin: []
        };
    });

    const pages = [
        'Trang Chủ',
        'Tra Cứu Sách',
        'Thêm Sách',
        'Nhập Sách',
        'Khách Hàng',
        'Thanh Toán',
        'Báo Cáo',
        'Thay Đổi Quy Định'
    ];

    const filteredUsers = users.filter(user =>
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (roleFilter === '' || user.role === roleFilter)
    );

    const handleTogglePassword = (id) => {
        setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleAddUser = async () => {
        // Ánh xạ role từ giao diện sang định dạng API
        const roleMapping = {
            'Kho': 'NguoiNhap',
            'Thu Ngân': 'ThuNgan',
            'Quản Lý': 'QuanLy',
            'Admin': 'Admin'
        };

        // Tách tên thành first_name và last_name
        const [firstName, ...lastNameParts] = newUser.name.trim().split(' ');
        const lastName = lastNameParts.join(' ');

        // Tạo dữ liệu người dùng theo định dạng API
        const userData = {
            username: newUser.username || newUser.maNV, // Ưu tiên username, fallback sang maNV
            password: `${firstName?.toLowerCase() || 'user'}_${(roleMapping[newUser.role] || newUser.role).toLowerCase()}`,
            email: newUser.email,
            first_name: firstName || '',
            last_name: lastName || '',
            role: roleMapping[newUser.role] || newUser.role
        };

        try {
            const response = await addUser(userData);
            setUsers([...users, {
                id: users.length + 1,
                maNV: newUser.maNV,
                username: userData.username,
                name: newUser.name,
                phone: newUser.phone,
                email: newUser.email,
                password: userData.password,
                role: newUser.role,
                lastAccess: 'Chưa truy cập',
            }]);
            setMessage('Thêm người dùng thành công!');
            setIsAddUserModalOpen(false);
            setNewUser({ name: '', phone: '', role: '', maNV: '', email: '', username: '' });
        } catch (error) {
            setMessage(error.message || 'Thêm người dùng thất bại, vui lòng kiểm tra lại!');
        }
    };

    const handleEditUser = (user) => {
        setEditUser({ ...user });
        setIsEditUserModalOpen(true);
    };

    const handleSaveEditUser = () => {
        setUsers(users.map(u => u.id === editUser.id ? editUser : u));
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

    const handlePageAccessChange = (role, page) => {
        setRolePages(prev => {
            const current = prev[role] || [];
            let updatedPages;
            if (current.includes(page)) {
                updatedPages = current.filter(p => p !== page);
            } else {
                updatedPages = [...current, page];
            }
            const updated = { ...prev, [role]: updatedPages };
            localStorage.setItem('rolePages', JSON.stringify(updated));
            return updated;
        });
    };

    const handleSaveRolePages = () => {
        localStorage.setItem('rolePages', JSON.stringify(rolePages));
        setShowSavedModal(true);
        setMessage('Đã lưu cấu hình quyền truy cập!');
        setTimeout(() => setShowSavedModal(false), 1500);
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Phân Quyền</h1>
            <div className="content-wrapper content-wrapper-pq">
                {showSavedModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.2)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            background: '#fff',
                            padding: '32px 48px',
                            borderRadius: 10,
                            fontSize: 22,
                            fontWeight: 'bold',
                            boxShadow: '0 2px 16px rgba(0,0,0,0.15)'
                        }}>
                            Đã lưu cấu hình quyền
                        </div>
                    </div>
                )}
                {message && <p className="message">{message}</p>}
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
                        <button className="add-user-button-pq" onClick={() => setIsAddUserModalOpen(true)}>Thêm Người Dùng</button>
                    </div>
                    <table className="user-table-pq">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Mã NV</th>
                                <th>Username</th>
                                <th>Họ Tên</th>
                                <th>Số điện thoại</th>
                                <th>Email</th>
                                <th>Mật Khẩu</th>
                                <th>Vai Trò</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.maNV}</td>
                                    <td>{user.username}</td>
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

                {isAddUserModalOpen && (
                    <div className="modal-overlay-pq">
                        <div className="modal-pq">
                            <h2 className="modal-title-pq">Thêm Người Dùng Mới</h2>
                            <div className="modal-content-pq">
                                <label>Username</label>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                />
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

                {isEditUserModalOpen && editUser && (
                    <div className="modal-overlay-pq">
                        <div className="modal-pq">
                            <h2 className="modal-title-pq">Sửa Người Dùng</h2>
                            <div className="modal-content-pq">
                                <label>Username</label>
                                <input type="text" value={editUser.username} disabled />
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
                            </div>
                            <div className="modal-buttons-pq">
                                <button className="apply-button-pq" onClick={handleSaveEditUser}>Lưu</button>
                                <button className="cancel-button-pq" onClick={() => setIsEditUserModalOpen(false)}>Hủy</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="role-config-block-pq" style={{ position: 'relative' }}>
                    <h2 className="page-title-pq">Cấu Hình Quyền</h2>
                    <button
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            margin: '8px 16px',
                            padding: '8px 20px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                        onClick={handleSaveRolePages}
                    >
                        Lưu
                    </button>
                    <table className="role-config-table-pq">
                        <thead>
                            <tr>
                                <th>Vai Trò</th>
                                {pages.map((page) => (
                                    <th key={page}>{page}</th>
                                ))}
                                <th>Phân Quyền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {['Kho', 'Thu Ngân', 'Quản Lý', 'Admin'].map((role) => (
                                <tr key={role}>
                                    <td>{role}</td>
                                    {pages.map((page) => (
                                        <td key={page} style={{ textAlign: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={rolePages[role]?.includes(page)}
                                                onChange={() => handlePageAccessChange(role, page)}
                                            />
                                        </td>
                                    ))}
                                    <td style={{ textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={rolePages[role]?.includes('Phân Quyền')}
                                            onChange={() => handlePageAccessChange(role, 'Phân Quyền')}
                                        />
                                    </td>
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
