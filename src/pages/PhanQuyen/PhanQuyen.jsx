import React, { useState, useEffect } from 'react';
import '../../styles/PathStyles.css';
import './PhanQuyen.css';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { getUsers, addUser, updateUser, deleteUser } from '../../services/phanQuyen';

function PhanQuyen() {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ first_name: '', last_name: '', gioiTinh: '', role: '' });
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [addUserStep, setAddUserStep] = useState(1);
    const [editUserPassword, setEditUserPassword] = useState('');
    const [showEditPassword, setShowEditPassword] = useState(false);

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

    // Ánh xạ role API sang role ứng dụng
    const roleMapping = {
        NguoiNhap: 'Kho',
        NguoiThu: 'Thu Ngân',
        QuanLi: 'Quản Lý',
        Admin: 'Admin'
    };

    // Lấy danh sách người dùng từ API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userData = await getUsers();
                setUsers(userData);
            } catch (error) {
                setMessage(error.message);
            }
        };
        fetchUsers();
    }, []);

    // Lọc người dùng
    const filteredUsers = users.filter(user =>
        (`${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (roleFilter === '' || roleMapping[user.role] === roleFilter)
    );

    const getRolePrefix = (role) => {
        switch (role) {
            case 'NguoiNhap': return 'nguoinhap';
            case 'NguoiThu': return 'nguoithu';
            case 'QuanLi': return 'quanli';
            case 'Admin': return 'admin';
            default: return '';
        }
    };

    const handleAddUser = async () => {
        if (!newUser.first_name || !newUser.last_name || !newUser.gioiTinh || !newUser.role) {
            setMessage('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        // Generate default values
        const newId = users.length + 1;
        const rolePrefix = getRolePrefix(newUser.role);
        const defaultUsername = `${rolePrefix}${newId}`;
        const defaultPassword = `${rolePrefix}1234567`;

        const userData = {
            username: username || defaultUsername,
            password: password || defaultPassword,
            email: `${username || defaultUsername}@gmail.com`,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            gioiTinh: newUser.gioiTinh,
            role: newUser.role
        };

        try {
            await addUser(userData);
            const updatedUsers = await getUsers();
            setUsers(updatedUsers);
            setMessage('Thêm người dùng thành công!');
            setIsAddUserModalOpen(false);
            setNewUser({ first_name: '', last_name: '', gioiTinh: '', role: '' });
            setUsername('');
            setPassword('');
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleEditUser = (user) => {
        setEditUser({
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            gioiTinh: user.gioiTinh,
            role: user.role
        });
        setIsEditUserModalOpen(true);
    };

    // Update handleSaveEditUser function
    const handleSaveEditUser = async () => {
        if (!editUser.first_name || !editUser.last_name || !editUser.gioiTinh || !editUser.role) {
            setMessage('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        try {
            await updateUser(editUser.id, {
                email: editUser.email,
                first_name: editUser.first_name,
                last_name: editUser.last_name,
                gioiTinh: editUser.gioiTinh,
                role: editUser.role,
                password: editUserPassword // Add password to update data
            });
            const updatedUsers = await getUsers();
            setUsers(updatedUsers);
            setMessage('Cập nhật người dùng thành công!');
            setIsEditUserModalOpen(false);
            setEditUser(null);
            setEditUserPassword('');
            setShowEditPassword(false);
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await deleteUser(id);
            const updatedUsers = await getUsers();
            setUsers(updatedUsers);
            setMessage('Xóa người dùng thành công!');
        } catch (error) {
            setMessage(error.message);
        }
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
        setMessage('Đã lưu cấu hình quyền truy cập!');
        setTimeout(() => setMessage(''), 1500);
    };

    const handleNextStep = () => {
        if (!newUser.first_name || !newUser.last_name || !newUser.gioiTinh || !newUser.role) {
            setMessage('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        const rolePrefix = getRolePrefix(newUser.role);
        const newId = users.length + 1;
        const suggestedUsername = `${rolePrefix}${newId}`;
        const suggestedPassword = `${rolePrefix}1234567`;

        setUsername(suggestedUsername);
        setPassword(suggestedPassword);
        setAddUserStep(2);
        setMessage('');
    };

    // Update modal content based on step
    const renderAddUserModalContent = () => {
        if (addUserStep === 1) {
            return (
                <div className="modal-content-pq">
                    <label>Họ</label>
                    <input
                        type="text"
                        placeholder="Họ"
                        value={newUser.last_name}
                        onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                    />
                    <label>Tên</label>
                    <input
                        type="text"
                        placeholder="Tên"
                        value={newUser.first_name}
                        onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                    />
                    <label>Giới Tính</label>
                    <select
                        value={newUser.gioiTinh}
                        onChange={(e) => setNewUser({ ...newUser, gioiTinh: e.target.value })}
                    >
                        <option value="">Chọn Giới Tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                    <label>Vai Trò</label>
                    <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                        <option value="">Chọn Vai Trò</option>
                        <option value="NguoiNhap">Người Nhập</option>
                        <option value="NguoiThu">Người Thu</option>
                        <option value="QuanLi">Quản Lý</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <div className="modal-buttons-pq">
                        <button className="apply-button-pq" onClick={handleNextStep}>Tiếp tục</button>
                        <button className="cancel-button-pq" onClick={() => setIsAddUserModalOpen(false)}>Hủy</button>
                    </div>
                </div>
            );
        }

        return (
            <div className="modal-content-pq">
                <label>Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <label>Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        style={{ width: '100%' }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <div className="modal-buttons-pq">
                    <button className="apply-button-pq" onClick={handleAddUser}>Thêm</button>
                    <button className="cancel-button-pq" onClick={() => setAddUserStep(1)}>Quay lại</button>
                    <button className="cancel-button-pq" onClick={() => setIsAddUserModalOpen(false)}>Hủy</button>
                </div>
            </div>
        );
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Phân Quyền</h1>
            <div className="content-wrapper content-wrapper-pq">
                {message && (
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
                            boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '20px'
                        }}>
                            {message}
                            <button
                                onClick={() => setMessage('')}
                                style={{
                                    padding: '8px 24px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    marginTop: '10px'
                                }}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
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
                                <th>Username</th>
                                <th>Họ</th>
                                <th>Tên</th>
                                <th>Giới Tính</th>
                                <th>Email</th>
                                <th>Vai Trò</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.username}</td>
                                    <td>{user.last_name}</td>
                                    <td>{user.first_name}</td>
                                    <td>{user.gioiTinh}</td>
                                    <td>{user.email}</td>
                                    <td>{roleMapping[user.role] || user.role}</td>
                                    <td>
                                        <div className="action-buttons-pq">
                                            <button className="icon-button-pq" onClick={() => handleEditUser(user)}><FaEdit /></button>
                                            <button className="icon-button-pq" onClick={() => handleDeleteUser(user.id)}><FaTrash /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            Không tìm thấy người dùng nào.
                        </div>
                    )}
                </div>

                {isAddUserModalOpen && (
                    <div className="modal-overlay-pq">
                        <div className="modal-pq">
                            <h2 className="modal-title-pq">
                                {addUserStep === 1 ? 'Thông tin người dùng' : 'Tài khoản đăng nhập'}
                            </h2>
                            {message && (
                                <div style={{ color: 'red', marginBottom: '10px' }}>
                                    {message}
                                </div>
                            )}
                            {renderAddUserModalContent()}
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
                                <label>Họ</label>
                                <input
                                    type="text"
                                    value={editUser.last_name || ''}
                                    onChange={e => setEditUser({ ...editUser, last_name: e.target.value })}
                                />
                                <label>Tên</label>
                                <input
                                    type="text"
                                    value={editUser.first_name || ''}
                                    onChange={e => setEditUser({ ...editUser, first_name: e.target.value })}
                                />
                                <label>Giới Tính</label>
                                <select
                                    value={editUser.gioiTinh || ''}
                                    onChange={e => setEditUser({ ...editUser, gioiTinh: e.target.value })}
                                >
                                    <option value="">Chọn Giới Tính</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                                <label>Email</label>
                                <input type="email" value={editUser.email} disabled />
                                <label>Vai Trò</label>
                                <select
                                    value={editUser.role || ''}
                                    onChange={e => setEditUser({ ...editUser, role: e.target.value })}
                                >
                                    <option value="">Chọn Vai Trò</option>
                                    <option value="NguoiNhap">Người Nhập</option>
                                    <option value="NguoiThu">Người Thu</option>
                                    <option value="QuanLi">Quản Lý</option>
                                    <option value="Admin">Admin</option>
                                </select>
                                {/* Add password input field */}
                                <label>Mật khẩu mới (để trống nếu không đổi)</label>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type={showEditPassword ? "text" : "password"}
                                        value={editUserPassword}
                                        onChange={e => setEditUserPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu mới"
                                        style={{ width: '100%' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowEditPassword(!showEditPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {showEditPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
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