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
            role: user.role
        }));
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Lỗi khi lấy danh sách người dùng');
    }
};

// Hàm thêm người dùng
export const addUser = async (userData) => {
    try {
        const response = await axiosInstance.post("/user/", userData);
        return {
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            gioiTinh: response.data.gioiTinh,
            role: response.data.role
        };
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Lỗi khi thêm người dùng');
    }
};

// Hàm cập nhật người dùng
export const updateUser = async (id, userData) => {
    try {
        const response = await axiosInstance.put(`/user/${id}/update_profile/`, userData);
        return {
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            gioiTinh: response.data.gioiTinh,
            role: response.data.role
        };
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