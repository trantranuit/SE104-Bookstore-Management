// src/api.js
import axios from 'axios';

// Cấu hình base URL cho API
const API_URL = 'http://localhost:8000/api/usermanagement/';

// Hàm thêm người dùng mới
export const addUser = async (userData) => {
    try {
        const response = await axios.post(API_URL, userData, {
            headers: {
                'Content-Type': 'application/json',
                // Nếu API yêu cầu token, thêm vào đây
                // 'Authorization': `Bearer ${yourToken}`
            }
        });
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        // Xử lý lỗi và ném thông báo chi tiết
        throw new Error(error.response?.data?.error || 'Lỗi khi thêm người dùng');
    }
};