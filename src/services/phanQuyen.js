import axiosInstance from "./AxiosConfig";

// Hàm lấy danh sách người dùng
export const getUsers = async () => {
    try {
        const response = await axiosInstance.get("/user/");
        const users = response.data;
        return users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            gioiTinh: user.gioiTinh,
            role: user.role,
            is_active: user.is_active
        }));
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Lỗi khi lấy danh sách người dùng');
    }
};

// Hàm thêm người dùng mới (create staff)
export const addUser = async (userData) => {
    try {
        const response = await axiosInstance.post("/user/create_staff/", {
            "username": userData.username,
            "password": userData.password,
            "role": userData.role,
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            gioiTinh: userData.gioiTinh
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail);
    }
};

// Hàm cập nhật thông tin người dùng
export const updateUser = async (id, userData) => {
    try {
        // Cập nhật thông tin cơ bản
        const response = await axiosInstance.put(`/user/${id}/update_profile/`, {
            email: userData.email || "",
            first_name: userData.first_name,
            last_name: userData.last_name,
            gioiTinh: userData.gioiTinh,
            role: userData.role
        });

        // Xử lý trạng thái
        if (userData.is_active !== undefined) {
            if (userData.is_active) {
                await reactivateUser(id);
            } else {
                await deactivateUser(id);
            }
        }

        // Xử lý mật khẩu
        if (userData.password) {
            await changeUserPassword(id, userData.password);
        }

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Lỗi khi cập nhật người dùng');
    }
};

// Hàm xóa người dùng
export const deleteUser = async (id) => {
    try {
        await axiosInstance.delete(`/user/${id}/`);
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Lỗi khi xóa người dùng');
    }
};

// Thêm hàm đổi mật khẩu
export const changeUserPassword = async (id, newPassword) => {
    try {
        await axiosInstance.post(`/user/${id}/change_password/`, {
            new_password: newPassword
        });
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Lỗi khi đổi mật khẩu');
    }
};

// Hàm kích hoạt người dùng
export const reactivateUser = async (id) => {
    try {
        await axiosInstance.post(`/user/${id}/reactivate/`);
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Lỗi khi kích hoạt người dùng');
    }
};

// Hàm vô hiệu hóa người dùng
export const deactivateUser = async (id) => {
    try {
        await axiosInstance.post(`/user/${id}/deactivate/`);
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Lỗi khi vô hiệu hóa người dùng');
    }
};

// Hàm thêm vai trò mới
export const addRole = async (roleName) => {
    try {
        const response = await axiosInstance.post("/groups/", {
            "name": roleName
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Lỗi khi thêm vai trò mới');
    }
};